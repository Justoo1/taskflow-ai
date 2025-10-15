import { prisma } from '@/lib/prisma';
import { NotificationType } from '@/types/notification';
import { Prisma, Status } from '@prisma/client';

/**
 * Create a notification for a user
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
  try {
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
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Automatically create notifications when tasks are created
 */
export async function notifyTaskCreated(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) return;

  await createNotification(task.userId, {
    title: 'New task created',
    message: `Task "${task.title}" has been created${task.project ? ` in ${task.project.name}` : ''}`,
    type: 'TASK_ASSIGNED',
    taskId: task.id,
    projectId: task.projectId || undefined,
    actionUrl: `/dashboard/tasks/${task.id}`,
  });
}

/**
 * Notify when task status changes
 */
export async function notifyTaskStatusChange(
  taskId: string,
  oldStatus: Status,
  newStatus: Status
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) return;

  // Only notify on significant status changes
  if (newStatus === 'DONE') {
    await createNotification(task.userId, {
      title: 'Task completed! 🎉',
      message: `Congratulations! You completed "${task.title}"`,
      type: 'TASK_COMPLETED',
      taskId: task.id,
      projectId: task.projectId || undefined,
      actionUrl: `/dashboard/tasks/${task.id}`,
      metadata: { oldStatus, newStatus },
    });
  } else if (newStatus === 'IN_PROGRESS' && oldStatus === 'TODO') {
    await createNotification(task.userId, {
      title: 'Task in progress',
      message: `You started working on "${task.title}"`,
      type: 'INFO',
      taskId: task.id,
      projectId: task.projectId || undefined,
      actionUrl: `/dashboard/tasks/${task.id}`,
      metadata: { oldStatus, newStatus },
    });
  }
}

/**
 * Check for tasks due soon and create notifications
 */
export async function notifyTasksDueSoon() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find tasks due within 24 hours that haven't been completed
  const tasks = await prisma.task.findMany({
    where: {
      status: { not: 'DONE' },
      dueDate: {
        gte: now,
        lte: tomorrow,
      },
    },
    include: { project: true },
  });

  for (const task of tasks) {
    // Check if notification already exists for this task
    const existingNotification = await prisma.notification.findFirst({
      where: {
        taskId: task.id,
        type: 'TASK_DUE_SOON',
        createdAt: {
          gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    if (!existingNotification) {
      await createNotification(task.userId, {
        title: 'Task due soon ⏰',
        message: `"${task.title}" is due soon. Don't forget to complete it!`,
        type: 'TASK_DUE_SOON',
        taskId: task.id,
        projectId: task.projectId || undefined,
        actionUrl: `/dashboard/tasks/${task.id}`,
      });
    }
  }
}

/**
 * Check for overdue tasks and create notifications
 */
export async function notifyOverdueTasks() {
  const now = new Date();

  // Find tasks that are overdue and not completed
  const tasks = await prisma.task.findMany({
    where: {
      status: { not: 'DONE' },
      dueDate: {
        lt: now,
      },
    },
    include: { project: true },
  });

  for (const task of tasks) {
    // Check if notification already exists for this task today
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const existingNotification = await prisma.notification.findFirst({
      where: {
        taskId: task.id,
        type: 'TASK_OVERDUE',
        createdAt: {
          gte: today,
        },
      },
    });

    if (!existingNotification) {
      await createNotification(task.userId, {
        title: 'Task overdue! 🚨',
        message: `"${task.title}" is overdue. Please complete it as soon as possible.`,
        type: 'TASK_OVERDUE',
        taskId: task.id,
        projectId: task.projectId || undefined,
        actionUrl: `/dashboard/tasks/${task.id}`,
      });
    }
  }
}

/**
 * Notify when a comment is added to a task
 */
export async function notifyCommentAdded(
  taskId: string,
  commentAuthorId: string,
  commentContent: string
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { 
      project: true,
      user: true,
    },
  });

  if (!task) return;

  // Don't notify the comment author
  if (task.userId === commentAuthorId) return;

  const author = await prisma.user.findUnique({
    where: { id: commentAuthorId },
  });

  await createNotification(task.userId, {
    title: 'New comment on your task 💬',
    message: `${author?.name || 'Someone'} commented on "${task.title}": ${commentContent.substring(0, 100)}${commentContent.length > 100 ? '...' : ''}`,
    type: 'COMMENT_ADDED',
    taskId: task.id,
    projectId: task.projectId || undefined,
    actionUrl: `/dashboard/tasks/${task.id}`,
    metadata: { commentAuthorId, commentAuthor: author?.name },
  });
}

/**
 * Notify about project updates
 */
export async function notifyProjectUpdate(
  projectId: string,
  updateMessage: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) return;

  await createNotification(project.userId, {
    title: 'Project update 📊',
    message: updateMessage,
    type: 'PROJECT_UPDATE',
    projectId: project.id,
    actionUrl: `/dashboard/projects/${project.id}`,
  });
}

/**
 * Clean up old read notifications (optional - can be run as a cron job)
 */
export async function cleanupOldNotifications(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  await prisma.notification.deleteMany({
    where: {
      read: true,
      createdAt: {
        lt: cutoffDate,
      },
    },
  });
}