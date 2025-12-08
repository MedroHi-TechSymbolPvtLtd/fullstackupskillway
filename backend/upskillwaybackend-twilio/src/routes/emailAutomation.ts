import { Router } from 'express';
import {
  createEmailAutomationController,
  getAllEmailAutomationsController,
  getEmailAutomationByIdController,
  updateEmailAutomationController,
  deleteEmailAutomationController,
  getAutomationLogsController,
} from '../controllers/emailAutomationController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import {
  createEmailAutomationSchema,
  updateEmailAutomationSchema,
  emailAutomationQuerySchema,
} from '../validators/emailAutomation';

const router = Router();

// All routes require authentication
router.use(authenticate, requireAuth);

/**
 * Email Automation Routes
 */

// Create email automation
router.post(
  '/',
  validateSchemaMiddleware(createEmailAutomationSchema),
  createEmailAutomationController
);

// Get all email automations
router.get('/', validateQuery(emailAutomationQuerySchema), getAllEmailAutomationsController);

// Get email automation by ID
router.get('/:id', getEmailAutomationByIdController);

// Get automation logs
router.get('/:id/logs', getAutomationLogsController);

// Update email automation
router.put(
  '/:id',
  validateSchemaMiddleware(updateEmailAutomationSchema),
  updateEmailAutomationController
);

// Delete email automation
router.delete('/:id', deleteEmailAutomationController);

export default router;





