import { Router } from 'express';
import {
  updateLeadStageController,
  getLeadActivitiesController,
  getLeadsByStageController,
  getLeadFunnelStatsController,
  getMyAssignedLeadsController,
} from '../controllers/crmLeadController';
import {
  createLeadController,
  getAllLeadsController,
  getLeadByIdController,
  updateLeadController,
  deleteLeadController,
  getLeadStatsController,
} from '../controllers/leadController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import { updateCrmLeadSchema, crmLeadQuerySchema } from '../validators/crm';
import { createLeadSchema, updateLeadSchema } from '../validators/lead';
import { paginationSchema } from '../utils/validation';

const router = Router();

// All CRM routes require authentication
router.use(authenticate, requireAuth);

/**
 * @swagger
 * /api/v1/crm/leads/stage/{stage}:
 *   get:
 *     summary: Get leads by stage
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stage
 *         required: true
 *         schema:
 *           type: string
 *           enum: [NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST]
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
 *         description: Leads retrieved successfully
 */

/**
 * @swagger
 * /api/v1/crm/leads/{id}/stage:
 *   put:
 *     summary: Update lead stage
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stage:
 *                 type: string
 *                 enum: [NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead stage updated successfully
 */

// Basic Lead CRUD routes
router.get('/leads', validateQuery(paginationSchema), getAllLeadsController);
router.post('/leads', validateSchemaMiddleware(createLeadSchema), createLeadController);
router.get('/leads/stats', getLeadStatsController);
router.get('/leads/:id', getLeadByIdController);
router.put('/leads/:id', validateSchemaMiddleware(updateLeadSchema), updateLeadController);
router.delete('/leads/:id', deleteLeadController);

// CRM Lead routes
router.get('/leads/stage/:stage', validateQuery(crmLeadQuerySchema), getLeadsByStageController);
router.put('/leads/:id/stage', validateSchemaMiddleware(updateCrmLeadSchema), updateLeadStageController);
router.get('/leads/:id/activities', validateQuery(crmLeadQuerySchema), getLeadActivitiesController);
router.get('/leads/funnel/stats', getLeadFunnelStatsController);
router.get('/my-leads', validateQuery(crmLeadQuerySchema), getMyAssignedLeadsController);

export default router;