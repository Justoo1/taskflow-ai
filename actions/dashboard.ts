'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { Plan } from '@prisma/client';

interface DashboardData {
  taskCount: number;
  projectCount: number;
  subscriptionPlan: Plan;
}

/**
 * Optimized function to fetch all dashboard data in a single query
 * This reduces database round trips from 3 separate queries to 1
 * Cached per request to prevent duplicate queries in the same render
 */
export const getDashboardData = cache(async (userId: string): Promise<DashboardData> => {
  // Use a single query with aggregations to get all data at once
  const [user] = await prisma.$queryRaw<Array<{
    task_count: bigint;
    project_count: bigint;
    subscription_plan: Plan | null;
  }>>`
    SELECT
      (SELECT COUNT(*) FROM "Task" WHERE "userId" = ${userId}) as task_count,
      (SELECT COUNT(*) FROM "Project" WHERE "userId" = ${userId}) as project_count,
      (SELECT "plan" FROM "Subscription" WHERE "userId" = ${userId} LIMIT 1) as subscription_plan
  `;

  return {
    taskCount: Number(user?.task_count || 0),
    projectCount: Number(user?.project_count || 0),
    subscriptionPlan: user?.subscription_plan || 'FREE',
  };
});
