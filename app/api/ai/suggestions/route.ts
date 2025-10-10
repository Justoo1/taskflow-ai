// app/api/ai/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSmartSuggestions } from '@/lib/ai-assistant';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Check subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (subscription?.plan === 'FREE') {
      return NextResponse.json(
        { error: 'Smart suggestions require a Pro subscription' },
        { status: 403 }
      );
    }

    // Get context
    const [recentTasks, activeProjects] = await Promise.all([
      prisma.task.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
      prisma.project.findMany({
        where: { userId: session.user.id },
        take: 5,
      }),
    ]);

    const suggestions = await generateSmartSuggestions(input, {
      recentTasks,
      activeProjects,
    });

    // Track usage
    await prisma.aIUsage.create({
      data: {
        userId: session.user.id,
        feature: 'smart_suggestions',
        tokens: 400,
        cost: 0.008,
      },
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('AI Suggestions API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}