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
  TODO: 'bg-slate-100 border-slate-300',
  IN_PROGRESS: 'bg-blue-50 border-blue-300',
  REVIEW: 'bg-yellow-50 border-yellow-300',
  DONE: 'bg-green-50 border-green-300',
};

const statusBadgeColors: Record<Status, string> = {
  TODO: 'bg-slate-500',
  IN_PROGRESS: 'bg-blue-500',
  REVIEW: 'bg-yellow-500',
  DONE: 'bg-green-500',
};

const TaskColumn = ({ id, title, tasks }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-2 ${statusColors[id]} transition-colors ${
        isOver ? 'border-primary ring-2 ring-primary/20' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-current/10">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${statusBadgeColors[id]}`}
          />
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground bg-white/50 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            // TODO: Open create task dialog with this status pre-selected
            console.log('Create task in', id);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <p className="text-sm">No tasks</p>
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

export default TaskColumn