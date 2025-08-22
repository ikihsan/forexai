import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesResolver } from './trades.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, MarketDataModule, AIModule],
  providers: [TradesService, TradesResolver],
  exports: [TradesService],
})
export class TradesModule {}
