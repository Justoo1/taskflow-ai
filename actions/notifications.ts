// actions/notifications.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NotificationType } from '@/types/notification';
import { Prisma } from '@prisma/client';

/**
 * Get all notifications for the current user
 */
export async function getNotifications(limit: number = 50) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      task: {
        select: {
          id: true,
          title: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return notifications;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const count = await prisma.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  return count;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Verify ownership
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { userId: true },
  });

  if (!notification || notification.userId !== session.user.id) {
    throw new Error('Notification not found or unauthorized');
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  revalidatePath('/dashboard');
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    data: { read: true },
  });

  revalidatePath('/dashboard');
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Verify ownership
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { userId: true },
  });

  if (!notification || notification.userId !== session.user.id) {
    throw new Error('Notification not found or unauthorized');
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  revalidatePath('/dashboard');
}

/**
 * Delete all read notifications
 */
export async function deleteReadNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await prisma.notification.deleteMany({
    where: {
      userId: session.user.id,
      read: true,
    },
  });

  revalidatePath('/dashboard');
}

/**
 * Create a notification (typically called by system events)
 */
export async function createNotification(
  userId: string,
  data: {
    title: string;
    message?: string;
    type?: NotificationType;
    taskId?: string;
    projectId?: string;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      title: data.title,
      message: data.message,
      type: data.type || 'INFO',
      taskId: data.taskId,
      projectId: data.projectId,
      actionUrl: data.actionUrl,
      metadata: (data.metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });

  revalidatePath('/dashboard');
  return notification;
}

/**
 * Create notifications for task events
 */
export async function notifyTaskEvent(
  taskId: string,
  event: 'created' | 'updated' | 'completed' | 'due_soon' | 'overdue' | 'assigned',
  additionalData?: Record<string, unknown>
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { user: true, project: true },
  });

  if (!task) return;

  const notificationMap = {
    created: {
      title: 'New task created',
      message: `Task "${task.title}" has been created`,
      type: 'TASK_ASSIGNED' as NotificationType,
    },
    updated: {
      title: 'Task updated',
      message: `Task "${task.title}" has been updated`,
      type: 'INFO' as NotificationType,
    },
    completed: {
      title: 'Task completed!',
      message: `Great job! "${task.title}" is complete`,
      type: 'TASK_COMPLETED' as NotificationType,
    },
    due_soon: {
      title: 'Task due soon',
      message: `"${task.title}" is due soon`,
      type: 'TASK_DUE_SOON' as NotificationType,
    },
    overdue: {
      title: 'Task overdue',
      message: `"${task.title}" is now overdue`,
      type: 'TASK_OVERDUE' as NotificationType,
    },
    assigned: {
      title: 'Task assigned to you',
      message: `You've been assigned "${task.title}"`,
      type: 'TASK_ASSIGNED' as NotificationType,
    },
  };

  const notification = notificationMap[event];

  await createNotification(task.userId, {
    ...notification,
    taskId: task.id,
    projectId: task.projectId || undefined,
    actionUrl: `/dashboard/tasks/${task.id}`,
    metadata: additionalData,
  });
}

/**
 * Get notification statistics
 */
export async function getNotificationStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const [total, unread, byType] = await Promise.all([
    prisma.notification.count({
      where: { userId: session.user.id },
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false },
    }),
    prisma.notification.groupBy({
      by: ['type'],
      where: { userId: session.user.id },
      _count: true,
    }),
  ]);

  const byTypeMap = byType.reduce((acc, item) => {
    acc[item.type] = item._count;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    unread,
    byType: byTypeMap,
  };
}