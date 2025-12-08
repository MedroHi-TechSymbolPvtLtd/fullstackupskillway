import multer from 'multer';
import excelUploadService from '../services/excelUploadService.js';
import excelProcessingService from '../services/excelProcessingService.js';
import { uploadConfigSchema } from '../validators/excelUpload.js';

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

class ExcelUploadController {
  /**
   * Upload and process Excel file
   * POST /api/v1/excel-upload/upload
   */
  async uploadExcelFile(req, res) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No Excel file provided',
          error: 'Missing excelFile in request'
        });
      }

      // Validate upload configuration
      const configValidation = uploadConfigSchema.safeParse({
        skipDuplicates: req.body.skipDuplicates === 'true',
        updateExisting: req.body.updateExisting === 'true',
        validateEmails: req.body.validateEmails !== 'false',
        validatePhones: req.body.validatePhones !== 'false',
        maxRows: req.body.maxRows ? parseInt(req.body.maxRows) : 1000,
        batchSize: req.body.batchSize ? parseInt(req.body.batchSize) : 100
      });

      if (!configValidation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid upload configuration',
          error: configValidation.error.errors
        });
      }

      const options = configValidation.data;
      const user = req.user; // Assuming user is attached by auth middleware

      // Process the Excel file
      const result = await excelUploadService.uploadExcelFile(req.file, options, user);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          error: result.error,
          uploadId: result.uploadId
        });
      }
    } catch (error) {
      console.error('Excel upload controller error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Validate Excel file without processing
   * POST /api/v1/excel-upload/validate
   */
  async validateExcelFile(req, res) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No Excel file provided',
          error: 'Missing excelFile in request'
        });
      }

      // Process Excel file for validation only
      const result = await excelProcessingService.processExcelFile(req.file.buffer);

      if (result.success) {
        const { data } = result;
        
        return res.status(200).json({
          success: true,
          message: 'Excel file validation completed',
          data: {
            isValid: data.errors.length === 0,
            totalRows: data.totalRows,
            validRows: data.validRows,
            errors: data.errors,
            warnings: data.warnings,
            columnMapping: data.columnMapping
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Excel file validation failed',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Excel validation controller error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Download Excel template
   * GET /api/v1/excel-upload/template
   */
  async downloadTemplate(req, res) {
    try {
      // Generate Excel template
      const templateBuffer = excelProcessingService.generateTemplate();

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="leads_template.xlsx"');
      res.setHeader('Content-Length', templateBuffer.length);

      // Send the file
      res.send(templateBuffer);
    } catch (error) {
      console.error('Template download controller error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to generate template',
        error: error.message
      });
    }
  }

  /**
   * Get Excel upload configuration
   * GET /api/v1/excel-upload/config
   */
  async getUploadConfig(req, res) {
    try {
      const config = excelUploadService.getUploadConfig();

      return res.status(200).json({
        success: true,
        message: 'Excel upload configuration retrieved successfully',
        data: config
      });
    } catch (error) {
      console.error('Get upload config controller error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve upload configuration',
        error: error.message
      });
    }
  }

  /**
   * Get upload history
   * GET /api/v1/excel-upload/history
   */
  async getUploadHistory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const history = excelUploadService.getUploadHistory(options);

      return res.status(200).json({
        success: true,
        message: 'Upload history retrieved successfully',
        data: history.data,
        pagination: history.pagination
      });
    } catch (error) {
      console.error('Get upload history controller error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve upload history',
        error: error.message
      });
    }
  }

  /**
   * Get upload statistics
   * GET /api/v1/excel-upload/stats
   */
  async getUploadStats(req, res) {
    try {
      const history = excelUploadService.getUploadHistory({ page: 1, limit: 1000 });
      
      const stats = {
        totalUploads: history.pagination.total,
        totalRowsProcessed: history.data.reduce((sum, upload) => sum + upload.totalRows, 0),
        totalLeadsCreated: history.data.reduce((sum, upload) => sum + upload.insertedRows, 0),
        totalLeadsUpdated: history.data.reduce((sum, upload) => sum + upload.updatedRows, 0),
        totalErrors: history.data.reduce((sum, upload) => sum + upload.errorRows, 0),
        averageSuccessRate: history.data.length > 0 
          ? (history.data.reduce((sum, upload) => sum + upload.successRate, 0) / history.data.length).toFixed(2)
          : 0,
        recentUploads: history.data.slice(0, 5).map(upload => ({
          fileName: upload.fileName,
          totalRows: upload.totalRows,
          successRate: upload.successRate,
          timestamp: upload.timestamp
        }))
      };

      return res.status(200).json({
        success: true,
        message: 'Upload statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get upload stats controller error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve upload statistics',
        error: error.message
      });
    }
  }

  /**
   * Error handler for multer errors
   */
  handleMulterError(error, req, res, next) {
    if (error instanceof multer.MulterError) {
      switch (error.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({
            success: false,
            message: 'File too large',
            error: 'File size exceeds 10MB limit'
          });
        case 'LIMIT_FILE_COUNT':
          return res.status(400).json({
            success: false,
            message: 'Too many files',
            error: 'Only one file is allowed'
          });
        case 'LIMIT_UNEXPECTED_FILE':
          return res.status(400).json({
            success: false,
            message: 'Unexpected file field',
            error: 'Use "excelFile" as the field name'
          });
        default:
          return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: error.message
          });
      }
    }

    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type',
        error: error.message
      });
    }

    // Pass other errors to the default error handler
    next(error);
  }
}

export default new ExcelUploadController();
