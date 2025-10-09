'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/dashboard';
import { getTasks } from '@/actions/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = () => loadTasks();

  return { tasks, loading, error, refreshTasks };
}