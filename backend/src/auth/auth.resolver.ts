import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayload, RefreshPayload } from './auth.types';
import { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from './dto/auth.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  @Mutation(() => RefreshPayload)
  async refreshTokens(@Args('refreshToken') refreshToken: string): Promise<RefreshPayload> {
    return this.authService.refreshTokens(refreshToken);
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<boolean> {
    return this.authService.forgotPassword(input.email);
  }

  @Mutation(() => Boolean)
  async resetPassword(@Args('input') input: ResetPasswordInput): Promise<boolean> {
    return this.authService.resetPassword(input.token, input.newPassword);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: User): Promise<boolean> {
    // In a production app, you would invalidate the token here
    // For now, we'll just return true as the client will remove the token
    return true;
  }
}
