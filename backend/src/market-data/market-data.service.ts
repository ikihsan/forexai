import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MarketDataService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getMarketData(
    forexPair: string,
    timeframe: string = '1h',
    limit: number = 100,
  ) {
    return this.prisma.marketData.findMany({
      where: {
        forexPair,
        timeframe,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  async getLatestPrice(forexPair: string): Promise<number> {
    const latest = await this.prisma.marketData.findFirst({
      where: { forexPair },
      orderBy: { timestamp: 'desc' },
      select: { close: true },
    });

    if (latest) {
      return Number(latest.close);
    }

    // Fallback to mock prices if no data available
    const mockPrices: Record<string, number> = {
      'EURUSD': 1.0850,
      'GBPUSD': 1.2650,
      'USDJPY': 149.50,
      'AUDUSD': 0.6750,
      'USDCAD': 1.3450,
    };

    return mockPrices[forexPair] || 1.0000;
  }

  async getAllForexPairs() {
    return this.prisma.forexPair.findMany({
      where: { isActive: true },
      orderBy: { symbol: 'asc' },
    });
  }

  async createMarketDataPoint(data: {
    forexPair: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: Date;
    timeframe: string;
  }) {
    return this.prisma.marketData.create({
      data,
    });
  }

  // Method to generate mock market data for development
  async generateMockData(forexPair: string, hours: number = 24) {
    const now = new Date();
    const data = [];

    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // Every hour
      const basePrice = this.getBasePriceForPair(forexPair);
      
      // Generate realistic OHLC data
      const open = basePrice + (Math.random() - 0.5) * 0.01;
      const volatility = 0.002;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      const volume = Math.floor(Math.random() * 1000000) + 100000;

      data.push({
        forexPair,
        open,
        high,
        low,
        close,
        volume,
        timestamp,
        timeframe: '1h',
      });
    }

    // Bulk create
    return this.prisma.marketData.createMany({
      data,
      skipDuplicates: true,
    });
  }

  private getBasePriceForPair(forexPair: string): number {
    const basePrices: Record<string, number> = {
      'EURUSD': 1.0850,
      'GBPUSD': 1.2650,
      'USDJPY': 149.50,
      'AUDUSD': 0.6750,
      'USDCAD': 1.3450,
    };

    return basePrices[forexPair] || 1.0000;
  }

  // Real-time price updates (mock implementation)
  async updateRealTimePrice(forexPair: string): Promise<number> {
    const latestPrice = await this.getLatestPrice(forexPair);
    const priceChange = (Math.random() - 0.5) * 0.001; // Small random change
    const newPrice = latestPrice + priceChange;

    // In a real implementation, you would:
    // 1. Connect to a forex data provider WebSocket
    // 2. Update the database with new tick data
    // 3. Emit the update via WebSocket to connected clients

    return newPrice;
  }
}
