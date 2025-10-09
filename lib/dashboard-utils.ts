import { Task, DashboardStats, ProductivityData } from '@/types/dashboard';
import { differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

/**
 * Calculate dashboard statistics from tasks
 */
export function calculateStats(tasks: Task[]): DashboardStats {
  const stats = {
    total: tasks.length,
    todo: 0,
    inProgress: 0,
    done: 0,
  };

  tasks.forEach((task) => {
    switch (task.status) {
      case 'TODO':
        stats.todo++;
        break;
      case 'IN_PROGRESS':
        stats.inProgress++;
        break;
      case 'DONE':
        stats.done++;
        break;
    }
  });

  return stats;
}

/**
 * Get tasks grouped by status
 */
export function groupTasksByStatus(tasks: Task[]) {
  return {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    REVIEW: tasks.filter(t => t.status === 'REVIEW'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  };
}

/**
 * Get tasks grouped by priority
 */
export function groupTasksByPriority(tasks: Task[]) {
  return {
    LOW: tasks.filter(t => t.priority === 'LOW'),
    MEDIUM: tasks.filter(t => t.priority === 'MEDIUM'),
    HIGH: tasks.filter(t => t.priority === 'HIGH'),
    URGENT: tasks.filter(t => t.priority === 'URGENT'),
  };
}

/**
 * Get overdue tasks
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  const now = new Date();
  return tasks.filter(task => {
    if (!task.dueDate || task.status === 'DONE') return false;
    return new Date(task.dueDate) < now;
  });
}

/**
 * Get tasks due today
 */
export function getTasksDueToday(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks.filter(task => {
    if (!task.dueDate || task.status === 'DONE') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate < tomorrow;
  });
}

/**
 * Get upcoming tasks (within next 7 days)
 */
export function getUpcomingTasks(tasks: Task[], days: number = 7): Task[] {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return tasks.filter(task => {
    if (!task.dueDate || task.status === 'DONE') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= now && dueDate <= future;
  }).sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    return dateA - dateB;
  });
}

/**
 * Calculate weekly productivity data
 */
export function calculateWeeklyProductivity(tasks: Task[]): ProductivityData[] {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  return days.map(day => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const completed = tasks.filter(task => {
      if (task.status !== 'DONE') return false;
      const updatedAt = new Date(task.updatedAt);
      return updatedAt >= dayStart && updatedAt <= dayEnd;
    }).length;

    const total = tasks.filter(task => {
      const createdAt = new Date(task.createdAt);
      return createdAt <= dayEnd;
    }).length;

    return {
      day: format(day, 'EEE'),
      completed,
      total: Math.max(completed, 3), // Minimum for display
    };
  });
}

/**
 * Get completion rate percentage
 */
export function getCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'DONE').length;
  return Math.round((completed / tasks.length) * 100);
}

/**
 * Get task priority score (for sorting)
 */
export function getPriorityScore(priority: string): number {
  const scores: Record<string, number> = {
    URGENT: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };
  return scores[priority] || 0;
}

/**
 * Sort tasks by priority and due date
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // First by status (TODO > IN_PROGRESS > REVIEW > DONE)
    const statusOrder = { TODO: 0, IN_PROGRESS: 1, REVIEW: 2, DONE: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // Then by priority
    const priorityDiff = getPriorityScore(b.priority) - getPriorityScore(a.priority);
    if (priorityDiff !== 0) return priorityDiff;

    // Then by due date (earlier first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Filter tasks by search query
 */
export function filterTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks;
  
  const lowerQuery = query.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(lowerQuery) ||
    task.description?.toLowerCase().includes(lowerQuery) ||
    task.priority.toLowerCase().includes(lowerQuery) ||
    task.project?.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get task color by priority
 */
export function getTaskColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: '#6b7280',
    MEDIUM: '#3b82f6',
    HIGH: '#f59e0b',
    URGENT: '#ef4444',
  };
  return colors[priority] || colors.MEDIUM;
}

/**
 * Format date for display
 */
export function formatDueDate(date: Date | null | undefined): string {
  if (!date) return 'No due date';
  
  const dueDate = new Date(date);
  const now = new Date();
  const diffDays = differenceInDays(dueDate, now);

  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  
  return format(dueDate, 'MMM d, yyyy');
}

/**
 * Get urgency level based on due date and priority
 */
export function getTaskUrgency(task: Task): 'critical' | 'high' | 'medium' | 'low' {
  if (!task.dueDate) {
    return task.priority === 'URGENT' ? 'high' : 'low';
  }

  const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
  
  if (daysUntilDue < 0) return 'critical'; // Overdue
  if (daysUntilDue === 0) return 'critical'; // Due today
  if (daysUntilDue <= 2 && (task.priority === 'HIGH' || task.priority === 'URGENT')) return 'high';
  if (daysUntilDue <= 7) return 'medium';
  
  return 'low';
}

/**
 * Generate task analytics summary
 */
export function generateTaskAnalytics(tasks: Task[]) {
  const stats = calculateStats(tasks);
  const overdue = getOverdueTasks(tasks);
  const dueToday = getTasksDueToday(tasks);
  const upcoming = getUpcomingTasks(tasks);
  const priorityGroups = groupTasksByPriority(tasks);

  return {
    stats,
    overdue: overdue.length,
    dueToday: dueToday.length,
    upcoming: upcoming.length,
    completionRate: getCompletionRate(tasks),
    highPriorityCount: priorityGroups.HIGH.length + priorityGroups.URGENT.length,
    averageTasksPerDay: tasks.length > 0 ? (tasks.length / 7).toFixed(1) : '0',
  };
}
