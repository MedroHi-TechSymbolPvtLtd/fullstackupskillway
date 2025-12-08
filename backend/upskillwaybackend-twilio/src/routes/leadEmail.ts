import { Router } from 'express';
import {
  sendEmailToLeadController,
  sendEmailToAllLeadsController,
} from '../controllers/leadEmailController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware } from '../utils/validation';
import {
  sendEmailToLeadSchema,
  sendEmailToAllLeadsSchema,
} from '../validators/leadEmail';

const router = Router();

// All routes require authentication
router.use(authenticate, requireAuth);

/**
 * Lead Email Routes
 */

// Send email to a specific lead
router.post(
  '/send',
  validateSchemaMiddleware(sendEmailToLeadSchema),
  sendEmailToLeadController
);

// Send email to all leads
router.post(
  '/send-all',
  validateSchemaMiddleware(sendEmailToAllLeadsSchema),
  sendEmailToAllLeadsController
);

export default router;





