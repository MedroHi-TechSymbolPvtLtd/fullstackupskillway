import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from '../services/notificationService';

/**
 * Notification Controller
 */

export const getUserNotificationsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as any)?.id || (req.user as any)?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'User information not found',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;
  const type = req.query.type as any;

  const result = await getUserNotifications(userId, { page, limit, isRead, type });
  sendPaginated(res, result.notifications, result.pagination, 'Notifications retrieved successfully');
});

export const markNotificationAsReadController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req.user as any)?.id || (req.user as any)?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'User information not found',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const result = await markNotificationAsRead(id, userId);
  sendSuccess(res, result, 'Notification marked as read');
});

export const markAllNotificationsAsReadController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as any)?.id || (req.user as any)?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'User information not found',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const result = await markAllNotificationsAsRead(userId);
  sendSuccess(res, result, 'All notifications marked as read');
});

export const getUnreadNotificationCountController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as any)?.id || (req.user as any)?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'User information not found',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const result = await getUnreadNotificationCount(userId);
  sendSuccess(res, result, 'Unread notification count retrieved successfully');
});





