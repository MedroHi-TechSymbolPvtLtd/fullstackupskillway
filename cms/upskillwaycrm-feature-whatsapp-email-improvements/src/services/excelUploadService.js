import excelProcessingService from './excelProcessingService.js';
import { leadsApi } from '../services/api/apiConfig.js';

class ExcelUploadService {
  constructor() {
    this.batchSize = 100;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Upload and process Excel file
   * @param {Object} file - Multer file object
   * @param {Object} options - Upload options
   * @param {Object} user - User information
   * @returns {Object} Upload results
   */
  async uploadExcelFile(file, options = {}, user = null) {
    const startTime = Date.now();
    const uploadId = this.generateUploadId();
    
    try {
      // Validate file
      this.validateFile(file);

      // Process Excel file
      const processingResult = await excelProcessingService.processExcelFile(
        file.buffer, 
        options
      );

      if (!processingResult.success) {
        return {
          success: false,
          message: 'Excel file processing failed',
          error: processingResult.error,
          uploadId,
          processingTime: Date.now() - startTime
        };
      }

      const { data } = processingResult;
      const { transformedRows, errors, warnings } = data;

      // Get existing leads for duplicate detection
      const existingLeads = await this.getExistingLeads(transformedRows);

      // Detect duplicates
      const { duplicates, uniqueLeads } = excelProcessingService.detectDuplicates(
        transformedRows, 
        existingLeads
      );

      // Process leads based on options
      const processResult = await this.processLeads(
        uniqueLeads, 
        duplicates, 
        options, 
        user
      );

      // Calculate final statistics
      const stats = this.calculateUploadStats(
        data.totalRows,
        uniqueLeads.length,
        duplicates.length,
        processResult.inserted,
        processResult.updated,
        processResult.failed,
        errors.length
      );

      // Log upload history
      await this.logUploadHistory({
        uploadId,
        fileName: file.originalname,
        fileSize: file.size,
        totalRows: data.totalRows,
        validRows: uniqueLeads.length,
        insertedRows: processResult.inserted,
        updatedRows: processResult.updated,
        skippedRows: duplicates.length,
        errorRows: errors.length + processResult.failed,
        processingTime: Date.now() - startTime,
        userId: user?.id,
        options
      });

      return {
        success: true,
        message: 'Excel file processed successfully',
        uploadId,
        data: {
          ...stats,
          errors: [...errors, ...processResult.errors],
          duplicates: duplicates.map(dup => ({
            row: dup.row,
            email: dup.email,
            reason: dup.reason
          })),
          warnings,
          processingTime: Date.now() - startTime
        }
      };

    } catch (error) {
      console.error('Excel upload error:', error);
      
      return {
        success: false,
        message: 'Excel upload failed',
        error: error.message,
        uploadId,
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Validate Excel file
   * @param {Object} file - Multer file object
   */
  validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Check file extension
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.originalname.toLowerCase().substring(
      file.originalname.lastIndexOf('.')
    );
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error('Invalid file extension. Only .xlsx and .xls files are allowed.');
    }
  }

  /**
   * Get existing leads for duplicate detection
   * @param {Array} leads - Array of leads to check
   * @returns {Array} Existing leads
   */
  async getExistingLeads(leads) {
    try {
      const emails = leads.map(lead => lead.email).filter(Boolean);
      
      if (emails.length === 0) {
        return [];
      }

      // Get existing leads by email addresses
      const response = await leadsApi.get('/leads', {
        params: {
          emails: emails.join(','),
          limit: 10000
        }
      });

      return response.data?.data || [];
    } catch (error) {
      console.warn('Failed to fetch existing leads for duplicate detection:', error.message);
      return [];
    }
  }

  /**
   * Process leads in batches
   * @param {Array} leads - Array of leads to process
   * @param {Array} duplicates - Array of duplicate leads
   * @param {Object} options - Processing options
   * @param {Object} user - User information
   * @returns {Object} Processing results
   */
  async processLeads(leads, duplicates, options = {}, user = null) {
    const {
      skipDuplicates = true,
      updateExisting = false,
      batchSize = this.batchSize
    } = options;

    let inserted = 0;
    let updated = 0;
    let failed = 0;
    const errors = [];

    // Process leads in batches
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      
      try {
        const batchResult = await this.processBatch(batch, options, user);
        
        inserted += batchResult.inserted;
        updated += batchResult.updated;
        failed += batchResult.failed;
        errors.push(...batchResult.errors);

        // Add small delay between batches to avoid overwhelming the API
        if (i + batchSize < leads.length) {
          await this.delay(100);
        }
      } catch (error) {
        console.error(`Batch processing error (batch ${Math.floor(i / batchSize) + 1}):`, error);
        
        // Mark entire batch as failed
        failed += batch.length;
        errors.push({
          batch: Math.floor(i / batchSize) + 1,
          message: `Batch processing failed: ${error.message}`,
          affectedRows: batch.map(lead => lead._rowIndex)
        });
      }
    }

    return {
      inserted,
      updated,
      failed,
      errors
    };
  }

  /**
   * Process a batch of leads
   * @param {Array} batch - Batch of leads
   * @param {Object} options - Processing options
   * @param {Object} user - User information
   * @returns {Object} Batch processing results
   */
  async processBatch(batch, options = {}, user = null) {
    const { updateExisting = false } = options;
    let inserted = 0;
    let updated = 0;
    let failed = 0;
    const errors = [];

    for (const lead of batch) {
      try {
        // Prepare lead data
        const leadData = this.prepareLeadData(lead, user);

        // Check if lead exists
        const existingLead = await this.findExistingLead(lead.email);
        
        if (existingLead) {
          if (updateExisting) {
            // Update existing lead
            await this.updateLead(existingLead.id, leadData);
            updated++;
          } else {
            // Skip duplicate
            failed++;
            errors.push({
              row: lead._rowIndex,
              email: lead.email,
              message: 'Lead already exists and updateExisting is false'
            });
          }
        } else {
          // Create new lead
          await this.createLead(leadData);
          inserted++;
        }
      } catch (error) {
        failed++;
        errors.push({
          row: lead._rowIndex,
          email: lead.email,
          message: error.message
        });
      }
    }

    return {
      inserted,
      updated,
      failed,
      errors
    };
  }

  /**
   * Prepare lead data for API
   * @param {Object} lead - Lead object
   * @param {Object} user - User information
   * @returns {Object} Prepared lead data
   */
  prepareLeadData(lead, user = null) {
    return {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      organization: lead.organization || null,
      requirement: lead.requirement || null,
      source: lead.source || 'Excel Upload',
      stage: lead.stage || 'START',
      status: lead.status || 'NEW',
      priority: lead.priority || 'MEDIUM',
      notes: lead.notes || null,
      value: lead.value || null,
      assignedTo: user?.id || null,
      createdBy: user?.id || null
    };
  }

  /**
   * Find existing lead by email
   * @param {string} email - Email address
   * @returns {Object|null} Existing lead or null
   */
  async findExistingLead(email) {
    try {
      const response = await leadsApi.get('/leads', {
        params: {
          email: email,
          limit: 1
        }
      });

      const leads = response.data?.data || [];
      return leads.length > 0 ? leads[0] : null;
    } catch (error) {
      console.warn(`Failed to find existing lead for email ${email}:`, error.message);
      return null;
    }
  }

  /**
   * Create new lead
   * @param {Object} leadData - Lead data
   * @returns {Object} Created lead
   */
  async createLead(leadData) {
    try {
      const response = await leadsApi.post('/leads', leadData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create lead: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Update existing lead
   * @param {string} leadId - Lead ID
   * @param {Object} leadData - Updated lead data
   * @returns {Object} Updated lead
   */
  async updateLead(leadId, leadData) {
    try {
      const response = await leadsApi.put(`/leads/${leadId}`, leadData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update lead: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Calculate upload statistics
   * @param {number} totalRows - Total rows in file
   * @param {number} validRows - Valid rows processed
   * @param {number} duplicateRows - Duplicate rows found
   * @param {number} insertedRows - Successfully inserted rows
   * @param {number} updatedRows - Successfully updated rows
   * @param {number} failedRows - Failed rows
   * @param {number} errorRows - Rows with validation errors
   * @returns {Object} Statistics object
   */
  calculateUploadStats(totalRows, validRows, duplicateRows, insertedRows, updatedRows, failedRows, errorRows) {
    const processedRows = insertedRows + updatedRows;
    const skippedRows = duplicateRows + failedRows;
    const successRate = totalRows > 0 ? ((processedRows / totalRows) * 100).toFixed(2) : 0;

    return {
      totalRows,
      validRows,
      insertedRows,
      updatedRows,
      skippedRows,
      errorRows,
      processedRows,
      successRate: parseFloat(successRate)
    };
  }

  /**
   * Log upload history
   * @param {Object} historyData - Upload history data
   */
  async logUploadHistory(historyData) {
    try {
      // Store upload history in localStorage for now
      // In a real application, this would be stored in a database
      const history = JSON.parse(localStorage.getItem('excel_upload_history') || '[]');
      history.unshift({
        ...historyData,
        timestamp: new Date().toISOString()
      });

      // Keep only last 100 uploads
      if (history.length > 100) {
        history.splice(100);
      }

      localStorage.setItem('excel_upload_history', JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to log upload history:', error.message);
    }
  }

  /**
   * Get upload history
   * @param {Object} options - Query options
   * @returns {Object} Upload history with pagination
   */
  getUploadHistory(options = {}) {
    const { page = 1, limit = 10 } = options;
    
    try {
      const history = JSON.parse(localStorage.getItem('excel_upload_history') || '[]');
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedHistory = history.slice(startIndex, endIndex);
      
      return {
        data: paginatedHistory,
        pagination: {
          page,
          limit,
          total: history.length,
          totalPages: Math.ceil(history.length / limit),
          hasNext: endIndex < history.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.warn('Failed to get upload history:', error.message);
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  }

  /**
   * Generate unique upload ID
   * @returns {string} Upload ID
   */
  generateUploadId() {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay execution
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get upload configuration
   * @returns {Object} Upload configuration
   */
  getUploadConfig() {
    return {
      maxFileSize: '10MB',
      allowedFormats: ['.xlsx', '.xls'],
      maxRows: 1000,
      requiredColumns: ['name', 'email', 'phone'],
      optionalColumns: [
        'organization', 'requirement', 'source', 'stage', 
        'status', 'priority', 'notes', 'value'
      ],
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
        value: ['value', 'amount', 'budget', 'estimated_value']
      },
      validValues: {
        stage: [
          'START', 'IN_CONVERSATION', 'EMAIL_WHATSAPP', 'IN_PROGRESS', 'DENIED', 'CONVERT'
        ],
        status: [
          'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL',
          'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST', 'CONVERTED'
        ],
        priority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
      }
    };
  }
}

export default new ExcelUploadService();
