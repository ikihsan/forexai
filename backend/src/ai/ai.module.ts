import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIResolver } from './ai.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AIService, AIResolver],
  exports: [AIService],
})
export class AIModule {}
