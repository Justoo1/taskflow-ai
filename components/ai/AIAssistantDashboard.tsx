'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AIChat from './AIChat';
import AIInsightsCard from './AIInsightsCard';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Lock,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AIAssistantDashboardProps {
  plan: string;
  stats: {
    totalTokens: number;
    totalCost: number;
    usageCount: number;
  };
  taskCount: number;
}

export default function AIAssistantDashboard({ 
  plan, 
  stats, 
  taskCount 
}: AIAssistantDashboardProps) {
  const isPro = plan !== 'FREE';

  const features = [
    {
      icon: Brain,
      title: 'Task Analysis',
      description: 'Get AI-powered insights and breakdowns for your tasks',
      available: isPro,
    },
    {
      icon: TrendingUp,
      title: 'Productivity Insights',
      description: 'Receive personalized recommendations to optimize your workflow',
      available: isPro,
    },
    {
      icon: Zap,
      title: 'Smart Suggestions',
      description: 'AI-generated task suggestions based on your patterns',
      available: isPro,
    },
    {
      icon: Sparkles,
      title: 'Chat Assistant',
      description: 'Have conversations with AI about your work',
      available: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              AI Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.usageCount}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tokens Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalTokens.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total computation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Plan Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {plan}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isPro ? 'Full AI access' : 'Limited features'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Chat */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Chat Assistant
            </CardTitle>
            <CardDescription>
              Ask questions and get help with your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIChat isOpen={true} />
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="space-y-6">
          {isPro ? (
            <AIInsightsCard />
          ) : (
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                  AI Insights (Pro)
                </CardTitle>
                <CardDescription>
                  Unlock advanced AI features with Pro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Upgrade to Pro
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get AI-powered insights, task analysis, and more
                  </p>
                  <Link href="/settings/billing">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Upgrade Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Tasks
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {taskCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  AI Queries Today
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.usageCount > 0 ? Math.min(stats.usageCount, 10) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated Savings
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {Math.round(stats.usageCount * 5)} min
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          AI Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={!feature.available ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className={`w-8 h-8 ${feature.available ? 'text-blue-600' : 'text-gray-400'}`} />
                    {!feature.available && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}