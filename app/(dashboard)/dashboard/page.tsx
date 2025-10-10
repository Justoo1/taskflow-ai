// app/(dashboard)/dashboard/page.tsx
import { requireAuth } from '@/lib/auth-helpers';
import { getTasks } from '@/actions/tasks';
import { prisma } from '@/lib/prisma';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const user = await requireAuth();

  // Fetch user data
  const [tasks, subscription, taskStats] = await Promise.all([
    getTasks(),
    prisma.subscription.findUnique({
      where: { userId: user.id },
    }),
    prisma.task.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true,
    }),
  ]);

  // Calculate stats
  const stats = {
    total: tasks.length,
    todo: taskStats.find((s) => s.status === 'TODO')?._count || 0,
    inProgress: taskStats.find((s) => s.status === 'IN_PROGRESS')?._count || 0,
    done: taskStats.find((s) => s.status === 'DONE')?._count || 0,
  };

  return (
    <DashboardContent
      tasks={tasks}
      stats={stats}
      plan={subscription?.plan || 'FREE'}
    />
  );
}