// actions/tasks.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { analyzeTask } from '@/lib/openai';
import { Status, Priority } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { TaskAnalysis } from '@/types';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
  projectId: z.string().optional(),
  dueDate: z.date().optional(),
});

export async function createTask(data: z.infer<typeof createTaskSchema>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const validated = createTaskSchema.parse(data);

  // Check subscription limits for free users
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === 'FREE') {
    const taskCount = await prisma.task.count({
      where: { userId: session.user.id },
    });

    if (taskCount >= 50) {
      throw new Error('Free plan limit reached. Upgrade to Pro for unlimited tasks.');
    }
  }

  // Get AI suggestions for Pro+ users
  let aiSuggestions: Prisma.JsonValue = null;
  if (subscription?.plan !== 'FREE') {
    try {
      const analysis = await analyzeTask(
        validated.title,
        validated.description
      );

      // Convert to Prisma.JsonValue
      aiSuggestions = analysis as unknown as Prisma.JsonValue;

      // Track AI usage
      await prisma.aIUsage.create({
        data: {
          userId: session.user.id,
          feature: 'task_analysis',
          tokens: 500, // Approximate
          cost: 0.01,
        },
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
      aiSuggestions = null;
      // Continue without AI suggestions
    }
  }

  const task = await prisma.task.create({
    data: {
      title: validated.title,
      description: validated.description,
      priority: validated.priority || Priority.MEDIUM,
      status: validated.status || Status.TODO,
      projectId: validated.projectId,
      dueDate: validated.dueDate,
      userId: session.user.id,
      ...(aiSuggestions && { aiSuggestions: aiSuggestions as Prisma.InputJsonValue }),
    },
  });

  revalidatePath('/dashboard');
  return task;
}

export async function updateTaskStatus(taskId: string, status: Status) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== session.user.id) {
    throw new Error('Task not found or unauthorized');
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath('/dashboard');
}

export async function deleteTask(taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== session.user.id) {
    throw new Error('Task not found or unauthorized');
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath('/dashboard');
}

export async function getTasks() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { status: 'asc' },
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      project: true,
    },
  });

  return tasks;
}

export async function updateTask(
  taskId: string,
  data: Partial<z.infer<typeof createTaskSchema>>
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== session.user.id) {
    throw new Error('Task not found or unauthorized');
  }

  await prisma.task.update({
    where: { id: taskId },
    data,
  });

  revalidatePath('/dashboard');
}