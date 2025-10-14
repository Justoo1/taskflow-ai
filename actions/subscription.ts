// actions/subscription.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getUserSubscription(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
      select: {
        plan: true,
        status: true,
      },
    });

    return subscription?.plan || 'FREE';
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return 'FREE'; // Default to FREE on error
  }
}
