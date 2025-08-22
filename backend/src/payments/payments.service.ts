import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(email: string, name?: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async createSubscription(
    customerId: string,
    priceId: string,
    userId: string,
  ) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Determine plan based on price ID
      const plan = priceId === this.configService.get('STRIPE_PREMIUM_PLUS_PRICE_ID') 
        ? 'PREMIUM_PLUS' 
        : 'PREMIUM';

      // Update user's subscription in database
      await this.prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          status: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
          plan,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          status: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
          plan,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      // Update database
      await this.prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          cancelAtPeriodEnd: true,
        },
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  async reactivateSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      // Update database
      await this.prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          cancelAtPeriodEnd: false,
        },
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to reactivate subscription: ${error.message}`);
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.Invoice);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.Invoice);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const plan = subscription.items.data[0].price.id === this.configService.get('STRIPE_PREMIUM_PLUS_PRICE_ID')
      ? 'PREMIUM_PLUS'
      : 'PREMIUM';

    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: this.mapStripeStatus(subscription.status),
        plan,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      },
    });
  }

  private async handleSubscriptionCancellation(subscription: Stripe.Subscription) {
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });
  }

  private async handlePaymentSuccess(invoice: Stripe.Invoice) {
    // Handle successful payment - could send confirmation email, etc.
    console.log(`Payment successful for invoice: ${invoice.id}`);
  }

  private async handlePaymentFailure(invoice: Stripe.Invoice) {
    // Handle failed payment - could send notification email, etc.
    console.log(`Payment failed for invoice: ${invoice.id}`);
    
    if (invoice.subscription) {
      await this.prisma.subscription.update({
        where: { stripeSubscriptionId: invoice.subscription as string },
        data: {
          status: 'PAST_DUE',
        },
      });
    }
  }

  private mapStripeStatus(stripeStatus: string): 'ACTIVE' | 'INACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING' {
    switch (stripeStatus) {
      case 'active':
        return 'ACTIVE';
      case 'past_due':
        return 'PAST_DUE';
      case 'canceled':
        return 'CANCELED';
      case 'trialing':
        return 'TRIALING';
      default:
        return 'INACTIVE';
    }
  }

  async getSubscriptionPlans() {
    return [
      {
        id: 'premium',
        name: 'Premium',
        description: 'Access to AI Model A with standard predictions',
        price: 29.99,
        currency: 'USD',
        interval: 'month',
        stripePriceId: this.configService.get('STRIPE_PREMIUM_PRICE_ID'),
        features: [
          'AI Model A predictions',
          'Real-time forex charts',
          'Trade execution',
          'Performance analytics',
          'Email support',
        ],
      },
      {
        id: 'premium_plus',
        name: 'Premium Plus',
        description: 'Access to AI Model B with advanced predictions',
        price: 49.99,
        currency: 'USD',
        interval: 'month',
        stripePriceId: this.configService.get('STRIPE_PREMIUM_PLUS_PRICE_ID'),
        features: [
          'AI Model B predictions (higher accuracy)',
          'All Premium features',
          'Advanced analytics',
          'Priority support',
          'Custom alerts',
        ],
      },
    ];
  }
}
