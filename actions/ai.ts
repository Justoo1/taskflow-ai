// actions/ai.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiChat } from '@/lib/ai-assistant';
import { analyzeTask, getDailyRecommendations, generateProjectPlan } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

/**
 * Send a chat message to the AI assistant
 */
export async function sendChatMessage(message: string, conversationId?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Get user context
  const [tasks, projects, subscription] = await Promise.all([
    prisma.task.findMany({
      where: { userId: session.user.id },
      select: { 
        id: true, 
        title: true, 
        priority: true, 
        status: true,
        dueDate: true,
      },
      take: 20,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.project.findMany({
      where: { userId: session.user.id },
      select: { 
        id: true, 
        name: true, 
        description: true 
      },
      take: 10,
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  const context = {
    tasks,
    projects,
    conversationId,
    userPlan: subscription?.plan || 'FREE',
  };

  const response = await aiChat(message, context);

  // Track AI usage
  await prisma.aIUsage.create({
    data: {
      userId: session.user.id,
      feature: 'chat_assistant',
      tokens: response.tokensUsed,
      cost: response.cost,
    },
  });

  return response;
}

/**
 * Analyze a task with AI
 */
export async function analyzeTaskWithAI(taskId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check if user has Pro plan
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === 'FREE') {
    throw new Error('AI Task Analysis is a Pro feature. Please upgrade your plan.');
  }

  // Get the task
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: session.user.id,
    },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  const analysis = await analyzeTask(task.title, task.description || undefined);

  // Track AI usage
  await prisma.aIUsage.create({
    data: {
      userId: session.user.id,
      feature: 'task_analysis',
      tokens: 500, // Approximate
      cost: 0.005, // Approximate
    },
  });

  return analysis;
}

/**
 * Get daily AI recommendations
 */
export async function getDailyAIRecommendations() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check if user has Pro plan
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === 'FREE') {
    throw new Error('Daily Recommendations is a Pro feature. Please upgrade your plan.');
  }

  // Get user's tasks
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      status: {
        not: 'DONE',
      },
    },
    select: {
      title: true,
      priority: true,
      dueDate: true,
    },
    take: 50,
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
  });

  if (tasks.length === 0) {
    return [];
  }

  const recommendations = await getDailyRecommendations(
    tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ?? undefined,
    }))
  );

  // Track AI usage
  await prisma.aIUsage.create({
    data: {
      userId: session.user.id,
      feature: 'daily_recommendations',
      tokens: 400,
      cost: 0.004,
    },
  });

  return recommendations;
}

/**
 * Generate AI project plan
 */
export async function generateAIProjectPlan(
  projectName: string,
  projectDescription: string
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check if user has Pro plan
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === 'FREE') {
    throw new Error('AI Project Planning is a Pro feature. Please upgrade your plan.');
  }

  const plan = await generateProjectPlan(projectName, projectDescription);

  // Track AI usage
  await prisma.aIUsage.create({
    data: {
      userId: session.user.id,
      feature: 'project_planning',
      tokens: 600,
      cost: 0.006,
    },
  });

  return plan;
}

/**
 * Get AI usage statistics
 */
export async function getAIUsageStats() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const stats = await prisma.aIUsage.aggregate({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    _sum: {
      tokens: true,
      cost: true,
    },
    _count: true,
  });

  return {
    totalTokens: stats._sum.tokens || 0,
    totalCost: stats._sum.cost || 0,
    usageCount: stats._count || 0,
  };
}