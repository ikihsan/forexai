import { ObjectType, Field, ID, registerEnumType, Float } from '@nestjs/graphql';
import { TradeType, TradeStatus } from '@prisma/client';

registerEnumType(TradeType, {
  name: 'TradeType',
  description: 'Trade type enumeration',
});

registerEnumType(TradeStatus, {
  name: 'TradeStatus',
  description: 'Trade status enumeration',
});

@ObjectType()
export class Trade {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  forexPair: string;

  @Field(() => TradeType)
  tradeType: TradeType;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  entryPrice: number;

  @Field(() => Float, { nullable: true })
  exitPrice?: number;

  @Field(() => TradeStatus)
  status: TradeStatus;

  @Field({ nullable: true })
  aiModelUsed?: string;

  @Field({ nullable: true })
  aiPrediction?: string; // JSON as string

  @Field(() => Float, { nullable: true })
  profitLoss?: number;

  @Field(() => Float)
  commission: number;

  @Field()
  openedAt: Date;

  @Field({ nullable: true })
  closedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
