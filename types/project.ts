import { Status, Priority } from '@prisma/client';

export interface ProjectTask {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projectId: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ProjectWithTasks extends Project {
  tasks: ProjectTask[];
  _count: {
    tasks: number;
  };
}

export interface ProjectWithFullTasks extends Project {
  tasks: Array<ProjectTask & {
    project?: {
      id: string;
      name: string;
      color?: string | null;
    } | null;
  }>;
  _count: {
    tasks: number;
  };
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}

export interface ProjectStats {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  review: number;
  progress: number;
}

export interface ProjectPriorityStats {
  urgent: number;
  high: number;
  medium: number;
  low: number;
}

export interface AIProjectPhase {
  name: string;
  tasks: string[];
}

export interface AIProjectPlan {
  phases: AIProjectPhase[];
}

// Utility function types
export type ProjectFilter = {
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'taskCount';
  sortOrder?: 'asc' | 'desc';
};

// Constants
export const DEFAULT_PROJECT_COLOR = '#3B82F6';

export const PRESET_PROJECT_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Green
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#8B5CF6', // Violet
  '#EC4899', // Rose
] as const;