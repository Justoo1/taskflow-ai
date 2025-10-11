'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { generateProjectPlan } from '@/lib/openai';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  color: z.string().regex(/^#([0-9A-F]{6})$/i, 'Invalid color format').optional(),
});

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const validated = createProjectSchema.parse(data);

  const project = await prisma.project.create({
    data: {
      name: validated.name,
      description: validated.description,
      color: validated.color || '#3B82F6',
      userId: session.user.id,
    },
  });

  revalidatePath('/projects');
  return project;
}

export async function getProjects() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      tasks: {
        select: {
          id: true,
          status: true,
          priority: true,
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return projects;
}

export async function getProjectById(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      tasks: {
        include: {
          project: true,
        },
        orderBy: [
          { status: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project || project.userId !== session.user.id) {
    throw new Error('Project not found or unauthorized');
  }

  return project;
}

export async function updateProject(
  projectId: string,
  data: Partial<z.infer<typeof createProjectSchema>>
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== session.user.id) {
    throw new Error('Project not found or unauthorized');
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  revalidatePath('/dashboard/projects');
  revalidatePath(`/dashboard/projects/${projectId}`);
  return updated;
}

export async function deleteProject(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== session.user.id) {
    throw new Error('Project not found or unauthorized');
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath('/projects');
}

export async function generateAIProjectPlan(projectName: string, description: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check subscription for AI features
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === 'FREE') {
    throw new Error('AI project planning is only available for Pro users');
  }

  try {
    const plan = await generateProjectPlan(projectName, description);

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        userId: session.user.id,
        feature: 'project_planning',
        tokens: 1000,
        cost: 0.02,
      },
    });

    return plan;
  } catch (error) {
    console.error('AI project planning failed:', error);
    throw new Error('Failed to generate project plan');
  }
}

export async function getProjectCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const count = await prisma.project.count({
    where: { userId: session.user.id },
  });

  return count;
}