import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

@InputType()
export class CreateTradeInput {
  @Field()
  @IsString()
  forexPair: string;

  @Field()
  @IsEnum(['BUY', 'SELL'])
  tradeType: 'BUY' | 'SELL';

  @Field(() => Float)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @Field({ nullable: true })
  @IsString()
  aiModelUsed?: string;
}

@InputType()
export class TradeFilterInput {
  @Field({ nullable: true })
  @IsEnum(['OPEN', 'CLOSED', 'PENDING', 'CANCELED'])
  status?: 'OPEN' | 'CLOSED' | 'PENDING' | 'CANCELED';

  @Field({ nullable: true })
  @IsString()
  forexPair?: string;
}
