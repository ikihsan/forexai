import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';
import { TradeStats } from './dto/trade-stats.dto';
import { CreateTradeInput } from './dto/trade.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Resolver(() => Trade)
export class TradesResolver {
  constructor(private tradesService: TradesService) {}

  @Query(() => [Trade])
  @UseGuards(JwtAuthGuard)
  async getUserTrades(
    @CurrentUser() user: User,
    @Args('status', { nullable: true }) status?: 'OPEN' | 'CLOSED' | 'PENDING' | 'CANCELED',
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit?: number,
  ): Promise<Trade[]> {
    const trades = await this.tradesService.getUserTrades(user.id, status, limit);
    return trades.map(trade => ({
      ...trade,
      amount: Number(trade.amount),
      entryPrice: Number(trade.entryPrice),
      exitPrice: trade.exitPrice ? Number(trade.exitPrice) : null,
      profitLoss: trade.profitLoss ? Number(trade.profitLoss) : null,
      commission: Number(trade.commission),
    })) as Trade[];
  }

  @Query(() => Trade, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async getTrade(
    @CurrentUser() user: User,
    @Args('tradeId') tradeId: string,
  ): Promise<Trade | null> {
    const trade = await this.tradesService.getTradeById(tradeId, user.id);
    if (!trade) return null;
    
    return {
      ...trade,
      amount: Number(trade.amount),
      entryPrice: Number(trade.entryPrice),
      exitPrice: trade.exitPrice ? Number(trade.exitPrice) : null,
      profitLoss: trade.profitLoss ? Number(trade.profitLoss) : null,
      commission: Number(trade.commission),
    } as Trade;
  }

  @Query(() => TradeStats)
  @UseGuards(JwtAuthGuard)
  async getTradeStats(@CurrentUser() user: User): Promise<TradeStats> {
    return this.tradesService.getTradeStats(user.id);
  }

  @Mutation(() => Trade)
  @UseGuards(JwtAuthGuard)
  async createTrade(
    @CurrentUser() user: User,
    @Args('input') input: CreateTradeInput,
  ): Promise<Trade> {
    const trade = await this.tradesService.createTrade(
      user.id,
      input.forexPair,
      input.tradeType,
      input.amount,
      input.aiModelUsed,
    );

    return {
      ...trade,
      amount: Number(trade.amount),
      entryPrice: Number(trade.entryPrice),
      exitPrice: trade.exitPrice ? Number(trade.exitPrice) : null,
      profitLoss: trade.profitLoss ? Number(trade.profitLoss) : null,
      commission: Number(trade.commission),
    } as Trade;
  }

  @Mutation(() => Trade)
  @UseGuards(JwtAuthGuard)
  async closeTrade(
    @CurrentUser() user: User,
    @Args('tradeId') tradeId: string,
  ): Promise<Trade> {
    const trade = await this.tradesService.closeTrade(tradeId, user.id);

    return {
      ...trade,
      amount: Number(trade.amount),
      entryPrice: Number(trade.entryPrice),
      exitPrice: trade.exitPrice ? Number(trade.exitPrice) : null,
      profitLoss: trade.profitLoss ? Number(trade.profitLoss) : null,
      commission: Number(trade.commission),
    } as Trade;
  }
}
