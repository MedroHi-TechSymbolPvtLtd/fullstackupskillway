import { Router } from 'express';
import {
  getUserNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  getUnreadNotificationCountController,
} from '../controllers/notificationController';
import { authenticate, requireAuth } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate, requireAuth);

/**
 * Notification Routes
 */

// Get user notifications
router.get('/', getUserNotificationsController);

// Get unread notification count
router.get('/unread/count', getUnreadNotificationCountController);

// Mark notification as read
router.patch('/:id/read', markNotificationAsReadController);

// Mark all notifications as read
router.patch('/read-all', markAllNotificationsAsReadController);

export default router;





