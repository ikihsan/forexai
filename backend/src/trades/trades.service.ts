import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketDataService } from '../market-data/market-data.service';
import { AIService } from '../ai/ai.service';

@Injectable()
export class TradesService {
  constructor(
    private prisma: PrismaService,
    private marketDataService: MarketDataService,
    private aiService: AIService,
  ) {}

  async createTrade(
    userId: string,
    forexPair: string,
    tradeType: 'BUY' | 'SELL',
    amount: number,
    aiModelUsed?: string,
  ) {
    // Get current market price
    const entryPrice = await this.marketDataService.getLatestPrice(forexPair);
    
    // Calculate commission (2%)
    const commission = amount * 0.02;

    // Create trade
    const trade = await this.prisma.trade.create({
      data: {
        userId,
        forexPair,
        tradeType,
        amount,
        entryPrice,
        commission,
        status: 'OPEN',
        aiModelUsed,
        openedAt: new Date(),
      },
    });

    // Create commission log
    await this.prisma.commissionLog.create({
      data: {
        userId,
        tradeId: trade.id,
        commissionAmount: commission,
        commissionRate: 0.02,
      },
    });

    return trade;
  }

  async closeTrade(tradeId: string, userId: string) {
    const trade = await this.prisma.trade.findFirst({
      where: { id: tradeId, userId },
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.status !== 'OPEN') {
      throw new Error('Trade is not open');
    }

    // Get current market price as exit price
    const exitPrice = await this.marketDataService.getLatestPrice(trade.forexPair);
    
    // Calculate profit/loss
    const profitLoss = this.calculateProfitLoss(
      trade.tradeType as 'BUY' | 'SELL',
      Number(trade.entryPrice),
      exitPrice,
      Number(trade.amount),
    );

    // Update trade
    const updatedTrade = await this.prisma.trade.update({
      where: { id: tradeId },
      data: {
        exitPrice,
        profitLoss,
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });

    // Update AI model performance if applicable
    if (trade.aiModelUsed) {
      const isProfit = profitLoss > 0;
      await this.aiService.updateModelPerformance(
        trade.aiModelUsed,
        'v1.0',
        trade.forexPair,
        isProfit,
        profitLoss,
      );
    }

    return updatedTrade;
  }

  async getUserTrades(
    userId: string,
    status?: 'OPEN' | 'CLOSED' | 'PENDING' | 'CANCELED',
    limit: number = 50,
  ) {
    const whereClause: any = { userId };
    if (status) {
      whereClause.status = status;
    }

    return this.prisma.trade.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getTradeById(tradeId: string, userId: string) {
    return this.prisma.trade.findFirst({
      where: { id: tradeId, userId },
    });
  }

  async getTradeStats(userId: string) {
    const [totalTrades, openTrades, closedTrades, totalCommissions] = await Promise.all([
      this.prisma.trade.count({
        where: { userId },
      }),
      this.prisma.trade.count({
        where: { userId, status: 'OPEN' },
      }),
      this.prisma.trade.count({
        where: { userId, status: 'CLOSED' },
      }),
      this.prisma.commissionLog.aggregate({
        where: { userId },
        _sum: { commissionAmount: true },
      }),
    ]);

    const profitLossData = await this.prisma.trade.aggregate({
      where: { userId, status: 'CLOSED', profitLoss: { not: null } },
      _sum: { profitLoss: true },
      _avg: { profitLoss: true },
    });

    const winningTrades = await this.prisma.trade.count({
      where: { userId, status: 'CLOSED', profitLoss: { gt: 0 } },
    });

    const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;

    return {
      totalTrades,
      openTrades,
      closedTrades,
      totalProfitLoss: Number(profitLossData._sum.profitLoss) || 0,
      avgProfitLoss: Number(profitLossData._avg.profitLoss) || 0,
      totalCommissions: Number(totalCommissions._sum.commissionAmount) || 0,
      winRate,
      winningTrades,
    };
  }

  private calculateProfitLoss(
    tradeType: 'BUY' | 'SELL',
    entryPrice: number,
    exitPrice: number,
    amount: number,
  ): number {
    if (tradeType === 'BUY') {
      return (exitPrice - entryPrice) * amount;
    } else {
      return (entryPrice - exitPrice) * amount;
    }
  }

  // Method to automatically close trades based on AI predictions or stop losses
  async processAutomaticTrades() {
    const openTrades = await this.prisma.trade.findMany({
      where: { status: 'OPEN' },
    });

    for (const trade of openTrades) {
      const currentPrice = await this.marketDataService.getLatestPrice(trade.forexPair);
      
      // Example: Close trade if loss exceeds 5% of amount
      const maxLoss = Number(trade.amount) * 0.05;
      const currentProfitLoss = this.calculateProfitLoss(
        trade.tradeType as 'BUY' | 'SELL',
        Number(trade.entryPrice),
        currentPrice,
        Number(trade.amount),
      );

      if (currentProfitLoss <= -maxLoss) {
        await this.closeTrade(trade.id, trade.userId);
        console.log(`Auto-closed trade ${trade.id} due to stop loss`);
      }
    }
  }
}
