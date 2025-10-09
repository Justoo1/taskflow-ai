'use client';

import { useTasks } from './useTasks';
import { useTaskDialog } from './useTaskDialog';
import { useTaskFilters } from './useTaskFilters';
import { useTaskStats } from './useTaskStats';
import { useDeleteConfirmation } from './useDeleteConfirmation';

export function useDashboard() {
  const { tasks, loading, error, refreshTasks } = useTasks();
  const taskDialog = useTaskDialog();
  const filters = useTaskFilters(tasks);
  const stats = useTaskStats(filters.filteredTasks);
  const { confirmDelete, isDeleting } = useDeleteConfirmation(refreshTasks);

  return {
    tasks: filters.filteredTasks,
    allTasks: tasks,
    loading,
    error,
    refreshTasks,
    taskDialog,
    filters,
    stats,
    confirmDelete,
    isDeleting,
  };
}