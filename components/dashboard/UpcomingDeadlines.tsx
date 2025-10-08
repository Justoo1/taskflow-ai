// components/dashboard/UpcomingDeadlines.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  dueDate?: Date | null;
  priority: string;
  status: string;
}

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

const UpcomingDeadlines = ({ tasks }: UpcomingDeadlinesProps) => {
  const tasksWithDeadlines = tasks
    .filter(task => task.dueDate && task.status !== 'DONE')
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  const getDeadlineStatus = (dueDate: Date) => {
    if (isPast(dueDate) && !isToday(dueDate)) {
      return {
        label: 'Overdue',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: AlertTriangle,
      };
    }
    if (isToday(dueDate)) {
      return {
        label: 'Due today',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: Clock,
      };
    }
    if (isTomorrow(dueDate)) {
      return {
        label: 'Due tomorrow',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: Clock,
      };
    }
    const daysUntil = differenceInDays(dueDate, new Date());
    if (daysUntil <= 7) {
      return {
        label: `In ${daysUntil} days`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: Calendar,
      };
    }
    return {
      label: format(dueDate, 'MMM d'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: Calendar,
    };
  };

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
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-lg dark:text-white">Upcoming Deadlines</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-700 dark:text-gray-300">
            {tasksWithDeadlines.length} tasks
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {tasksWithDeadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              All caught up!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No upcoming deadlines to worry about
            </p>
          </div>
        ) : (
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tasksWithDeadlines.map((task) => {
              const dueDate = new Date(task.dueDate!);
              const status = getDeadlineStatus(dueDate);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                >
                  {/* Icon */}
                  <div className={`mt-0.5 p-2 rounded-lg ${status.bgColor} dark:bg-opacity-20`}>
                    <StatusIcon className={`w-4 h-4 ${status.color} dark:opacity-90`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs ${status.bgColor} ${status.color} border-0 dark:bg-opacity-20`}
                      >
                        {status.label}
                      </Badge>

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(dueDate, 'MMM d, yyyy')}
                      </span>

                      {task.priority === 'URGENT' && (
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Quick stats */}
        {tasksWithDeadlines.length > 0 && (
          <motion.div
            className="mt-6 pt-4 border-t dark:border-gray-700 grid grid-cols-3 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {tasksWithDeadlines.filter(t => t.dueDate && isPast(new Date(t.dueDate))).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {tasksWithDeadlines.filter(t => t.dueDate && isToday(new Date(t.dueDate))).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {tasksWithDeadlines.filter(t => {
                  if (!t.dueDate) return false;
                  const days = differenceInDays(new Date(t.dueDate), new Date());
                  return days > 0 && days <= 7;
                }).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;