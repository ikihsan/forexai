import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

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
}
