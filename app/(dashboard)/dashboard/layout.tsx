// app/(dashboard)/dashboard/layout.tsx
import { requireAuth } from '@/lib/auth-helpers';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { getTaskCount } from '@/actions/tasks';
import { getProjectCount } from '@/actions/projects';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <Sidebar user={user} taskCount={taskCount} projectCount={projectCount} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header user={user} />

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}