// components/dashboard/TaskPriorityBreakdown.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Circle, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  priority: string;
  status: string;
}

interface TaskPriorityBreakdownProps {
  tasks: Task[];
}

const priorityConfig = {
  URGENT: {
    label: 'Urgent',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    gradient: 'from-red-500 to-red-600',
  },
  HIGH: {
    label: 'High',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    gradient: 'from-orange-500 to-orange-600',
  },
  MEDIUM: {
    label: 'Medium',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
  },
  LOW: {
    label: 'Low',
    icon: Circle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    gradient: 'from-gray-500 to-gray-600',
  },
};

const TaskPriorityBreakdown = ({ tasks }: TaskPriorityBreakdownProps) => {
  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorities = Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>;
  const totalTasks = tasks.length;

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-lg">Priority Breakdown</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white">
            {totalTasks} total
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {totalTasks === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              No tasks yet
            </p>
            <p className="text-xs text-gray-500">
              Create tasks to see priority breakdown
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {priorities.map((priority, index) => {
              const config = priorityConfig[priority];
              const count = priorityCounts[priority] || 0;
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              const Icon = config.icon;

              return (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {count}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Summary section */}
            <motion.div
              className="mt-6 pt-6 border-t space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Most common priority:</span>
                <Badge className={`${priorityConfig[
                  Object.entries(priorityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof priorityConfig || 'MEDIUM'
                ].bgColor} ${priorityConfig[
                  Object.entries(priorityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof priorityConfig || 'MEDIUM'
                ].color} border-0`}>
                  {priorityConfig[
                    Object.entries(priorityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof priorityConfig || 'MEDIUM'
                  ].label}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">High priority tasks:</span>
                <span className="font-semibold text-orange-600">
                  {(priorityCounts.URGENT || 0) + (priorityCounts.HIGH || 0)}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskPriorityBreakdown;