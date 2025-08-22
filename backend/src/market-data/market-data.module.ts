import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataResolver } from './market-data.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MarketDataService, MarketDataResolver],
  exports: [MarketDataService],
})
export class MarketDataModule {}
