import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client';

try {
  registerEnumType(SubscriptionStatus, {
    name: 'SubscriptionStatus',
    description: 'Subscription status enumeration',
  });
} catch {}

try {
  registerEnumType(SubscriptionPlan, {
    name: 'GqlSubscriptionPlan',
    description: 'Subscription plan enumeration',
  });
} catch {}

@ObjectType()
export class Subscription {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  stripeCustomerId: string;

  @Field({ nullable: true })
  stripeSubscriptionId?: string;

  @Field()
  stripePriceId: string;

  @Field(() => SubscriptionStatus)
  status: SubscriptionStatus;

  @Field(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @Field({ nullable: true })
  currentPeriodStart?: Date;

  @Field({ nullable: true })
  currentPeriodEnd?: Date;

  @Field({ nullable: true })
  canceledAt?: Date;

  @Field()
  cancelAtPeriodEnd: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
