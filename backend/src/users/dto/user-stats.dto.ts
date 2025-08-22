import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class UserStats {
  @Field(() => Int)
  totalTrades: number;

  @Field(() => Int)
  activeTrades: number;

  @Field(() => Float)
  totalCommissions: number;

  @Field(() => Float)
  totalProfitLoss: number;
}
