// components/dashboard/TaskCard.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Status } from '@prisma/client';
import { GripVertical, Calendar, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { format, isPast, isToday } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: Status;
  dueDate?: Date | null;
}

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300',
  URGENT: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-300',
};

const priorityIcons = {
  LOW: '🟢',
  MEDIUM: '🔵',
  HIGH: '🟠',
  URGENT: '🔴',
};

const TaskCard = ({ task, isDragging = false }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const handleEdit = () => {
    console.log('Edit task:', task.id);
    // TODO: Open edit modal/drawer
  };

  const handleDelete = () => {
    console.log('Delete task:', task.id);
    // TODO: Show confirmation and delete
  };

  const handleViewDetails = () => {
    console.log('View details:', task.id);
    // TODO: Open task details modal
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        ${isDragging || isSortableDragging ? 'shadow-lg ring-2 ring-primary rotate-2 scale-105' : ''}
      `}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <button
              {...attributes}
              {...listeners}
              className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-snug text-gray-900 dark:text-white line-clamp-2">
                {task.title}
              </h4>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleViewDetails}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]} flex items-center gap-1`}
          >
            <span>{priorityIcons[task.priority as keyof typeof priorityIcons]}</span>
            {task.priority}
          </Badge>

          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isOverdue 
                  ? 'text-red-600 dark:text-red-400 font-semibold' 
                  : isDueToday
                  ? 'text-orange-600 dark:text-orange-400 font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              <Calendar className="h-3 w-3" />
              <span>
                {isOverdue ? 'Overdue: ' : isDueToday ? 'Today: ' : ''}
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskCard;