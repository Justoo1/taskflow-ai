import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { plan } = await req.json();

    if (!plan || !['PRO', 'ENTERPRISE'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const checkoutSession = await createCheckoutSession(
      session.user.id,
      session.user.email,
      plan
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}