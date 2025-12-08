import { Router } from 'express';
import {
  createTrainerController,
  getAllTrainersController,
  getTrainerByIdController,
  updateTrainerController,
  deleteTrainerController,
} from '../controllers/trainerController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import { createTrainerSchema, updateTrainerSchema, trainerQuerySchema } from '../validators/trainer';

const router = Router();

// All trainer routes require authentication
router.use(authenticate, requireAuth);

/**
 * @swagger
 * /api/v1/trainers:
 *   get:
 *     summary: Get all trainers
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, NOT_AVAILABLE, BOOKED, INACTIVE]
 *     responses:
 *       200:
 *         description: Trainers retrieved successfully
 *   post:
 *     summary: Create a new trainer
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: integer
 *               hourlyRate:
 *                 type: number
 *               bio:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               linkedinProfile:
 *                 type: string
 *               githubProfile:
 *                 type: string
 *               trainingMode:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [ONLINE, OFFLINE, HYBRID]
 *     responses:
 *       201:
 *         description: Trainer created successfully
 */

// Trainer routes
router.get('/', validateQuery(trainerQuerySchema), getAllTrainersController);
router.post('/', validateSchemaMiddleware(createTrainerSchema), createTrainerController);
router.get('/:id', getTrainerByIdController);
router.put('/:id', validateSchemaMiddleware(updateTrainerSchema), updateTrainerController);
router.delete('/:id', deleteTrainerController);

export default router;