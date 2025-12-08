import { Router } from 'express';
import {
  sendEmailController,
  sendBulkEmailsController,
  createCampaignController,
  sendCampaignController,
  getEmailHistoryController,
  getEmailStatisticsController,
  getQueueStatsController,
  testEmailController,
} from '../controllers/emailController';
import {
  handleEmailWebhookController,
  getWebhookStatsController,
} from '../controllers/emailWebhookController';
import { authenticate, requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

// All routes require authentication and admin/sales role
router.use(authenticate, requireAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailSendRequest:
 *       type: object
 *       required:
 *         - to
 *         - subject
 *         - html
 *       properties:
 *         to:
 *           type: string
 *           format: email
 *           description: Recipient email address
 *           example: "client@gmail.com"
 *         toName:
 *           type: string
 *           description: Recipient name
 *           example: "John Doe"
 *         subject:
 *           type: string
 *           description: Email subject
 *           example: "Welcome to UpSkillWay"
 *         html:
 *           type: string
 *           description: HTML content
 *           example: "<h1>Hello John</h1><p>Your account is ready!</p>"
 *         text:
 *           type: string
 *           description: Plain text content
 *           example: "Hello John\n\nYour account is ready!"
 *         from:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *         replyTo:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *         headers:
 *           type: object
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         transport:
 *           type: string
 *           enum: [api, smtp]
 *           default: api
 *         queue:
 *           type: boolean
 *           default: false
 *         delay:
 *           type: integer
 *           minimum: 0
 *     EmailSendResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         messageId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [sent, delivered, opened, clicked, bounced, failed, queued]
 *         method:
 *           type: string
 *           enum: [api, smtp, campaign]
 *         logId:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *     EmailBulkSendRequest:
 *       type: object
 *       required:
 *         - emails
 *       properties:
 *         emails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmailSendRequest'
 *           minItems: 1
 *           maxItems: 100
 *         transport:
 *           type: string
 *           enum: [api, smtp]
 *         queue:
 *           type: boolean
 *         delay:
 *           type: integer
 *     EmailBulkSendResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         totalEmails:
 *           type: integer
 *         successfulEmails:
 *           type: integer
 *         failedEmails:
 *           type: integer
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmailSendResult'
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               index:
 *                 type: integer
 *               to:
 *                 type: string
 *               error:
 *                 type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *     EmailCampaignRequest:
 *       type: object
 *       required:
 *         - name
 *         - subject
 *         - sender
 *         - htmlContent
 *       properties:
 *         name:
 *           type: string
 *           description: Campaign name
 *           example: "UpSkill Promo"
 *         subject:
 *           type: string
 *           description: Email subject
 *           example: "Grow with Us!"
 *         sender:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "UpSkillWay"
 *             email:
 *               type: string
 *               format: email
 *               example: "marketing@upskillway.com"
 *         htmlContent:
 *           type: string
 *           description: HTML content
 *           example: "<h1>Upgrade your skills</h1>"
 *         textContent:
 *           type: string
 *           description: Plain text content
 *         listIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [2, 7]
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-01T10:00:00Z"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         queue:
 *           type: boolean
 *         delay:
 *           type: integer
 *     EmailCampaignResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         campaignId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [created, scheduled, sent, queued, failed]
 *         logId:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *     EmailHistory:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         emails:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               userId:
 *                 type: string
 *               userRole:
 *                 type: string
 *                 enum: [admin, sales]
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [sent, delivered, opened, clicked, bounced, failed, queued]
 *               messageId:
 *                 type: string
 *               transport:
 *                 type: string
 *                 enum: [api, smtp]
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *         totalCount:
 *           type: integer
 *         hasMore:
 *           type: boolean
 *         timestamp:
 *           type: string
 *           format: date-time
 *     EmailStatistics:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         statistics:
 *           type: object
 *           properties:
 *             totalEmails:
 *               type: integer
 *             sentEmails:
 *               type: integer
 *             deliveredEmails:
 *               type: integer
 *             failedEmails:
 *               type: integer
 *             todayEmails:
 *               type: integer
 *             thisWeekEmails:
 *               type: integer
 *             thisMonthEmails:
 *               type: integer
 *             successRate:
 *               type: number
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/email/send:
 *   post:
 *     summary: Send transactional email (Admin/Sales only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailSendRequest'
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmailSendResult'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Sales role required
 *       500:
 *         description: Internal server error
 */
router.post('/send', sendEmailController);

// Alias: allow POST /api/v1/email for backward-compatibility
router.post('/', sendEmailController);

/**
 * @swagger
 * /api/v1/email/send-bulk:
 *   post:
 *     summary: Send bulk transactional emails (Admin/Sales only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailBulkSendRequest'
 *     responses:
 *       200:
 *         description: Bulk emails processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmailBulkSendResult'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Sales role required
 *       500:
 *         description: Internal server error
 */
router.post('/send-bulk', sendBulkEmailsController);

/**
 * @swagger
 * /api/v1/email/campaign/create:
 *   post:
 *     summary: Create email campaign (Admin only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailCampaignRequest'
 *     responses:
 *       200:
 *         description: Email campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmailCampaignResult'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/campaign/create', requireAdmin, createCampaignController);

/**
 * @swagger
 * /api/v1/email/campaign/send:
 *   post:
 *     summary: Send email campaign (Admin only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignId
 *             properties:
 *               campaignId:
 *                 type: integer
 *                 description: Campaign ID to send
 *                 example: 123
 *     responses:
 *       200:
 *         description: Email campaign sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmailSendResult'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/campaign/send', requireAdmin, sendCampaignController);

/**
 * @swagger
 * /api/v1/email/history:
 *   get:
 *     summary: Get email history (Admin/Sales only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: Filter by recipient email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [sent, delivered, opened, clicked, bounced, failed, queued]
 *         description: Filter by email status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter emails from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter emails until this date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of emails to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of emails to skip
 *     responses:
 *       200:
 *         description: Email history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmailHistory'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Sales role required
 *       500:
 *         description: Internal server error
 */
router.get('/history', getEmailHistoryController);

/**
 * @swagger
 * /api/v1/email/statistics:
 *   get:
 *     summary: Get email statistics (Admin/Sales only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmailStatistics'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Sales role required
 *       500:
 *         description: Internal server error
 */
router.get('/statistics', getEmailStatisticsController);

/**
 * @swagger
 * /api/v1/email/queue/stats:
 *   get:
 *     summary: Get email queue statistics (Admin/Sales only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     stats:
 *                       type: object
 *                       properties:
 *                         transactional:
 *                           type: object
 *                           properties:
 *                             waiting:
 *                               type: integer
 *                             active:
 *                               type: integer
 *                             completed:
 *                               type: integer
 *                             failed:
 *                               type: integer
 *                         campaign:
 *                           type: object
 *                           properties:
 *                             waiting:
 *                               type: integer
 *                             active:
 *                               type: integer
 *                             completed:
 *                               type: integer
 *                             failed:
 *                               type: integer
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/Sales role required
 *       500:
 *         description: Internal server error
 */
router.get('/queue/stats', getQueueStatsController);

/**
 * @swagger
 * /api/v1/email/test:
 *   post:
 *     summary: Test email functionality (Admin only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmailSendResult'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/test', requireAdmin, testEmailController);

// Webhook routes (no authentication required)
/**
 * @swagger
 * /api/v1/email/webhook:
 *   post:
 *     summary: Handle Brevo webhook events (Public)
 *     tags: [Email Webhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 enum: [delivered, opened, clicked, bounced, blocked, unsubscribed, spam]
 *               message-id:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid webhook data
 *       500:
 *         description: Internal server error
 */
router.post('/webhook', handleEmailWebhookController);

/**
 * @swagger
 * /api/v1/email/webhook/stats:
 *   get:
 *     summary: Get webhook statistics (Admin only)
 *     tags: [Email Webhook]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Webhook statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     stats:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/webhook/stats', requireAdmin, getWebhookStatsController);

export default router;
