'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AIUsageStats {
  totalTokens: number;
  totalCost: number;
  usageCount: number;
  byFeature: Record<string, number>;
  recentUsage: Array<{
    id: string;
    userId: string;
    feature: string;
    tokens: number;
    cost: number;
    createdAt: Date;
    user?: {
      name: string | null;
      email: string;
    };
  }>;
}

interface AIUsageDashboardProps {
  stats: AIUsageStats;
  totalUsers?: number;
  activeUsers?: number;
}

const AIUsageDashboard = ({ 
  stats, 
  totalUsers = 0,
  activeUsers = 0 
}: AIUsageDashboardProps) => {
  const avgCostPerUser = activeUsers > 0 ? stats.totalCost / activeUsers : 0;
  const avgTokensPerRequest = stats.usageCount > 0 ? stats.totalTokens / stats.usageCount : 0;

  // Get most used feature
  const mostUsedFeature = Object.entries(stats.byFeature)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const formatFeatureName = (feature: string) => {
    return feature
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('chat')) return '💬';
    if (feature.includes('analysis')) return '📊';
    if (feature.includes('insight')) return '💡';
    if (feature.includes('suggestion')) return '✨';
    return '🤖';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Total Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalTokens.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ~{avgTokensPerRequest.toFixed(0)} per request
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${stats.totalCost.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ${avgCostPerUser.toFixed(2)} per active user
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                AI Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.usageCount.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeUsers}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {totalUsers > 0 ? `${((activeUsers / totalUsers) * 100).toFixed(1)}% of total` : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Usage by Feature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Usage by Feature
          </CardTitle>
          <CardDescription>
            AI feature breakdown for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.byFeature)
              .sort((a, b) => b[1] - a[1])
              .map(([feature, count], index) => {
                const percentage = (count / stats.usageCount) * 100;
                return (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFeatureIcon(feature)}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatFeatureName(feature)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {count} requests
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {Object.keys(stats.byFeature).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No AI usage data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Activity</CardTitle>
          <CardDescription>
            Latest AI requests across all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentUsage.map((usage, index) => (
              <motion.div
                key={usage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {usage.user?.name?.[0] || usage.user?.email?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {usage.user?.name || usage.user?.email || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFeatureName(usage.feature)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {usage.tokens.toLocaleString()} tokens
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${usage.cost.toFixed(4)}
                  </p>
                </div>
              </motion.div>
            ))}

            {stats.recentUsage.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Usage Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Most Popular Feature
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {formatFeatureName(mostUsedFeature)} is your most used AI feature
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Cost Efficiency
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Average cost per request: ${(stats.totalCost / stats.usageCount).toFixed(4)}
              </p>
            </div>
          </div>

          {avgCostPerUser > 10 && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  High Usage Alert
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Consider implementing request caching to reduce costs
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIUsageDashboard;