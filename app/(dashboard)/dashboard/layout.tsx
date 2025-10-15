// app/(dashboard)/dashboard/layout.tsx
import { requireAuth } from '@/lib/auth-helpers';
import { getDashboardData } from '@/actions/dashboard';
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  // Fetch all dashboard data in a single optimized query
  const { taskCount, projectCount, subscriptionPlan } = await getDashboardData(user.id);

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