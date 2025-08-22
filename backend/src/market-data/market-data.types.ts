import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class MarketData {
  @Field()
  id: string;

  @Field()
  forexPair: string;

  @Field(() => Float)
  open: number;

  @Field(() => Float)
  high: number;

  @Field(() => Float)
  low: number;

  @Field(() => Float)
  close: number;

  @Field(() => Float)
  volume: number;

  @Field()
  timestamp: Date;

  @Field()
  timeframe: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class ForexPair {
  @Field()
  id: string;

  @Field()
  symbol: string;

  @Field()
  name: string;

  @Field()
  baseCurrency: string;

  @Field()
  quoteCurrency: string;

  @Field()
  isActive: boolean;

  @Field(() => Float)
  spread: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
