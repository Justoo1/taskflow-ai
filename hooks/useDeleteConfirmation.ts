'use client';

import { useState } from 'react';
import { deleteTask } from '@/actions/tasks';
import { toast } from 'sonner';

interface UseDeleteConfirmationReturn {
  isDeleting: boolean;
  confirmDelete: (taskId: string, taskTitle: string) => Promise<void>;
}

export function useDeleteConfirmation(onSuccess?: () => void): UseDeleteConfirmationReturn {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async (taskId: string, taskTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, confirmDelete };
}
