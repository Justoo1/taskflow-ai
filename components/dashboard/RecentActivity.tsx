// components/dashboard/RecentActivity.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Clock, CheckCircle, Circle, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: Date;
}

interface RecentActivityProps {
  tasks: Task[];
}

const priorityConfig = {
  LOW: { 
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: Circle,
    iconColor: 'text-gray-500'
  },
  MEDIUM: { 
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: Clock,
    iconColor: 'text-blue-500'
  },
  HIGH: { 
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: AlertCircle,
    iconColor: 'text-orange-500'
  },
  URGENT: { 
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: AlertCircle,
    iconColor: 'text-red-500'
  },
};

const statusConfig = {
  TODO: { color: 'bg-slate-100', icon: Circle },
  IN_PROGRESS: { color: 'bg-blue-100', icon: Clock },
  REVIEW: { color: 'bg-yellow-100', icon: AlertCircle },
  DONE: { color: 'bg-green-100', icon: CheckCircle },
};

const RecentActivity = ({ tasks }: RecentActivityProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg dark:text-white">Recent Activity</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
            {tasks.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {tasks.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              No recent activity
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your recent tasks will appear here
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tasks.map((task) => {
              const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig];
              const statusInfo = statusConfig[task.status as keyof typeof statusConfig];
              const PriorityIcon = priorityInfo?.icon || Circle;
              const StatusIcon = statusInfo?.icon || Circle;

              return (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="group flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 cursor-pointer"
                >
                  {/* Status indicator */}
                  <div className={`mt-1 p-2 rounded-lg ${statusInfo?.color || 'bg-gray-100'} dark:bg-opacity-20`}>
                    <StatusIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </p>
                      <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs ${priorityInfo?.color || ''} dark:bg-opacity-20 flex items-center gap-1`}
                      >
                        <PriorityIcon className={`w-3 h-3 ${priorityInfo?.iconColor}`} />
                        {task.priority}
                      </Badge>

                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(task.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View all link */}
        {tasks.length > 0 && (
          <motion.div 
            className="mt-6 pt-4 border-t dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-2 hover:gap-3 transition-all">
              View all activity
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;