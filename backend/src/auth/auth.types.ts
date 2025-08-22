import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../users/user.entity';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class RefreshPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
