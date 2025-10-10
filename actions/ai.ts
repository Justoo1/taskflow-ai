'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { aiChat, getProductivityInsights, analyzeProject } from '@/lib/ai-assistant';
import { revalidatePath } from 'next/cache';

export async function sendChatMessage(
  message: string,
  conversationId?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  // Get user context
  const [tasks, projects] = await Promise.all([
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
        description: true,
      },
      take: 10,
    }),
  ]);

  // Call AI
  const response = await aiChat(message, {
    tasks,
    projects,
    conversationId,
    userPlan: subscription?.plan || 'FREE',
  });

  // Track AI usage
  await prisma.aIUsage.create({
    data: {
      userId: session.user.id,
      feature: 'chat_assistant',
      tokens: response.tokensUsed || 0,
      cost: response.cost || 0,
    },
  });

  return response;
}

export async function getAIInsights() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === 'FREE') {
    throw new Error('AI Insights require a Pro subscription');
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: {
      project: true,
    },
  });

  const insights = await getProductivityInsights(tasks);

  await prisma.aIUsage.create({
    data: {
      userId: session.user.id,
      feature: 'productivity_insights',
      tokens: 300,
      cost: 0.005,
    },
  });

  return insights;
}

export async function analyzeProjectWithAI(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === 'FREE') {
    throw new Error('Project analysis requires a Pro subscription');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: session.user.id,
    },
    include: {
      tasks: true,
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const analysis = await analyzeProject(project);

  await prisma.aIUsage.create({
    data: {
      userId: session.user.id,
      feature: 'project_analysis',
      tokens: 800,
      cost: 0.015,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  return analysis;
}

export async function getChatHistory(limit: number = 10) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // This would fetch from a conversations table if you implement persistent chat
  // For now, returning empty array as conversations are ephemeral
  return [];
}

export async function getAIUsageStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const usage = await prisma.aIUsage.findMany({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const stats = {
    totalTokens: usage.reduce((sum, u) => sum + u.tokens, 0),
    totalCost: usage.reduce((sum, u) => sum + u.cost, 0),
    byFeature: usage.reduce((acc, u) => {
      acc[u.feature] = (acc[u.feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentUsage: usage.slice(0, 10),
  };

  return stats;
}