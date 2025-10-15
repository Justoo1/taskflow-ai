// components/dashboard/StatsCards.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, ListTodo, TrendingUp, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  plan: string;
}

const StatsCards = ({ stats, plan }: StatsCardsProps) => {
  const completionRate = stats.total > 0 
    ? Math.round((stats.done / stats.total) * 100) 
    : 0;

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
      change: null,
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: Clock,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      gradient: 'from-slate-500 to-slate-600',
      change: null,
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      gradient: 'from-amber-500 to-amber-600',
      change: null,
    },
    {
      title: 'Completed',
      value: stats.done,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradient: 'from-green-500 to-green-600',
      change: `${completionRate}%`,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={cardVariants}>
          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600 dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                    {card.change && (
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        {card.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`${card.bgColor} dark:bg-opacity-20 p-4 rounded-xl shadow-sm`}>
                  <card.icon className={`h-7 w-7 ${card.color} dark:opacity-90`} />
                </div>
              </div>
              
              {/* Progress bar for completed tasks */}
              {card.title === 'Completed' && stats.total > 0 && (
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Completion Rate</span>
                    <span className="font-semibold">{completionRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            
            {/* Decorative gradient overlay */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-5 dark:opacity-10 rounded-full blur-2xl`} />
          </Card>
        </motion.div>
      ))}

      {/* Plan Badge Card */}
      <motion.div variants={cardVariants} className="sm:col-span-2 lg:col-span-4">
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Current Plan</p>
                  <p className="text-lg font-bold">{plan} Plan</p>
                </div>
              </div>
              {plan === 'FREE' && (
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Upgrade Now
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default StatsCards;