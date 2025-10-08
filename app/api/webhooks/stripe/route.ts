import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { handleWebhook } from '@/lib/stripe';
import { Plan, SubscriptionStatus } from '@prisma/client';

export async function POST(req: Request) {
  const body = await req.text();
  const header = await headers();
  const signature = header.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = await handleWebhook(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId || !plan) {
          throw new Error('Missing metadata');
        }

        // Get subscription details if available
        const subscriptionId = session.subscription as string;
        let currentPeriodEnd: Date | undefined;

        if (subscriptionId && typeof subscriptionId === 'string') {
          // For subscriptions, we'll get the period end from the subscription.updated event
          // For now, set a default or leave undefined
          currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now as default
        }

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: plan as Plan,
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: session.line_items?.data[0]?.price?.id,
            stripeCurrentPeriodEnd: currentPeriodEnd,
          },
          update: {
            plan: plan as Plan,
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: session.line_items?.data[0]?.price?.id,
            stripeCurrentPeriodEnd: currentPeriodEnd,
          },
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: subscription.status.toUpperCase() as SubscriptionStatus,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : undefined,
          },
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: 'CANCELED',
            plan: 'FREE',
          },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}