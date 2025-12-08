import { Router } from 'express';
import {
  getAvailableTrainersController,
  assignTrainerToCollegeController,
  unassignTrainerFromCollegeController,
  getCollegeTrainerAssignmentsController,
  getCollegeWithTrainerController,
  getTrainerAssignmentStatsController,
  getTrainerAssignedCollegesController,
  getCollegeTrainerHistoryController,
} from '../controllers/collegeTrainerController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import { 
  assignTrainerToCollegeSchema, 
  unassignTrainerFromCollegeSchema,
  availableTrainersQuerySchema,
  collegeTrainerQuerySchema 
} from '../validators/collegeTrainer';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignTrainerToCollege:
 *       type: object
 *       required:
 *         - trainerId
 *       properties:
 *         trainerId:
 *           type: string
 *           format: uuid
 *         notes:
 *           type: string
 *           maxLength: 500
 *     UnassignTrainerFromCollege:
 *       type: object
 *       properties:
 *         notes:
 *           type: string
 *           maxLength: 500
 *     CollegeWithTrainer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         assignedTrainer:
 *           type: string
 *           format: uuid
 *         assignedTrainerDetails:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             specialization:
 *               type: array
 *               items:
 *                 type: string
 *             experience:
 *               type: integer
 *             rating:
 *               type: number
 *             location:
 *               type: string
 *         assignedTo:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 */

// All routes require authentication
router.use(authenticate, requireAuth);

/**
 * @swagger
 * /api/v1/college-trainers/available:
 *   get:
 *     summary: Get available trainers for assignment
 *     tags: [College-Trainer Assignment]
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
 *         name: specialization
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: experience
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Available trainers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/available', validateQuery(availableTrainersQuerySchema), getAvailableTrainersController);

/**
 * @swagger
 * /api/v1/college-trainers/assignments:
 *   get:
 *     summary: Get college trainer assignments
 *     tags: [College-Trainer Assignment]
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
 *         name: collegeId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: College trainer assignments retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/assignments', validateQuery(collegeTrainerQuerySchema), getCollegeTrainerAssignmentsController);

/**
 * @swagger
 * /api/v1/college-trainers/stats:
 *   get:
 *     summary: Get trainer assignment statistics
 *     tags: [College-Trainer Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trainer assignment statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', getTrainerAssignmentStatsController);

/**
 * @swagger
 * /api/v1/college-trainers/college/{id}:
 *   get:
 *     summary: Get college with assigned trainer details
 *     tags: [College-Trainer Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: College with trainer details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: College not found
 *   post:
 *     summary: Assign trainer to college
 *     tags: [College-Trainer Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignTrainerToCollege'
 *     responses:
 *       200:
 *         description: Trainer assigned to college successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: College or trainer not found
 *       409:
 *         description: Conflict - College already has trainer or trainer not available
 *   delete:
 *     summary: Unassign trainer from college
 *     tags: [College-Trainer Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnassignTrainerFromCollege'
 *     responses:
 *       200:
 *         description: Trainer unassigned from college successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: College not found
 */
router.get('/college/:id', getCollegeWithTrainerController);
router.post('/college/:id', validateSchemaMiddleware(assignTrainerToCollegeSchema), assignTrainerToCollegeController);
router.delete('/college/:id', validateSchemaMiddleware(unassignTrainerFromCollegeSchema), unassignTrainerFromCollegeController);

/**
 * @swagger
 * /api/v1/college-trainers/trainer/{id}/colleges:
 *   get:
 *     summary: Get trainer's assigned colleges
 *     tags: [College-Trainer Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *     responses:
 *       200:
 *         description: Trainer assigned colleges retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer not found
 */
router.get('/trainer/:id/colleges', getTrainerAssignedCollegesController);

/**
 * @swagger
 * /api/v1/college-trainers/college/{id}/history:
 *   get:
 *     summary: Get college's trainer assignment history
 *     tags: [College-Trainer Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *     responses:
 *       200:
 *         description: College trainer history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: College not found
 */
router.get('/college/:id/history', getCollegeTrainerHistoryController);

export default router;
