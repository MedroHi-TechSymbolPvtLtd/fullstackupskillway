import { Router } from 'express';
import {
  createCollegeController,
  getAllCollegesController,
  getCollegeByIdController,
  updateCollegeController,
  deleteCollegeController,
  getCollegeStatsController,
  getCollegesByStatusController,
} from '../controllers/collegeController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import { createCollegeSchema, updateCollegeSchema, collegeQuerySchema } from '../validators/college';

const router = Router();

// All college routes require authentication
router.use(authenticate, requireAuth);

/**
 * @swagger
 * /api/v1/colleges:
 *   get:
 *     summary: Get all colleges
 *     tags: [Colleges]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [UNIVERSITY, COLLEGE, INSTITUTE]
 *     responses:
 *       200:
 *         description: Colleges retrieved successfully
 *   post:
 *     summary: Create a new college
 *     tags: [Colleges]
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
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [UNIVERSITY, COLLEGE, INSTITUTE]
 *               ranking:
 *                 type: integer
 *               enrollment:
 *                 type: integer
 *               establishedYear:
 *                 type: integer
 *               contactPerson:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               website:
 *                 type: string
 *               totalRevenue:
 *                 type: number
 *               assignedToId:
 *                 type: string
 *     responses:
 *       201:
 *         description: College created successfully
 */

// College routes
router.get('/', validateQuery(collegeQuerySchema), getAllCollegesController);
router.post('/', validateSchemaMiddleware(createCollegeSchema), createCollegeController);
router.get('/stats', getCollegeStatsController);
router.get('/status/:status', getCollegesByStatusController);
router.get('/:id', getCollegeByIdController);
router.put('/:id', validateSchemaMiddleware(updateCollegeSchema), updateCollegeController);
router.delete('/:id', deleteCollegeController);

export default router;