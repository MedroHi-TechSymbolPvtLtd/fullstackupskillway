import { Router } from 'express';
import {
  sendMessageController,
  sendBulkMessagesController,
  getMessageHistoryController,
  getMessageStatisticsController,
  getWhatsAppStatusController,
  testWhatsAppController,
} from '../controllers/whatsappController';
import { authenticate, requireAuth } from '../middlewares/auth';

const router = Router();

// All routes require authentication and admin/sales role
router.use(authenticate, requireAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     WhatsAppSendRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - message
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Phone number (7-15 digits)
 *           example: "919876543210"
 *         message:
 *           type: string
 *           description: Message content (max 4096 characters)
 *           example: "Hello from UpSkillWay!"
 *         firstName:
 *           type: string
 *           description: Contact first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: Contact last name
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email
 *           example: "john.doe@example.com"
 *         languageCode:
 *           type: string
 *           description: Language code (2 characters)
 *           example: "en"
 *         country:
 *           type: string
 *           description: Country code (2 characters)
 *           example: "IN"
 *         media:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [image, video, audio, document]
 *             url:
 *               type: string
 *               format: uri
 *             caption:
 *               type: string
 *     WhatsAppSendResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         messageId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [sent, delivered, read, failed]
 *         phoneNumber:
 *           type: string
 *         logId:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *     WhatsAppBulkSendRequest:
 *       type: object
 *       required:
 *         - messages
 *       properties:
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WhatsAppSendRequest'
 *           minItems: 1
 *           maxItems: 100
 *     WhatsAppBulkSendResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         totalMessages:
 *           type: integer
 *         successfulMessages:
 *           type: integer
 *         failedMessages:
 *           type: integer
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WhatsAppSendResult'
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               index:
 *                 type: integer
 *               phoneNumber:
 *                 type: string
 *               error:
 *                 type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *     WhatsAppMessageHistory:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         messages:
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
 *               phoneNumber:
 *                 type: string
 *               message:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [sent, delivered, read, failed]
 *               messageId:
 *                 type: string
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
 *     WhatsAppStatistics:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         statistics:
 *           type: object
 *           properties:
 *             totalMessages:
 *               type: integer
 *             sentMessages:
 *               type: integer
 *             deliveredMessages:
 *               type: integer
 *             failedMessages:
 *               type: integer
 *             todayMessages:
 *               type: integer
 *             thisWeekMessages:
 *               type: integer
 *             thisMonthMessages:
 *               type: integer
 *             successRate:
 *               type: number
 *         timestamp:
 *           type: string
 *           format: date-time
 *     WhatsAppStatus:
 *       type: object
 *       properties:
 *         apiStatus:
 *           type: string
 *         vendorUid:
 *           type: string
 *         phoneNumberId:
 *           type: string
 *         lastChecked:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/whatsapp/send:
 *   post:
 *     summary: Send WhatsApp message (Admin/Sales only)
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WhatsAppSendRequest'
 *     responses:
 *       200:
 *         description: WhatsApp message sent successfully
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
 *                   $ref: '#/components/schemas/WhatsAppSendResult'
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
router.post('/send', sendMessageController);

/**
 * @swagger
 * /api/v1/whatsapp/send-bulk:
 *   post:
 *     summary: Send bulk WhatsApp messages (Admin/Sales only)
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WhatsAppBulkSendRequest'
 *     responses:
 *       200:
 *         description: Bulk WhatsApp messages processed
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
 *                   $ref: '#/components/schemas/WhatsAppBulkSendResult'
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
router.post('/send-bulk', sendBulkMessagesController);

/**
 * @swagger
 * /api/v1/whatsapp/history:
 *   get:
 *     summary: Get WhatsApp message history (Admin/Sales only)
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Filter by phone number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [sent, delivered, read, failed]
 *         description: Filter by message status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter messages from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter messages until this date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of messages to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of messages to skip
 *     responses:
 *       200:
 *         description: WhatsApp message history retrieved successfully
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
 *                   $ref: '#/components/schemas/WhatsAppMessageHistory'
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
router.get('/history', getMessageHistoryController);

/**
 * @swagger
 * /api/v1/whatsapp/statistics:
 *   get:
 *     summary: Get WhatsApp message statistics (Admin/Sales only)
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: WhatsApp message statistics retrieved successfully
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
 *                   $ref: '#/components/schemas/WhatsAppStatistics'
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
router.get('/statistics', getMessageStatisticsController);

/**
 * @swagger
 * /api/v1/whatsapp/status:
 *   get:
 *     summary: Get WhatsApp API status (Admin/Sales only)
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: WhatsApp API status retrieved successfully
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
 *                   $ref: '#/components/schemas/WhatsAppStatus'
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
router.get('/status', getWhatsAppStatusController);

/**
 * @swagger
 * /api/v1/whatsapp/test:
 *   post:
 *     summary: Test WhatsApp functionality (Admin only)
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: WhatsApp test message sent successfully
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
 *                   $ref: '#/components/schemas/WhatsAppSendResult'
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
router.post('/test', testWhatsAppController);

export default router;
