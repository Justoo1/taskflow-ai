'use client';

import { useMemo } from 'react';
import { Task } from '@/types/dashboard';
import { generateTaskAnalytics } from '@/lib/dashboard-utils';

export function useTaskStats(tasks: Task[]) {
  return useMemo(() => generateTaskAnalytics(tasks), [tasks]);
}
