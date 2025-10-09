'use client';

import { useState } from 'react';
import { Task } from '@/types/dashboard';
import { Status } from '@prisma/client';

interface UseTaskDialogReturn {
  isOpen: boolean;
  task: Task | null;
  defaultStatus: Status | undefined;
  openDialog: (task?: Task, status?: Status) => void;
  closeDialog: () => void;
}

export function useTaskDialog(): UseTaskDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<Status | undefined>();

  const openDialog = (editTask?: Task, status?: Status) => {
    setTask(editTask || null);
    setDefaultStatus(status);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setTask(null);
    setDefaultStatus(undefined);
  };

  return {
    isOpen,
    task,
    defaultStatus,
    openDialog,
    closeDialog,
  };
}