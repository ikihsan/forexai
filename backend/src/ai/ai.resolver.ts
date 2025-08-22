import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIPrediction, AIModelPerformance } from './ai.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Resolver()
export class AIResolver {
  constructor(
    private aiService: AIService,
    private prisma: PrismaService,
  ) {}

  @Query(() => AIPrediction, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async getAIPrediction(
    @CurrentUser() user: User,
    @Args('forexPair') forexPair: string,
    @Args('modelType', { defaultValue: 'model_a' }) modelType: 'model_a' | 'model_b',
  ): Promise<AIPrediction | null> {
    // Get user's subscription to check access
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      throw new Error('Active subscription required');
    }

    const result = await this.aiService.getPrediction(
      forexPair,
      modelType,
      subscription.plan,
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    // Log the usage
    await this.aiService.logModelUsage(
      user.id,
      modelType,
      'v1.0',
      forexPair,
      { forexPair, modelType },
      result.prediction,
    );

    return result.prediction as AIPrediction;
  }

  @Query(() => [AIModelPerformance])
  @UseGuards(JwtAuthGuard)
  async getModelPerformance(
    @Args('modelName') modelName: string,
    @Args('forexPair', { nullable: true }) forexPair?: string,
  ): Promise<AIModelPerformance[]> {
    const performance = await this.aiService.getModelPerformance(modelName, forexPair);
    return performance.map(p => ({
      ...p,
      successRate: Number(p.successRate),
      avgProfitLoss: Number(p.avgProfitLoss)
    })) as AIModelPerformance[];
  }
}
