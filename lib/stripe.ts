import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 50 tasks',
      'Basic task management',
      '1 project',
      'Email support',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited tasks',
      'AI-powered insights',
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'Team collaboration (coming soon)',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 29.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Everything in Pro',
      'Custom AI models',
      'API access',
      'Dedicated support',
      'SSO authentication',
      'Advanced security',
    ],
  },
};

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  plan: 'PRO' | 'ENTERPRISE'
) {
  const priceId = PLANS[plan].priceId;

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
      plan,
    },
  });

  return session;
}

export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  });

  return session;
}

export async function handleWebhook(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}