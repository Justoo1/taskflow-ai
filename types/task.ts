import { Status, Priority } from '@prisma/client';

export interface TaskUser {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

export interface TaskProject {
  id: string;
  name: string;
  color?: string | null;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  author: TaskUser;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskActivity {
  id: string;
  action: string;
  userId: string;
  user: TaskUser;
  taskId: string;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projectId: string | null;
  user: TaskUser;
  project: TaskProject | null;
  comments?: TaskComment[];
  activities?: TaskActivity[];
  aiSuggestions?: unknown | null;
  subtasks?: unknown | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  projectId?: string;
  dueDate?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  projectId?: string;
  dueDate?: Date | null;
}

export interface CreateCommentInput {
  content: string;
}

// Utility types for API responses
export type TaskWithRelations = Task & {
  comments: TaskComment[];
  activities: TaskActivity[];
};

export type TaskListItem = Omit<Task, 'comments' | 'activities'>;

// Constants
export const STATUS_COLORS: Record<Status, string> = {
  TODO: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  DONE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

export const STATUS_LABELS: Record<Status, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const STATUS_PROGRESS_MAP: Record<Status, number> = {
  TODO: 0,
  IN_PROGRESS: 50,
  REVIEW: 75,
  DONE: 100,
};
