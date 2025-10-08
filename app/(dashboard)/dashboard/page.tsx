// app/(dashboard)/dashboard/page.tsx
import { requireAuth } from '@/lib/auth-helpers';
import { getTasks } from '@/actions/tasks';
import { prisma } from '@/lib/prisma';
import { TaskBoard } from '@/components/dashboard/TaskBoard';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';

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
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Cards */}
      <StatsCards stats={stats} plan={subscription?.plan || 'FREE'} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Board - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Tasks
            </h2>
            <TaskBoard tasks={tasks} />
          </div>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          <RecentActivity tasks={tasks.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}