import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole, SubscriptionStatus, SubscriptionPlan } from '@prisma/client';
import { Subscription } from '../subscriptions/subscription.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role enumeration',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  emailVerified: boolean;

  @Field({ nullable: true })
  emailVerifiedAt?: Date;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field({ nullable: true })
  googleId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Subscription relationship
  @Field(() => Subscription, { nullable: true })
  subscription?: Subscription;

  // Computed subscription fields for easier access
  @Field({ nullable: true })
  subscriptionStatus?: string;

  @Field({ nullable: true })
  subscriptionTier?: string;
}
