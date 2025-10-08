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
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

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
  LOW: 'bg-gray-100 text-gray-700 border-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-300',
  URGENT: 'bg-red-100 text-red-700 border-red-300',
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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging || isSortableDragging ? 'shadow-lg ring-2 ring-primary' : ''
      }`}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <button
              {...attributes}
              {...listeners}
              className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('Edit', task.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Delete', task.id)}>
                Delete
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

        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}
          >
            {task.priority}
          </Badge>

          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-red-600' : 'text-muted-foreground'
              }`}
            >
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskCard