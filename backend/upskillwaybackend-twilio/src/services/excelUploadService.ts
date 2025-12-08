import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { ConflictError, BadRequestError } from '../utils/errors';
import {
  ExcelLeadRowInput,
  ExcelUploadConfigInput,
  ExcelUploadResult
} from '../validators/excelUpload';
import { processExcelFile } from './excelProcessingService';

/**
 * Bulk lead upload service
 * Handles bulk insertion of leads from Excel files with transaction management
 */

// Upload leads from Excel file
export const uploadLeadsFromExcel = async (
  fileBuffer: Buffer,
  filename: string,
  uploadedBy: string,
  config: ExcelUploadConfigInput = {
    skipDuplicates: true,
    updateExisting: false,
    validateEmails: true,
    validatePhones: true,
    maxRows: 1000,
  }
): Promise<ExcelUploadResult> => {
  try {
    logger.info(`Starting Excel upload: ${filename} by user: ${uploadedBy}`);

    // Process Excel file
    const processResult = await processExcelFile(fileBuffer, filename, config);

    const { validLeads, errors, duplicates, totalRows } = processResult;

    if (validLeads.length === 0) {
      return {
        totalRows,
        validRows: 0,
        insertedRows: 0,
        skippedRows: totalRows,
        errorRows: errors.length,
        errors,
        duplicates,
      };
    }

    // Insert leads in batches using transaction
    const insertResult = await insertLeadsInBatches(validLeads, uploadedBy, config);

    // Trigger WhatsApp for inserted leads
    if (insertResult.insertedLeads.length > 0) {
      try {
        const whatsappService = (await import('./whatsappService')).whatsappService;
        // Filter leads with phone numbers
        const leadsWithPhone = insertResult.insertedLeads.filter(l => l.phone);

        if (leadsWithPhone.length > 0) {
          const messages = leadsWithPhone.map(lead => ({
            phoneNumber: lead.phone,
            message: `Welcome message to ${lead.name}`,
            contentSid: process.env.TWILIO_TEMPLATE_WELCOME,
            contentVariables: {
              '1': lead.name || 'there'
            },
            firstName: lead.name?.split(' ')[0] || '',
            lastName: lead.name?.split(' ').slice(1).join(' ') || '',
            email: lead.email,
            languageCode: 'en',
            country: 'IN',
          }));

          // Find admin user
          const adminUser = await prisma.user.findFirst({ where: { role: 'admin', isActive: true } });
          if (adminUser) {
            await whatsappService.sendBulkMessages(messages, adminUser.id, 'admin');
          }
        }
      } catch (e) {
        logger.error('Failed to send bulk WhatsApp welcome messages', e);
      }
    }

    const result: ExcelUploadResult = {
      totalRows,
      validRows: validLeads.length,
      insertedRows: insertResult.insertedCount,
      skippedRows: duplicates.length + insertResult.skippedCount,
      errorRows: errors.length + insertResult.errorCount,
      errors: [...errors, ...insertResult.errors],
      duplicates,
    };

    logger.info(`Excel upload completed: ${filename} - Inserted: ${result.insertedRows}, Skipped: ${result.skippedRows}, Errors: ${result.errorRows}`);

    return result;
  } catch (error) {
    logger.error(`Excel upload failed: ${filename}`, error);
    throw error;
  }
};

// Insert leads in batches with transaction management
const insertLeadsInBatches = async (
  leads: ExcelLeadRowInput[],
  uploadedBy: string,
  config: ExcelUploadConfigInput
): Promise<{
  insertedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: Array<{ row: number; field: string; message: string }>;
  insertedLeads: any[];
}> => {
  const batchSize = 100; // Process in batches of 100
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const errors: Array<{ row: number; field: string; message: string }> = [];
  const insertedLeads: any[] = [];

  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);

    try {
      const batchResult = await prisma.$transaction(async (tx) => {
        const batchInserted = await insertBatchLeads(tx, batch, uploadedBy, config);
        return batchInserted;
      });

      insertedCount += batchResult.length;
      insertedLeads.push(...batchResult);
    } catch (error) {
      logger.error(`Batch insert failed for batch ${Math.floor(i / batchSize) + 1}`, error);

      // Try individual inserts for this batch
      for (let j = 0; j < batch.length; j++) {
        try {
          const newLead = await prisma.lead.create({
            data: {
              ...batch[j],
              assignedToId: null, // Excel uploads are unassigned by default
              collegeId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          insertedCount++;
          insertedLeads.push(newLead);
        } catch (individualError) {
          errorCount++;
          errors.push({
            row: i + j + 2, // +2 for Excel row numbering (header + 1-based)
            field: 'general',
            message: individualError instanceof Error ? individualError.message : 'Unknown error'
          });
        }
      }
    }
  }

  return {
    insertedCount,
    skippedCount,
    errorCount,
    errors,
    insertedLeads,
  };
};

// Insert a batch of leads
const insertBatchLeads = async (
  tx: any,
  leads: ExcelLeadRowInput[],
  uploadedBy: string,
  config: ExcelUploadConfigInput
): Promise<any[]> => {
  const insertedLeads: any[] = [];

  for (const lead of leads) {
    try {
      // Check for duplicates if updateExisting is false
      if (!config.updateExisting) {
        const existingLead = await tx.lead.findUnique({
          where: { email: lead.email }
        });

        if (existingLead) {
          continue; // Skip duplicate
        }
      }

      // Create lead
      const newLead = await tx.lead.create({
        data: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          organization: lead.organization || '',
          requirement: lead.requirement || '',
          source: lead.source || 'Excel Upload',
          stage: lead.stage || 'LEAD_GENERATED',
          status: lead.status || 'NEW',
          priority: lead.priority || 'MEDIUM',
          notes: lead.notes || '',
          value: lead.value || 0,
          assignedToId: null,
          collegeId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      insertedLeads.push(newLead);
    } catch (error) {
      logger.error(`Failed to insert lead: ${lead.email}`, error);
      throw error;
    }
  }

  return insertedLeads;
};

// Get upload history for admin
export const getUploadHistory = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;

    // Get leads uploaded via Excel (source = 'Excel Upload')
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: {
          source: 'Excel Upload',
        },
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          college: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({
        where: {
          source: 'Excel Upload',
        },
      }),
    ]);

    return {
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Get upload history failed', error);
    throw error;
  }
};

// Get upload statistics
export const getUploadStatistics = async () => {
  try {
    const [
      totalUploadedLeads,
      uploadedToday,
      uploadedThisWeek,
      uploadedThisMonth,
      leadsByStage,
      leadsByStatus,
      leadsByPriority,
    ] = await Promise.all([
      prisma.lead.count({
        where: { source: 'Excel Upload' },
      }),
      prisma.lead.count({
        where: {
          source: 'Excel Upload',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.lead.count({
        where: {
          source: 'Excel Upload',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.lead.count({
        where: {
          source: 'Excel Upload',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.lead.groupBy({
        by: ['stage'],
        where: { source: 'Excel Upload' },
        _count: true,
        orderBy: { _count: { stage: 'desc' } },
      }),
      prisma.lead.groupBy({
        by: ['status'],
        where: { source: 'Excel Upload' },
        _count: true,
        orderBy: { _count: { status: 'desc' } },
      }),
      prisma.lead.groupBy({
        by: ['priority'],
        where: { source: 'Excel Upload' },
        _count: true,
        orderBy: { _count: { priority: 'desc' } },
      }),
    ]);

    return {
      totalUploadedLeads,
      uploadedToday,
      uploadedThisWeek,
      uploadedThisMonth,
      leadsByStage: leadsByStage.map(item => ({
        stage: item.stage,
        count: item._count,
      })),
      leadsByStatus: leadsByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
      leadsByPriority: leadsByPriority.map(item => ({
        priority: item.priority,
        count: item._count,
      })),
    };
  } catch (error) {
    logger.error('Get upload statistics failed', error);
    throw error;
  }
};

// Validate Excel file before processing
export const validateExcelFile = async (fileBuffer: Buffer, filename: string): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> => {
  try {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file size
    if (fileBuffer.length > 10 * 1024 * 1024) {
      errors.push('File size exceeds 10MB limit');
    }

    // Check file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      errors.push('File must be an Excel file (.xlsx or .xls)');
    }

    // Try to parse the file
    try {
      const parseResult = await processExcelFile(fileBuffer, filename, {
        skipDuplicates: true,
        updateExisting: false,
        validateEmails: true,
        validatePhones: true,
        maxRows: 1000,
      });

      if (parseResult.totalRows === 0) {
        errors.push('Excel file is empty or contains no data');
      }

      if (parseResult.totalRows > 1000) {
        warnings.push(`File contains ${parseResult.totalRows} rows. Only the first 1000 rows will be processed.`);
      }

      if (parseResult.errors.length > 0) {
        warnings.push(`${parseResult.errors.length} rows have validation errors and will be skipped.`);
      }

      if (parseResult.duplicates.length > 0) {
        warnings.push(`${parseResult.duplicates.length} duplicate rows will be skipped.`);
      }

    } catch (parseError) {
      errors.push(`Failed to parse Excel file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    logger.error(`Excel validation failed: ${filename}`, error);
    return {
      isValid: false,
      errors: ['Failed to validate Excel file'],
      warnings: [],
    };
  }
};
