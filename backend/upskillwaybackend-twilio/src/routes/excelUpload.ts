import { Router } from 'express';
import {
  uploadSingle,
  uploadExcelFileController,
  validateExcelFileController,
  getUploadHistoryController,
  getUploadStatisticsController,
  downloadExcelTemplateController,
  getExcelUploadConfigController,
  handleMulterError,
} from '../controllers/excelUploadController';
import { authenticate, requireAuth, requireRole } from '../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ExcelUploadResult:
 *       type: object
 *       properties:
 *         totalRows:
 *           type: integer
 *         validRows:
 *           type: integer
 *         insertedRows:
 *           type: integer
 *         skippedRows:
 *           type: integer
 *         errorRows:
 *           type: integer
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: integer
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *         duplicates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: integer
 *               email:
 *                 type: string
 *               reason:
 *                 type: string
 *         warnings:
 *           type: array
 *           items:
 *             type: string
 *     ExcelUploadConfig:
 *       type: object
 *       properties:
 *         skipDuplicates:
 *           type: boolean
 *           default: true
 *         updateExisting:
 *           type: boolean
 *           default: false
 *         validateEmails:
 *           type: boolean
 *           default: true
 *         validatePhones:
 *           type: boolean
 *           default: true
 *         maxRows:
 *           type: integer
 *           minimum: 1
 *           maximum: 10000
 *           default: 1000
 */

// All routes require authentication and admin role
router.use(authenticate, requireAuth, requireRole(['admin']));

/**
 * @swagger
 * /api/v1/excel-upload/upload:
 *   post:
 *     summary: Upload Excel file and process leads (Admin only)
 *     tags: [Excel Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               excelFile:
 *                 type: string
 *                 format: binary
 *                 description: Excel file (.xlsx or .xls)
 *               skipDuplicates:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 default: 'true'
 *                 description: Skip duplicate leads based on email
 *               updateExisting:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 default: 'false'
 *                 description: Update existing leads if found
 *               validateEmails:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 default: 'true'
 *                 description: Validate email formats
 *               validatePhones:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 default: 'true'
 *                 description: Validate phone number formats
 *               maxRows:
 *                 type: string
 *                 default: '1000'
 *                 description: Maximum number of rows to process
 *     responses:
 *       200:
 *         description: Excel file processed successfully
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
 *                   $ref: '#/components/schemas/ExcelUploadResult'
 *       400:
 *         description: Validation error or file processing error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       413:
 *         description: File too large
 */
router.post('/upload', uploadSingle, handleMulterError, uploadExcelFileController);

/**
 * @swagger
 * /api/v1/excel-upload/validate:
 *   post:
 *     summary: Validate Excel file without processing (Admin only)
 *     tags: [Excel Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               excelFile:
 *                 type: string
 *                 format: binary
 *                 description: Excel file (.xlsx or .xls)
 *     responses:
 *       200:
 *         description: Excel file validation completed
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
 *                     isValid:
 *                       type: boolean
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 *                     warnings:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post('/validate', uploadSingle, handleMulterError, validateExcelFileController);

/**
 * @swagger
 * /api/v1/excel-upload/template:
 *   get:
 *     summary: Download Excel template for lead upload (Admin only)
 *     tags: [Excel Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel template downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/template', downloadExcelTemplateController);

/**
 * @swagger
 * /api/v1/excel-upload/config:
 *   get:
 *     summary: Get Excel upload configuration (Admin only)
 *     tags: [Excel Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel upload configuration retrieved successfully
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
 *                   $ref: '#/components/schemas/ExcelUploadConfig'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/config', getExcelUploadConfigController);

/**
 * @swagger
 * /api/v1/excel-upload/history:
 *   get:
 *     summary: Get Excel upload history (Admin only)
 *     tags: [Excel Upload]
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
 *         description: Upload history retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/history', getUploadHistoryController);

/**
 * @swagger
 * /api/v1/excel-upload/statistics:
 *   get:
 *     summary: Get Excel upload statistics (Admin only)
 *     tags: [Excel Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upload statistics retrieved successfully
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
 *                     totalUploadedLeads:
 *                       type: integer
 *                     uploadedToday:
 *                       type: integer
 *                     uploadedThisWeek:
 *                       type: integer
 *                     uploadedThisMonth:
 *                       type: integer
 *                     leadsByStage:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           stage:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     leadsByStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     leadsByPriority:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           priority:
 *                             type: string
 *                           count:
 *                             type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/statistics', getUploadStatisticsController);

export default router;
