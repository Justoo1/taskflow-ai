import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeTask } from '@/lib/openai';

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
    const { title, description } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    // Check subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (subscription?.plan === 'FREE') {
      return NextResponse.json(
        { error: 'Task analysis requires a Pro subscription' },
        { status: 403 }
      );
    }

    // Analyze the task
    const analysis = await analyzeTask(title, description);

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        userId: session.user.id,
        feature: 'task_analysis',
        tokens: 500,
        cost: 0.01,
      },
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Task Analysis API error:', error);
    
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