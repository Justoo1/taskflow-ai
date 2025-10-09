'use client';

import { motion } from 'framer-motion';
import { Calendar, Flag, Clock, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  dueDate?: Date | null;
}

interface TaskListViewProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string, taskTitle: string) => void;
}

export const TaskListView = ({ tasks, onEditTask, onDeleteTask }: TaskListViewProps) => {
  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };

  const statusColors = {
    TODO: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    DONE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  };

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {task.title}
                  </h3>
                </div>
                
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                  </Badge>

                  <Badge 
                    variant="outline" 
                    className={`text-xs ${statusColors[task.status as keyof typeof statusColors]}`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {task.status.replace('_', ' ')}
                  </Badge>

                  {task.dueDate && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(task.dueDate), 'MMM d')}
                    </Badge>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditTask?.(task)}>
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDeleteTask?.(task.id, task.title)}
                    className="text-red-600 dark:text-red-400"
                  >
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};