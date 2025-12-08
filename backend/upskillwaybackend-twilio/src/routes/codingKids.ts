import { Router } from 'express';
import {
  createCodingKidsCourseController,
  createCodingKidsFaqController,
  createCodingKidsTestimonialController,
  getCodingKidsCoursesController,
  getCodingKidsFaqsController,
  getCodingKidsTestimonialsController,
} from '../controllers/codingKidsController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateQuery, validateSchemaMiddleware } from '../utils/validation';
import {
  codingKidsCourseCreateSchema,
  codingKidsCourseQuerySchema,
  codingKidsFaqCreateSchema,
  codingKidsFaqQuerySchema,
  codingKidsTestimonialCreateSchema,
  codingKidsTestimonialQuerySchema,
} from '../validators/codingKids';

const router = Router();

// Public GET route — accessible without login
router.get('/courses', validateQuery(codingKidsCourseQuerySchema), getCodingKidsCoursesController);

router.post(
  '/courses',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(codingKidsCourseCreateSchema),
  createCodingKidsCourseController
);

// Public GET route — accessible without login
router.get('/faqs', validateQuery(codingKidsFaqQuerySchema), getCodingKidsFaqsController);

router.post(
  '/faqs',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(codingKidsFaqCreateSchema),
  createCodingKidsFaqController
);

// Public GET route — accessible without login
router.get(
  '/testimonials',
  validateQuery(codingKidsTestimonialQuerySchema),
  getCodingKidsTestimonialsController
);

router.post(
  '/testimonials',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(codingKidsTestimonialCreateSchema),
  createCodingKidsTestimonialController
);

export default router;

