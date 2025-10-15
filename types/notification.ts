export type NotificationType = 
  | 'INFO'
  | 'SUCCESS'
  | 'WARNING'
  | 'ERROR'
  | 'TASK_ASSIGNED'
  | 'TASK_COMPLETED'
  | 'TASK_DUE_SOON'
  | 'TASK_OVERDUE'
  | 'COMMENT_ADDED'
  | 'PROJECT_UPDATE'
  | 'SYSTEM';

export interface Notification {
  id: string;
  title: string;
  message?: string | null;
  type: NotificationType;
  read: boolean;
  taskId?: string | null;
  projectId?: string | null;
  userId: string;
  actionUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationInput {
  title: string;
  message?: string;
  type?: NotificationType;
  taskId?: string;
  projectId?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateNotificationInput {
  read?: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}

// Helper function to get notification icon based on type
export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    INFO: '💡',
    SUCCESS: '✅',
    WARNING: '⚠️',
    ERROR: '❌',
    TASK_ASSIGNED: '📋',
    TASK_COMPLETED: '🎉',
    TASK_DUE_SOON: '⏰',
    TASK_OVERDUE: '🚨',
    COMMENT_ADDED: '💬',
    PROJECT_UPDATE: '📊',
    SYSTEM: '🔔',
  };
  return icons[type] || '🔔';
};

// Helper function to get notification color based on type
export const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    INFO: 'text-blue-600 dark:text-blue-400',
    SUCCESS: 'text-green-600 dark:text-green-400',
    WARNING: 'text-yellow-600 dark:text-yellow-400',
    ERROR: 'text-red-600 dark:text-red-400',
    TASK_ASSIGNED: 'text-purple-600 dark:text-purple-400',
    TASK_COMPLETED: 'text-green-600 dark:text-green-400',
    TASK_DUE_SOON: 'text-orange-600 dark:text-orange-400',
    TASK_OVERDUE: 'text-red-600 dark:text-red-400',
    COMMENT_ADDED: 'text-blue-600 dark:text-blue-400',
    PROJECT_UPDATE: 'text-indigo-600 dark:text-indigo-400',
    SYSTEM: 'text-gray-600 dark:text-gray-400',
  };
  return colors[type] || 'text-gray-600';
};

// Helper to format relative time
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
};