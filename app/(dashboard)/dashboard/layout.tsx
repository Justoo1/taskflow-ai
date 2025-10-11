// app/(dashboard)/dashboard/layout.tsx
import { requireAuth } from '@/lib/auth-helpers';
import { getTaskCount } from '@/actions/tasks';
import { getProjectCount } from '@/actions/projects';
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  // Fetch counts in parallel
  const [taskCount, projectCount] = await Promise.all([
    getTaskCount(),
    getProjectCount(),
  ]);

  return (
    <DashboardLayoutClient
      user={user}
      taskCount={taskCount}
      projectCount={projectCount}
    >
      {children}
    </DashboardLayoutClient>
  );
}