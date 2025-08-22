import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface AIPrediction {
  prediction: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
}

export interface AIModelResponse {
  success: boolean;
  prediction?: AIPrediction;
  error?: string;
}

@Injectable()
export class AIService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getPrediction(
    forexPair: string,
    modelType: 'model_a' | 'model_b',
    userPlan: 'PREMIUM' | 'PREMIUM_PLUS',
  ): Promise<AIModelResponse> {
    // Check if user has access to the model
    if (modelType === 'model_b' && userPlan !== 'PREMIUM_PLUS') {
      return {
        success: false,
        error: 'Premium Plus subscription required for Model B',
      };
    }

    try {
      // Mock AI prediction for now - replace with actual AI API calls
      const prediction = await this.mockAIPrediction(forexPair, modelType);
      
      return {
        success: true,
        prediction,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get AI prediction',
      };
    }
  }

  async logModelUsage(
    userId: string,
    modelName: string,
    modelVersion: string,
    forexPair: string,
    requestData: any,
    responseData?: any,
  ) {
    await this.prisma.aIModelUsage.create({
      data: {
        userId,
        modelName,
        modelVersion,
        forexPair,
        requestData,
        responseData,
      },
    });
  }

  async getModelPerformance(
    modelName: string,
    forexPair?: string,
  ) {
    const whereClause: any = { modelName };
    if (forexPair) {
      whereClause.forexPair = forexPair;
    }

    return this.prisma.aIModelPerformance.findMany({
      where: whereClause,
      orderBy: { periodStart: 'desc' },
      take: 10,
    });
  }

  async updateModelPerformance(
    modelName: string,
    modelVersion: string,
    forexPair: string,
    isCorrect: boolean,
    profitLoss?: number,
  ) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Find or create performance record for today
    let performance = await this.prisma.aIModelPerformance.findFirst({
      where: {
        modelName,
        modelVersion,
        forexPair,
        periodStart: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (!performance) {
      performance = await this.prisma.aIModelPerformance.create({
        data: {
          modelName,
          modelVersion,
          forexPair,
          periodStart: startOfDay,
          periodEnd: endOfDay,
          totalPredictions: 0,
          correctPredictions: 0,
          successRate: 0,
        },
      });
    }

    // Update performance metrics
    const newTotal = performance.totalPredictions + 1;
    const newCorrect = performance.correctPredictions + (isCorrect ? 1 : 0);
    const newSuccessRate = newCorrect / newTotal;

    await this.prisma.aIModelPerformance.update({
      where: { id: performance.id },
      data: {
        totalPredictions: newTotal,
        correctPredictions: newCorrect,
        successRate: newSuccessRate,
        avgProfitLoss: profitLoss 
          ? (performance.avgProfitLoss ? (Number(performance.avgProfitLoss) + profitLoss) / 2 : profitLoss)
          : performance.avgProfitLoss,
      },
    });
  }

  private async mockAIPrediction(
    forexPair: string,
    modelType: 'model_a' | 'model_b',
  ): Promise<AIPrediction> {
    // Simulate different model capabilities
    const baseAccuracy = modelType === 'model_a' ? 0.72 : 0.80;
    const confidence = Math.random() * 0.4 + 0.6; // 60-100%
    
    // Get current market price (mock data)
    const currentPrice = await this.getCurrentPrice(forexPair);
    
    // Generate prediction
    const random = Math.random();
    const prediction = random < 0.4 ? 'BUY' : random < 0.8 ? 'SELL' : 'HOLD';
    
    // Calculate target and stop loss
    const priceMovement = currentPrice * 0.002 * (Math.random() + 0.5); // 0.1-0.3% movement
    const targetPrice = prediction === 'BUY' 
      ? currentPrice + priceMovement 
      : currentPrice - priceMovement;
    const stopLoss = prediction === 'BUY'
      ? currentPrice - (priceMovement * 0.5)
      : currentPrice + (priceMovement * 0.5);

    // Generate reasoning
    const reasoning = this.generateReasoning(forexPair, prediction, modelType);

    return {
      prediction: prediction as 'BUY' | 'SELL' | 'HOLD',
      confidence,
      targetPrice,
      stopLoss,
      reasoning,
    };
  }

  private async getCurrentPrice(forexPair: string): Promise<number> {
    // Mock current prices - in production, fetch from real forex API
    const mockPrices: Record<string, number> = {
      'EURUSD': 1.0850,
      'GBPUSD': 1.2650,
      'USDJPY': 149.50,
      'AUDUSD': 0.6750,
      'USDCAD': 1.3450,
    };

    return mockPrices[forexPair] || 1.0000;
  }

  private generateReasoning(
    forexPair: string,
    prediction: string,
    modelType: string,
  ): string {
    const factors = [
      'Technical analysis shows strong momentum',
      'Economic indicators favor this direction',
      'Market sentiment analysis suggests',
      'Historical patterns indicate',
      'Central bank policy implications',
      'Cross-currency correlations show',
    ];

    const factor = factors[Math.floor(Math.random() * factors.length)];
    
    return `${factor} a ${prediction.toLowerCase()} opportunity for ${forexPair}. ${
      modelType === 'model_b' 
        ? 'Advanced pattern recognition and sentiment analysis support this prediction.' 
        : 'Technical indicators align with this forecast.'
    }`;
  }
}
