// app/(dashboard)/dashboard/layout.tsx
import { requireAuth } from '@/lib/auth-helpers';
import { getTaskCount } from '@/actions/tasks';
import { getProjectCount } from '@/actions/projects';
import { getUserSubscription } from '@/actions/subscription';
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  // Fetch counts and subscription in parallel
  const [taskCount, projectCount, subscriptionPlan] = await Promise.all([
    getTaskCount(),
    getProjectCount(),
    getUserSubscription(user.id),
  ]);

  return (
    <DashboardLayoutClient
      user={user}
      taskCount={taskCount}
      projectCount={projectCount}
      subscriptionPlan={subscriptionPlan}
    >
      {children}
    </DashboardLayoutClient>
  );
}