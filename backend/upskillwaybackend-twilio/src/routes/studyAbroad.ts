import { Router } from 'express';
import {
  createStudyAbroadProgramController,
  createStudyAbroadFaqController,
  createStudyAbroadTestimonialController,
  deleteStudyAbroadProgramController,
  getStudyAbroadDestinationsController,
  getStudyAbroadFaqsController,
  getStudyAbroadProgramByIdController,
  getStudyAbroadTestimonialsController,
  updateStudyAbroadProgramController,
} from '../controllers/studyAbroadController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateQuery, validateSchemaMiddleware } from '../utils/validation';
import { studyAbroadSchema, updateStudyAbroadSchema } from '../validators/cms';
import {
  studyAbroadDestinationQuerySchema,
  studyAbroadFaqCreateSchema,
  studyAbroadTestimonialCreateSchema,
  studyAbroadTestimonialQuerySchema,
} from '../validators/studyAbroad';

const router = Router();

// Public GET route — accessible without login
router.get('/destinations', validateQuery(studyAbroadDestinationQuerySchema), getStudyAbroadDestinationsController);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(studyAbroadSchema),
  createStudyAbroadProgramController
);

// Public GET route — accessible without login
router.get('/faqs', getStudyAbroadFaqsController);

router.post(
  '/faqs',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(studyAbroadFaqCreateSchema),
  createStudyAbroadFaqController
);

// Public GET route — accessible without login
router.get(
  '/testimonials',
  validateQuery(studyAbroadTestimonialQuerySchema),
  getStudyAbroadTestimonialsController
);

router.post(
  '/testimonials',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(studyAbroadTestimonialCreateSchema),
  createStudyAbroadTestimonialController
);

// Public GET route — accessible without login
router.get('/:id', getStudyAbroadProgramByIdController);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateSchemaMiddleware(updateStudyAbroadSchema),
  updateStudyAbroadProgramController
);

router.delete('/:id', authenticate, requireAdmin, deleteStudyAbroadProgramController);

export default router;

