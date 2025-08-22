import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PlanInfo, CreateSubscriptionResponse } from './payments.types';
import { Subscription } from '../subscriptions/subscription.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private paymentsService: PaymentsService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [PlanInfo])
  async getSubscriptionPlans(): Promise<PlanInfo[]> {
    return this.paymentsService.getSubscriptionPlans();
  }

  @Query(() => Subscription, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async getCurrentSubscription(@CurrentUser() user: User): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });
    
    return subscription as Subscription;
  }

  @Mutation(() => CreateSubscriptionResponse)
  @UseGuards(JwtAuthGuard)
  async createSubscription(
    @CurrentUser() user: User,
    @Args('priceId') priceId: string,
  ): Promise<CreateSubscriptionResponse> {
    // Check if user already has a subscription
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    let customerId: string;

    if (existingSubscription) {
      customerId = existingSubscription.stripeCustomerId;
    } else {
      // Create Stripe customer
      const customer = await this.paymentsService.createCustomer(
        user.email,
        `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      );
      customerId = customer.id;
    }

    // Create subscription
    const subscription = await this.paymentsService.createSubscription(
      customerId,
      priceId,
      user.id,
    );

    const latestInvoice = subscription.latest_invoice as any;
    const paymentIntent = latestInvoice?.payment_intent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || '',
      status: subscription.status,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@CurrentUser() user: User): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    await this.paymentsService.cancelSubscription(subscription.stripeSubscriptionId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async reactivateSubscription(@CurrentUser() user: User): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new Error('No subscription found');
    }

    await this.paymentsService.reactivateSubscription(subscription.stripeSubscriptionId);
    return true;
  }
}
