import { Router } from 'express';
import {
  createReferralPartnerController,
  createReferralTestimonialController,
  generateReferralCodeController,
  getReferralPartnersController,
  getReferralTestimonialsController,
} from '../controllers/referController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateQuery, validateSchemaMiddleware } from '../utils/validation';
import { publicRoute } from '../middleware/publicRoute';
import {
  referralPartnerSchema,
  referralTestimonialCreateSchema,
  referralTestimonialQuerySchema,
  referralCodeGenerateSchema,
} from '../validators/refer';

const router = Router();

// Public GET route — accessible without login
router.get('/partners', getReferralPartnersController);
// Public GET route — accessible without login
router.get('/testimonials', validateQuery(referralTestimonialQuerySchema), getReferralTestimonialsController);

router.use(publicRoute(authenticate, requireAdmin));

router.post('/partners', validateSchemaMiddleware(referralPartnerSchema), createReferralPartnerController);
router.post(
  '/testimonials',
  validateSchemaMiddleware(referralTestimonialCreateSchema),
  createReferralTestimonialController
);
router.post(
  '/generate-code',
  validateSchemaMiddleware(referralCodeGenerateSchema),
  generateReferralCodeController
);

export default router;

