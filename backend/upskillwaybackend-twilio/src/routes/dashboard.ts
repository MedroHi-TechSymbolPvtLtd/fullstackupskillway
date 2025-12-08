import { Router } from 'express';
import {
  getDashboardStatsController,
  getRecentActivitiesController,
  getLeadFunnelController,
  getMonthlyTrendsController,
  getPerformanceMetricsController,
  getLeadsByDashboardStagesController,
  getConvertedLeadsWithCollegesController,
} from '../controllers/dashboardController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateQuery } from '../utils/validation';
import { z } from 'zod';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate, requireAuth);

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DashboardStats'
 */

/**
 * @swagger
 * /api/v1/dashboard/activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 */

/**
 * @swagger
 * /api/v1/dashboard/funnel:
 *   get:
 *     summary: Get lead funnel data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lead funnel data retrieved successfully
 */

/**
 * @swagger
 * /api/v1/dashboard/trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           default: 6
 *     responses:
 *       200:
 *         description: Monthly trends retrieved successfully
 */

/**
 * @swagger
 * /api/v1/dashboard/metrics:
 *   get:
 *     summary: Get performance metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 */

// Dashboard routes
router.get('/stats', getDashboardStatsController);
router.get('/activities', getRecentActivitiesController);
router.get('/funnel', getLeadFunnelController);
router.get('/trends', getMonthlyTrendsController);
router.get('/metrics', getPerformanceMetricsController);

/**
 * @swagger
 * /api/v1/dashboard/leads-by-stages:
 *   get:
 *     summary: Get leads grouped by dashboard stages (START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, CONVERT, DENIED)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leads by dashboard stages retrieved successfully
 */
router.get('/leads-by-stages', getLeadsByDashboardStagesController);

/**
 * @swagger
 * /api/v1/dashboard/converted-leads:
 *   get:
 *     summary: Get converted leads with their associated colleges
 *     tags: [Dashboard]
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
 *     responses:
 *       200:
 *         description: Converted leads with colleges retrieved successfully
 */
router.get('/converted-leads', validateQuery(z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
})), getConvertedLeadsWithCollegesController);

export default router;