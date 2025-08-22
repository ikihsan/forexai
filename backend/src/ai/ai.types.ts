import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class AIPrediction {
  @Field()
  prediction: string;

  @Field(() => Float)
  confidence: number;

  @Field(() => Float)
  targetPrice: number;

  @Field(() => Float)
  stopLoss: number;

  @Field()
  reasoning: string;
}

@ObjectType()
export class AIModelPerformance {
  @Field()
  id: string;

  @Field()
  modelName: string;

  @Field()
  modelVersion: string;

  @Field()
  forexPair: string;

  @Field()
  totalPredictions: number;

  @Field()
  correctPredictions: number;

  @Field(() => Float)
  successRate: number;

  @Field(() => Float, { nullable: true })
  avgProfitLoss?: number;

  @Field()
  periodStart: Date;

  @Field()
  periodEnd: Date;
}
