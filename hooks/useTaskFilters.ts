'use client';

import { useState, useMemo } from 'react';
import { Task } from '@/types/dashboard';
import { filterTasks, sortTasks } from '@/lib/dashboard-utils';

export function useTaskFilters(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply search filter
    if (searchQuery) {
      result = filterTasks(result, searchQuery);
    }

    // Apply priority filter
    if (priorityFilter.length > 0) {
      result = result.filter(task => priorityFilter.includes(task.priority));
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter(task => statusFilter.includes(task.status));
    }

    return sortTasks(result);
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter([]);
    setStatusFilter([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    filteredTasks,
    clearFilters,
    hasActiveFilters: searchQuery !== '' || priorityFilter.length > 0 || statusFilter.length > 0,
  };
}