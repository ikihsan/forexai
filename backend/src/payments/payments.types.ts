import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class PlanInfo {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  currency: string;

  @Field()
  interval: string;

  @Field()
  stripePriceId: string;

  @Field(() => [String])
  features: string[];
}

@ObjectType()
export class CreateSubscriptionResponse {
  @Field()
  subscriptionId: string;

  @Field()
  clientSecret: string;

  @Field()
  status: string;
}
