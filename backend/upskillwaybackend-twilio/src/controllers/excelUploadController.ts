import { Request, Response } from 'express';
import multer from 'multer';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import { BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import {
  uploadLeadsFromExcel,
  getUploadHistory,
  getUploadStatistics,
  validateExcelFile,
} from '../services/excelUploadService';
import { ExcelUploadConfigInput } from '../validators/excelUpload';

/**
 * Excel upload controller
 * Handles Excel file uploads for bulk lead import (Admin only)
 */

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Only Excel files (.xlsx, .xls) are allowed'));
    }
  },
});

// Middleware for single file upload
export const uploadSingle = upload.single('excelFile');

// Upload Excel file and process leads
export const uploadExcelFileController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('No Excel file provided');
  }
  
  const uploadedBy = req.user!.id;
  const config: ExcelUploadConfigInput = {
    skipDuplicates: req.body.skipDuplicates === 'true',
    updateExisting: req.body.updateExisting === 'true',
    validateEmails: req.body.validateEmails !== 'false',
    validatePhones: req.body.validatePhones !== 'false',
    maxRows: parseInt(req.body.maxRows) || 1000,
  };
  
  logger.info(`Excel upload started by user: ${uploadedBy}, file: ${req.file.originalname}`);
  
  // Validate file before processing
  const validation = await validateExcelFile(req.file.buffer, req.file.originalname);
  if (!validation.isValid) {
    throw new BadRequestError(`File validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Process Excel file
  const result = await uploadLeadsFromExcel(
    req.file.buffer,
    req.file.originalname,
    uploadedBy,
    config
  );
  
  // Add warnings to result if any
  const response = {
    ...result,
    warnings: validation.warnings,
  };
  
  logger.info(`Excel upload completed: ${req.file.originalname} - Inserted: ${result.insertedRows}, Skipped: ${result.skippedRows}`);
  
  sendSuccess(res, response, 'Excel file processed successfully');
});

// Validate Excel file without processing
export const validateExcelFileController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('No Excel file provided');
  }
  
  const validation = await validateExcelFile(req.file.buffer, req.file.originalname);
  
  sendSuccess(res, validation, 'Excel file validation completed');
});

// Get upload history
export const getUploadHistoryController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const result = await getUploadHistory(page, limit);
  
  sendPaginated(res, result.leads, result.pagination, 'Upload history retrieved successfully');
});

// Get upload statistics
export const getUploadStatisticsController = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getUploadStatistics();
  
  sendSuccess(res, stats, 'Upload statistics retrieved successfully');
});

// Download Excel template
export const downloadExcelTemplateController = asyncHandler(async (req: Request, res: Response) => {
  const templateData = [
    ['name', 'email', 'phone', 'organization', 'requirement', 'source', 'stage', 'status', 'priority', 'notes', 'value'],
    ['John Doe', 'john.doe@example.com', '+1234567890', 'ABC Company', 'Need JavaScript training', 'Website', 'LEAD_GENERATED', 'NEW', 'MEDIUM', 'Interested in React', '5000'],
    ['Jane Smith', 'jane.smith@example.com', '+1987654321', 'XYZ Corp', 'Python development course', 'Referral', 'START', 'ACTIVE', 'HIGH', 'Urgent requirement', '8000'],
  ];
  
  const XLSX = require('xlsx');
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Template');
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="leads_template.xlsx"');
  res.send(buffer);
});

// Get Excel upload configuration
export const getExcelUploadConfigController = asyncHandler(async (req: Request, res: Response) => {
  const config = {
    maxFileSize: '10MB',
    allowedFormats: ['.xlsx', '.xls'],
    maxRows: 1000,
    requiredColumns: ['name', 'email', 'phone'],
    optionalColumns: ['organization', 'requirement', 'source', 'stage', 'status', 'priority', 'notes', 'value'],
    columnMapping: {
      name: ['name', 'full_name', 'fullname', 'contact_name', 'contact name'],
      email: ['email', 'email_address', 'emailaddress', 'e_mail'],
      phone: ['phone', 'phone_number', 'phonenumber', 'mobile', 'contact_number', 'contact number'],
      organization: ['organization', 'company', 'institution', 'org'],
      requirement: ['requirement', 'needs', 'description', 'requirements'],
      source: ['source', 'lead_source', 'leadsource', 'origin'],
      stage: ['stage', 'lead_stage', 'leadstage', 'status_stage'],
      status: ['status', 'lead_status', 'leadstatus'],
      priority: ['priority', 'urgency', 'importance'],
      notes: ['notes', 'comments', 'remarks', 'additional_info'],
      value: ['value', 'amount', 'budget', 'estimated_value'],
    },
    validValues: {
      stage: ['LEAD_GENERATED', 'START', 'PENDING', 'IN_PROGRESS', 'CONVERTED', 'DENIED'],
      status: ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST', 'CONVERTED'],
      priority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    },
  };
  
  sendSuccess(res, config, 'Excel upload configuration retrieved successfully');
});

// Error handler for multer errors
export const handleMulterError = (error: any, req: Request, res: Response, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 10MB limit',
        timestamp: new Date().toISOString(),
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Only one file is allowed',
        timestamp: new Date().toISOString(),
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field. Please use "excelFile" as the field name for file upload.',
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  if (error.message.includes('Only Excel files')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
  
  return next(error);
};
