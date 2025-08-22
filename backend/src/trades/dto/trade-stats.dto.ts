import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class TradeStats {
  @Field(() => Int)
  totalTrades: number;

  @Field(() => Int)
  openTrades: number;

  @Field(() => Int)
  closedTrades: number;

  @Field(() => Float)
  totalProfitLoss: number;

  @Field(() => Float)
  avgProfitLoss: number;

  @Field(() => Float)
  totalCommissions: number;

  @Field(() => Float)
  winRate: number;

  @Field(() => Int)
  winningTrades: number;
}
