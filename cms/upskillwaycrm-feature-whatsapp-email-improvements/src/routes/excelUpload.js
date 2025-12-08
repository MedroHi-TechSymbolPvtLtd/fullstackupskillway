import express from 'express';
import excelUploadController from '../controllers/excelUploadController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ExcelUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             totalRows:
 *               type: integer
 *             validRows:
 *               type: integer
 *             insertedRows:
 *               type: integer
 *             updatedRows:
 *               type: integer
 *             skippedRows:
 *               type: integer
 *             errorRows:
 *               type: integer
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   row:
 *                     type: integer
 *                   field:
 *                     type: string
 *                   message:
 *                     type: string
 *             duplicates:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   row:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   reason:
 *                     type: string
 *             warnings:
 *               type: array
 *               items:
 *                 type: string
 *             processingTime:
 *               type: integer
 *     ExcelValidationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             isValid:
 *               type: boolean
 *             totalRows:
 *               type: integer
 *             validRows:
 *               type: integer
 *             errors:
 *               type: array
 *             warnings:
 *               type: array
 *             columnMapping:
 *               type: object
 *     ExcelConfigResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             maxFileSize:
 *               type: string
 *             allowedFormats:
 *               type: array
 *               items:
 *                 type: string
 *             maxRows:
 *               type: integer
 *             requiredColumns:
 *               type: array
 *               items:
 *                 type: string
 *             optionalColumns:
 *               type: array
 *               items:
 *                 type: string
 *             columnMapping:
 *               type: object
 *             validValues:
 *               type: object
 *     UploadHistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             hasNext:
 *               type: boolean
 *             hasPrev:
 *               type: boolean
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/excel-upload/upload:
 *   post:
 *     summary: Upload and process Excel file
 *     description: Upload an Excel file containing leads and process it for bulk import
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
 *                 description: Excel file (.xlsx or .xls) containing leads data
 *               skipDuplicates:
 *                 type: boolean
 *                 default: true
 *                 description: Skip duplicate leads (default: true)
 *               updateExisting:
 *                 type: boolean
 *                 default: false
 *                 description: Update existing leads (default: false)
 *               validateEmails:
 *                 type: boolean
 *                 default: true
 *                 description: Validate email formats (default: true)
 *               validatePhones:
 *                 type: boolean
 *                 default: true
 *                 description: Validate phone formats (default: true)
 *               maxRows:
 *                 type: integer
 *                 default: 1000
 *                 minimum: 1
 *                 maximum: 10000
 *                 description: Maximum rows to process (default: 1000)
 *     responses:
 *       200:
 *         description: Excel file processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExcelUploadResponse'
 *       400:
 *         description: Bad request - Invalid file or configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  '/upload',
  excelUploadController.upload.single('excelFile'),
  excelUploadController.handleMulterError,
  excelUploadController.uploadExcelFile
);

/**
 * @swagger
 * /api/v1/excel-upload/validate:
 *   post:
 *     summary: Validate Excel file
 *     description: Validate an Excel file without processing it
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
 *                 description: Excel file (.xlsx or .xls) to validate
 *     responses:
 *       200:
 *         description: Excel file validation completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExcelValidationResponse'
 *       400:
 *         description: Bad request - Invalid file
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  '/validate',
  excelUploadController.upload.single('excelFile'),
  excelUploadController.handleMulterError,
  excelUploadController.validateExcelFile
);

/**
 * @swagger
 * /api/v1/excel-upload/template:
 *   get:
 *     summary: Download Excel template
 *     description: Download a template Excel file with sample data and column headers
 *     tags: [Excel Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel template file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Attachment with filename
 *             schema:
 *               type: string
 *               example: attachment; filename="leads_template.xlsx"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/template', excelUploadController.downloadTemplate);

/**
 * @swagger
 * /api/v1/excel-upload/config:
 *   get:
 *     summary: Get Excel upload configuration
 *     description: Get the current Excel upload configuration including column mappings and valid values
 *     tags: [Excel Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel upload configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExcelConfigResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/config', excelUploadController.getUploadConfig);

/**
 * @swagger
 * /api/v1/excel-upload/history:
 *   get:
 *     summary: Get upload history
 *     description: Get the history of Excel uploads with pagination
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
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Upload history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadHistoryResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/history', excelUploadController.getUploadHistory);

/**
 * @swagger
 * /api/v1/excel-upload/stats:
 *   get:
 *     summary: Get upload statistics
 *     description: Get overall statistics about Excel uploads
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
 *                     totalUploads:
 *                       type: integer
 *                     totalRowsProcessed:
 *                       type: integer
 *                     totalLeadsCreated:
 *                       type: integer
 *                     totalLeadsUpdated:
 *                       type: integer
 *                     totalErrors:
 *                       type: integer
 *                     averageSuccessRate:
 *                       type: string
 *                     recentUploads:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fileName:
 *                             type: string
 *                           totalRows:
 *                             type: integer
 *                           successRate:
 *                             type: number
 *                           timestamp:
 *                             type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/stats', excelUploadController.getUploadStats);

export default router;
