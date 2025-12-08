import { Router } from 'express';
import {
  createEmailTemplateController,
  getAllEmailTemplatesController,
  getEmailTemplateByIdController,
  updateEmailTemplateController,
  deleteEmailTemplateController,
  getTemplatesByCategoryController,
} from '../controllers/emailTemplateController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
  emailTemplateQuerySchema,
} from '../validators/emailTemplate';

const router = Router();

// All routes require authentication
router.use(authenticate, requireAuth);

/**
 * Email Template Routes
 */

// Create email template
router.post(
  '/',
  validateSchemaMiddleware(createEmailTemplateSchema),
  createEmailTemplateController
);

// Get all email templates
router.get('/', validateQuery(emailTemplateQuerySchema), getAllEmailTemplatesController);

// Get templates by category
router.get('/category/:category', getTemplatesByCategoryController);

// Get email template by ID
router.get('/:id', getEmailTemplateByIdController);

// Update email template
router.put(
  '/:id',
  validateSchemaMiddleware(updateEmailTemplateSchema),
  updateEmailTemplateController
);

// Delete email template
router.delete('/:id', deleteEmailTemplateController);

export default router;





