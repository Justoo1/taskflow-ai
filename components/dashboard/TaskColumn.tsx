// components/dashboard/TaskColumn.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Status } from '@prisma/client';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: Status;
  dueDate?: Date | null;
}

interface TaskColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
}

const statusColors: Record<Status, string> = {
  TODO: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600',
  IN_PROGRESS: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
  REVIEW: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
  DONE: 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700',
};

const statusBadgeColors: Record<Status, string> = {
  TODO: 'bg-slate-500 dark:bg-slate-600',
  IN_PROGRESS: 'bg-blue-500 dark:bg-blue-600',
  REVIEW: 'bg-yellow-500 dark:bg-yellow-600',
  DONE: 'bg-green-500 dark:bg-green-600',
};

const TaskColumn = ({ id, title, tasks }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-2 ${statusColors[id]} transition-all duration-200 ${
        isOver ? 'border-primary ring-2 ring-primary/20 shadow-lg' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-current/10">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${statusBadgeColors[id]} shadow-sm`}
          />
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{title}</h3>
          <span className="text-xs text-muted-foreground bg-white/50 dark:bg-gray-700/50 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-700/50"
          onClick={() => {
            // TODO: Open create task dialog with this status pre-selected
            console.log('Create task in', id);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <p className="text-sm font-medium">No tasks</p>
              <p className="text-xs">Drag tasks here or create new ones</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default TaskColumn;