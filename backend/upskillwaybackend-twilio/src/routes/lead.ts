import { Router } from 'express';
import {
  createLeadController,
  getAllLeadsController,
  getLeadByIdController,
  updateLeadController,
  deleteLeadController,
  getLeadStatsController,
  updateLeadStatusController,
  assignLeadController,
} from '../controllers/leadController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { leadRateLimit } from '../middlewares/simpleRateLimiter';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import { 
  createLeadSchema, 
  updateLeadSchema, 
  updateLeadStatusSchema,
  assignLeadSchema,
  leadQuerySchema 
} from '../validators/lead';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         organization:
 *           type: string
 *         phone:
 *           type: string
 *         requirement:
 *           type: string
 *         source:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateLead:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         organization:
 *           type: string
 *         phone:
 *           type: string
 *         requirement:
 *           type: string
 *         source:
 *           type: string
 *     UpdateLead:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         organization:
 *           type: string
 *         phone:
 *           type: string
 *         requirement:
 *           type: string
 *         source:
 *           type: string
 *     LeadStats:
 *       type: object
 *       properties:
 *         totalLeads:
 *           type: integer
 *         leadsBySource:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               source:
 *                 type: string
 *               count:
 *                 type: integer
 *         recentLeads:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               organization:
 *                 type: string
 *               source:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 */

/**
 * @swagger
 * /api/v1/leads:
 *   get:
 *     summary: Get all leads (Admin only)
 *     tags: [Leads]
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
 *         name: source
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   post:
 *     summary: Create a new lead (Public form)
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLead'
 *     responses:
 *       201:
 *         description: Lead submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */
router.get('/', authenticate, requireAuth, validateQuery(leadQuerySchema), getAllLeadsController);
router.post('/', leadRateLimit, validateSchemaMiddleware(createLeadSchema), createLeadController);

/**
 * @swagger
 * /api/v1/leads/stats:
 *   get:
 *     summary: Get lead statistics (Admin only)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lead statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LeadStats'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/stats', authenticate, requireAuth, getLeadStatsController);

/**
 * @swagger
 * /api/v1/leads/{id}:
 *   get:
 *     summary: Get lead by ID (Admin only)
 *     tags: [Leads]
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
 *         description: Lead retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Lead not found
 *   put:
 *     summary: Update lead (Admin only)
 *     tags: [Leads]
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
 *             $ref: '#/components/schemas/UpdateLead'
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Lead not found
 *   delete:
 *     summary: Delete lead (Admin only)
 *     tags: [Leads]
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
 *         description: Lead deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Lead not found
 */
router.get('/:id', authenticate, requireAuth, getLeadByIdController);
router.put('/:id', authenticate, requireAuth, validateSchemaMiddleware(updateLeadSchema), updateLeadController);
router.delete('/:id', authenticate, requireAuth, deleteLeadController);

/**
 * @swagger
 * /api/v1/leads/{id}/status:
 *   patch:
 *     summary: Update lead status (Admin/Sales only)
 *     tags: [Leads]
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
 *             type: object
 *             required:
 *               - stage
 *             properties:
 *               stage:
 *                 type: string
 *                 enum: [START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, DENIED, CONVERT]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CONVERTED, DENIED, RECYCLED]
 *               notes:
 *                 type: string
 *               nextFollowUp:
 *                 type: string
 *                 format: date-time
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 * 
 * @swagger
 * /api/v1/leads/{id}/assign:
 *   patch:
 *     summary: Assign lead to user/college (Admin/Sales only)
 *     tags: [Leads]
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
 *             type: object
 *             required:
 *               - assignedToId
 *             properties:
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *               collegeId:
 *                 type: string
 *                 format: uuid
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead assigned successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */

// Lead status management routes
router.patch('/:id/status', authenticate, requireAuth, validateSchemaMiddleware(updateLeadStatusSchema), updateLeadStatusController);
router.patch('/:id/assign', authenticate, requireAuth, validateSchemaMiddleware(assignLeadSchema), assignLeadController);

export default router;
