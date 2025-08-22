import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketData, ForexPair } from './market-data.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
export class MarketDataResolver {
  constructor(private marketDataService: MarketDataService) {}

  @Query(() => [MarketData])
  @UseGuards(JwtAuthGuard)
  async getMarketData(
    @Args('forexPair') forexPair: string,
    @Args('timeframe', { defaultValue: '1h' }) timeframe: string,
    @Args('limit', { type: () => Int, defaultValue: 100 }) limit: number,
  ): Promise<MarketData[]> {
    const data = await this.marketDataService.getMarketData(forexPair, timeframe, limit);
    return data.map(item => ({
      ...item,
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      volume: Number(item.volume),
      spread: Number((item as any).spread || 0),
    })) as MarketData[];
  }

  @Query(() => [ForexPair])
  @UseGuards(JwtAuthGuard)
  async getForexPairs(): Promise<ForexPair[]> {
    const pairs = await this.marketDataService.getAllForexPairs();
    return pairs.map(pair => ({
      ...pair,
      spread: Number(pair.spread),
    })) as ForexPair[];
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async getCurrentPrice(@Args('forexPair') forexPair: string): Promise<number> {
    return this.marketDataService.getLatestPrice(forexPair);
  }
}
