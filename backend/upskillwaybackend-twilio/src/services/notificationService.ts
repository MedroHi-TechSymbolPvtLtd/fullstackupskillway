import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { NotificationType } from '@prisma/client';

/**
 * Notification Service
 * Handles user notifications for email events and system events
 */

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Create a notification
 */
export const createNotification = async (input: CreateNotificationInput) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        metadata: input.metadata || {},
      },
    });

    logger.info(`Notification created: ${notification.id} for user ${input.userId}`);
    return notification;
  } catch (error) {
    logger.error('Create notification failed', error);
    throw error;
  }
};

/**
 * Create notification for email sent
 */
export const notifyEmailSent = async (
  userId: string,
  email: string,
  subject: string,
  emailLogId?: string,
  leadId?: string
) => {
  return createNotification({
    userId,
    type: 'EMAIL_SENT',
    title: 'Email Sent Successfully',
    message: `Email sent to ${email}: ${subject}`,
    metadata: {
      email,
      subject,
      emailLogId,
      leadId,
    },
  });
};

/**
 * Create notification for email failed
 */
export const notifyEmailFailed = async (
  userId: string,
  email: string,
  subject: string,
  error: string,
  emailLogId?: string,
  leadId?: string
) => {
  return createNotification({
    userId,
    type: 'EMAIL_FAILED',
    title: 'Email Failed to Send',
    message: `Failed to send email to ${email}: ${subject}. Error: ${error}`,
    metadata: {
      email,
      subject,
      error,
      emailLogId,
      leadId,
    },
  });
};

/**
 * Create notification for bulk email completed
 */
export const notifyBulkEmailCompleted = async (
  userId: string,
  total: number,
  successful: number,
  failed: number
) => {
  return createNotification({
    userId,
    type: 'BULK_EMAIL_COMPLETED',
    title: 'Bulk Email Completed',
    message: `Bulk email completed: ${successful} sent, ${failed} failed out of ${total} total`,
    metadata: {
      total,
      successful,
      failed,
    },
  });
};

/**
 * Create notification for automation triggered
 */
export const notifyAutomationTriggered = async (
  userId: string,
  automationName: string,
  leadId: string,
  email: string
) => {
  return createNotification({
    userId,
    type: 'AUTOMATION_TRIGGERED',
    title: 'Email Automation Triggered',
    message: `Automation "${automationName}" triggered for lead ${leadId}`,
    metadata: {
      automationName,
      leadId,
      email,
    },
  });
};

/**
 * Create notification for automation failed
 */
export const notifyAutomationFailed = async (
  userId: string,
  automationName: string,
  leadId: string,
  error: string
) => {
  return createNotification({
    userId,
    type: 'AUTOMATION_FAILED',
    title: 'Email Automation Failed',
    message: `Automation "${automationName}" failed for lead ${leadId}: ${error}`,
    metadata: {
      automationName,
      leadId,
      error,
    },
  });
};

/**
 * Get notifications for a user
 */
export const getUserNotifications = async (
  userId: string,
  options: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: NotificationType;
  } = {}
) => {
  try {
    const { page = 1, limit = 20, isRead, type } = options;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }
    if (type) {
      where.type = type;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Get user notifications failed', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
      },
      data: {
        isRead: true,
      },
    });

    if (notification.count === 0) {
      throw new Error('Notification not found or access denied');
    }

    return { success: true };
  } catch (error) {
    logger.error('Mark notification as read failed', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { success: true };
  } catch (error) {
    logger.error('Mark all notifications as read failed', error);
    throw error;
  }
};

/**
 * Get unread notification count for a user
 */
export const getUnreadNotificationCount = async (userId: string) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  } catch (error) {
    logger.error('Get unread notification count failed', error);
    throw error;
  }
};





