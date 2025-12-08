import { z } from 'zod';

// Excel file validation schema
export const excelFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string().refine(
    (name) => /\.(xlsx|xls)$/i.test(name),
    'File must be an Excel file (.xlsx or .xls)'
  ),
  encoding: z.string(),
  mimetype: z.string().refine(
    (type) => [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ].includes(type),
    'Invalid file type. Only Excel files are allowed.'
  ),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  buffer: z.instanceof(Buffer),
  destination: z.string().optional(),
  filename: z.string().optional(),
  path: z.string().optional(),
  stream: z.any().optional()
});

// Lead row validation schema
export const leadRowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number too long'),
  organization: z.string().max(255, 'Organization name too long').optional(),
  requirement: z.string().max(1000, 'Requirement description too long').optional(),
  source: z.string().max(100, 'Source too long').optional(),
  stage: z.enum([
    'START',
    'IN_CONVERSATION',
    'EMAIL_WHATSAPP',
    'IN_PROGRESS',
    'DENIED',
    'CONVERT'
  ]).optional(),
  status: z.enum([
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'PROPOSAL',
    'NEGOTIATION',
    'CLOSED_WON',
    'CLOSED_LOST',
    'CONVERTED'
  ]).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
  value: z.number().min(0, 'Value must be positive').optional()
});

// Upload configuration validation schema
export const uploadConfigSchema = z.object({
  skipDuplicates: z.boolean().default(true),
  updateExisting: z.boolean().default(false),
  validateEmails: z.boolean().default(true),
  validatePhones: z.boolean().default(true),
  maxRows: z.number().min(1).max(10000).default(1000),
  batchSize: z.number().min(10).max(500).default(100)
});

// Column mapping definitions
export const COLUMN_MAPPING = {
  name: ['name', 'full_name', 'fullname', 'contact_name', 'contact name', 'full name'],
  email: ['email', 'email_address', 'emailaddress', 'e_mail', 'e-mail', 'email address'],
  phone: ['phone', 'phone_number', 'phonenumber', 'mobile', 'contact_number', 'contact number', 'contact_number', 'phone number'],
  organization: ['organization', 'company', 'institution', 'org', 'organisation'],
  requirement: ['requirement', 'needs', 'description', 'requirements', 'requirement_description'],
  source: ['source', 'lead_source', 'leadsource', 'origin', 'lead source'],
  stage: ['stage', 'lead_stage', 'leadstage', 'status_stage', 'lead stage'],
  status: ['status', 'lead_status', 'leadstatus', 'lead status'],
  priority: ['priority', 'urgency', 'importance'],
  notes: ['notes', 'comments', 'remarks', 'additional_info', 'additional info'],
  value: ['value', 'amount', 'budget', 'estimated_value', 'estimated value']
};

// Valid values for enum fields
export const VALID_VALUES = {
  stage: [
    'START',
    'IN_CONVERSATION',
    'EMAIL_WHATSAPP',
    'IN_PROGRESS',
    'DENIED',
    'CONVERT'
  ],
  status: [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'PROPOSAL',
    'NEGOTIATION',
    'CLOSED_WON',
    'CLOSED_LOST',
    'CONVERTED'
  ],
  priority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
};

// Helper function to find column index by name variations
export const findColumnIndex = (headers, fieldName) => {
  const variations = COLUMN_MAPPING[fieldName] || [fieldName];
  
  for (const variation of variations) {
    const index = headers.findIndex(header => 
      header && header.toString().toLowerCase().trim() === variation.toLowerCase().trim()
    );
    if (index !== -1) {
      return index;
    }
  }
  
  return -1;
};

// Helper function to validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone format
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Helper function to clean and validate data
export const cleanAndValidateData = (data, rowIndex) => {
  const errors = [];
  const cleanedData = {};
  
  // Clean and validate name
  if (data.name) {
    const name = data.name.toString().trim();
    if (name.length === 0) {
      errors.push({
        row: rowIndex + 1,
        field: 'name',
        message: 'Name cannot be empty'
      });
    } else if (name.length > 255) {
      errors.push({
        row: rowIndex + 1,
        field: 'name',
        message: 'Name too long (max 255 characters)'
      });
    } else {
      cleanedData.name = name;
    }
  }
  
  // Clean and validate email
  if (data.email) {
    const email = data.email.toString().trim().toLowerCase();
    if (!isValidEmail(email)) {
      errors.push({
        row: rowIndex + 1,
        field: 'email',
        message: 'Invalid email format'
      });
    } else {
      cleanedData.email = email;
    }
  }
  
  // Clean and validate phone
  if (data.phone) {
    const phone = data.phone.toString().trim();
    if (!isValidPhone(phone)) {
      errors.push({
        row: rowIndex + 1,
        field: 'phone',
        message: 'Invalid phone format'
      });
    } else {
      cleanedData.phone = phone;
    }
  }
  
  // Clean optional fields
  if (data.organization) {
    cleanedData.organization = data.organization.toString().trim().substring(0, 255);
  }
  
  if (data.requirement) {
    cleanedData.requirement = data.requirement.toString().trim().substring(0, 1000);
  }
  
  if (data.source) {
    cleanedData.source = data.source.toString().trim().substring(0, 100);
  }
  
  if (data.notes) {
    cleanedData.notes = data.notes.toString().trim().substring(0, 2000);
  }
  
  // Validate enum fields
  if (data.stage && !VALID_VALUES.stage.includes(data.stage)) {
    errors.push({
      row: rowIndex + 1,
      field: 'stage',
      message: `Invalid stage value. Must be one of: ${VALID_VALUES.stage.join(', ')}`
    });
  } else if (data.stage) {
    cleanedData.stage = data.stage;
  }
  
  if (data.status && !VALID_VALUES.status.includes(data.status)) {
    errors.push({
      row: rowIndex + 1,
      field: 'status',
      message: `Invalid status value. Must be one of: ${VALID_VALUES.status.join(', ')}`
    });
  } else if (data.status) {
    cleanedData.status = data.status;
  }
  
  if (data.priority && !VALID_VALUES.priority.includes(data.priority)) {
    errors.push({
      row: rowIndex + 1,
      field: 'priority',
      message: `Invalid priority value. Must be one of: ${VALID_VALUES.priority.join(', ')}`
    });
  } else if (data.priority) {
    cleanedData.priority = data.priority;
  }
  
  // Validate numeric value
  if (data.value !== undefined && data.value !== null && data.value !== '') {
    const value = parseFloat(data.value);
    if (isNaN(value) || value < 0) {
      errors.push({
        row: rowIndex + 1,
        field: 'value',
        message: 'Value must be a positive number'
      });
    } else {
      cleanedData.value = value;
    }
  }
  
  return { cleanedData, errors };
};

export default {
  excelFileSchema,
  leadRowSchema,
  uploadConfigSchema,
  COLUMN_MAPPING,
  VALID_VALUES,
  findColumnIndex,
  isValidEmail,
  isValidPhone,
  cleanAndValidateData
};
