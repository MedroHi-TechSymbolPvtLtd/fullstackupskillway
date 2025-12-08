import { Router } from 'express';
import { loadImageFromUrlController } from '../controllers/assetController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateSchemaMiddleware } from '../utils/validation';
import { loadImageFromUrlSchema } from '../validators/assets';

const router = Router();

router.post(
  '/load-image-from-url',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(loadImageFromUrlSchema),
  loadImageFromUrlController
);

export default router;

