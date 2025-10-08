// app/(dashboard)/dashboard/page.tsx
import { requireAuth } from '@/lib/auth-helpers';
import { getTasks } from '@/actions/tasks';
import { prisma } from '@/lib/prisma';
import { TaskBoard } from '@/components/dashboard/TaskBoard';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import TaskPriorityBreakdown from '@/components/dashboard/TaskPriorityBreakdown';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';

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
      {/* Quick Actions Banner */}
      <QuickActions />

      {/* Stats Cards Grid */}
      <StatsCards stats={stats} plan={subscription?.plan || 'FREE'} />

      {/* Main Content Grid - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Board (2 columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Board */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Tasks</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Drag and drop to update status
                </p>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View All →
              </button>
            </div>
            <TaskBoard tasks={tasks} />
          </div>

          {/* Productivity Chart */}
          <ProductivityChart />
        </div>

        {/* Right Column - Sidebar Widgets (1 column wide) */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <RecentActivity tasks={tasks.slice(0, 5)} />
          
          {/* Upcoming Deadlines */}
          <UpcomingDeadlines tasks={tasks} />
          
          {/* Priority Breakdown */}
          <TaskPriorityBreakdown tasks={tasks} />
        </div>
      </div>
    </div>
  );
}