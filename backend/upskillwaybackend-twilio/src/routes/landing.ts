import { Router } from 'express';
import {
  createLandingCertifiedProgramController,
  getLandingCertifiedProgramsController,
} from '../controllers/landingController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateSchemaMiddleware } from '../utils/validation';
import { landingCertifiedProgramCreateSchema } from '../validators/landing';

const router = Router();

// Public GET route — accessible without login
router.get('/certified-programs', getLandingCertifiedProgramsController);

router.post(
  '/certified-programs',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(landingCertifiedProgramCreateSchema),
  createLandingCertifiedProgramController
);

export default router;

