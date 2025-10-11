import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import AIAssistantDashboard from '@/components/ai/AIAssistantDashboard';

const AIAssistantPage = async () => {
  const user = await requireAuth();

  const [subscription, aiUsageStats, tasks] = await Promise.all([
    prisma.subscription.findUnique({
      where: { userId: user.id },
    }),
    prisma.aIUsage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.task.count({
      where: { userId: user.id },
    }),
  ]);

  const stats = {
    totalTokens: aiUsageStats.reduce((sum, u) => sum + u.tokens, 0),
    totalCost: aiUsageStats.reduce((sum, u) => sum + u.cost, 0),
    usageCount: aiUsageStats.length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          AI Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Leverage AI to boost your productivity and manage tasks smarter
        </p>
      </div>

      <AIAssistantDashboard
        plan={subscription?.plan || 'FREE'}
        stats={stats}
        taskCount={tasks}
      />
    </div>
  );
}

export default AIAssistantPage;