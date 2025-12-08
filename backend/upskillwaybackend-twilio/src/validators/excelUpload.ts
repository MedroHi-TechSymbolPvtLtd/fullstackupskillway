import { z } from 'zod';
import { LeadStage, LeadStatus, Priority } from '@prisma/client';

/**
 * Excel upload validation schemas
 */

// Excel file validation
export const excelFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string().refine(
    (name) => {
      const ext = name.split('.').pop()?.toLowerCase();
      return ext === 'xlsx' || ext === 'xls';
    },
    { message: 'File must be an Excel file (.xlsx or .xls)' }
  ),
  mimetype: z.string().refine(
    (type) => type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
             type === 'application/vnd.ms-excel',
    { message: 'Invalid file type. Only Excel files are allowed.' }
  ),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
});

// Excel row validation (for individual lead records)
export const excelLeadRowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number too short').max(15, 'Phone number too long'),
  organization: z.string().max(100, 'Organization name too long').optional(),
  requirement: z.string().max(1000, 'Requirement description too long').optional(),
  source: z.string().max(100, 'Source too long').optional(),
  stage: z.nativeEnum(LeadStage).optional().default('LEAD_GENERATED'),
  status: z.nativeEnum(LeadStatus).optional().default('ACTIVE'),
  priority: z.nativeEnum(Priority).optional().default('MEDIUM'),
  notes: z.string().max(2000, 'Notes too long').optional(),
  value: z.coerce.number().min(0).optional(),
});

// Excel upload configuration
export const excelUploadConfigSchema = z.object({
  skipDuplicates: z.boolean().default(true),
  updateExisting: z.boolean().default(false),
  validateEmails: z.boolean().default(true),
  validatePhones: z.boolean().default(true),
  maxRows: z.number().int().min(1).max(10000).default(1000),
});

// Excel upload result
export const excelUploadResultSchema = z.object({
  totalRows: z.number(),
  validRows: z.number(),
  insertedRows: z.number(),
  skippedRows: z.number(),
  errorRows: z.number(),
  errors: z.array(z.object({
    row: z.number(),
    field: z.string(),
    message: z.string(),
  })),
  duplicates: z.array(z.object({
    row: z.number(),
    email: z.string(),
    reason: z.string(),
  })),
});

// Export types
export type ExcelFileInput = z.infer<typeof excelFileSchema>;
export type ExcelLeadRowInput = z.infer<typeof excelLeadRowSchema>;
export type ExcelUploadConfigInput = z.infer<typeof excelUploadConfigSchema>;
export type ExcelUploadResult = z.infer<typeof excelUploadResultSchema>;

// Excel column mapping (for flexible column names)
export const EXCEL_COLUMN_MAPPING = {
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
} as const;

// Expected Excel headers
export const EXPECTED_EXCEL_HEADERS = [
  'name',
  'email', 
  'phone',
  'organization',
  'requirement',
  'source',
  'stage',
  'status',
  'priority',
  'notes',
  'value'
] as const;
