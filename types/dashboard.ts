import { Status } from '@prisma/client';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: Status;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projectId?: string | null;
  project?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
}

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export interface ProductivityData {
  day: string;
  completed: number;
  total: number;
}

export interface PriorityCount {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  URGENT: number;
}