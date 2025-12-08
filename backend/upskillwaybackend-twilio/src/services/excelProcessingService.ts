import * as XLSX from 'xlsx';
import { logger } from '../utils/logger';
import { 
  ExcelLeadRowInput, 
  ExcelUploadConfigInput, 
  ExcelUploadResult,
  EXCEL_COLUMN_MAPPING,
  EXPECTED_EXCEL_HEADERS 
} from '../validators/excelUpload';
import { LeadStage, LeadStatus, Priority } from '@prisma/client';

/**
 * Excel parsing and validation service
 * Handles Excel file processing, validation, and data transformation
 */

export interface ExcelParseResult {
  headers: string[];
  rows: any[][];
  totalRows: number;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface DuplicateInfo {
  row: number;
  email: string;
  reason: string;
}

// Parse Excel file and extract data
export const parseExcelFile = async (fileBuffer: Buffer, filename: string): Promise<ExcelParseResult> => {
  try {
    // Read Excel file
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('Excel file does not contain any worksheets');
    }
    
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '',
      raw: false 
    }) as any[][];
    
    if (jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }
    
    // Extract headers (first row)
    const headers = jsonData[0].map((header: any) => 
      String(header).toLowerCase().trim().replace(/\s+/g, '_')
    );
    
    // Extract data rows (skip header row)
    const rows = jsonData.slice(1).filter(row => 
      row.some(cell => cell !== '' && cell !== null && cell !== undefined)
    );
    
    logger.info(`Excel file parsed: ${filename} - Headers: ${headers.length}, Rows: ${rows.length}`);
    
    return {
      headers,
      rows,
      totalRows: rows.length
    };
  } catch (error) {
    logger.error(`Excel parsing failed: ${filename}`, error);
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Map Excel columns to standard field names
export const mapExcelColumns = (headers: string[]): Record<string, number> => {
  const columnMapping: Record<string, number> = {};
  
  headers.forEach((header, index) => {
    const normalizedHeader = header.toLowerCase().trim();
    
    // Find matching field for this header
    for (const [fieldName, possibleHeaders] of Object.entries(EXCEL_COLUMN_MAPPING)) {
      if ((possibleHeaders as readonly string[]).includes(normalizedHeader)) {
        columnMapping[fieldName as keyof typeof EXCEL_COLUMN_MAPPING] = index;
        break;
      }
    }
  });
  
  return columnMapping;
};

// Validate Excel headers
export const validateExcelHeaders = (headers: string[]): string[] => {
  const errors: string[] = [];
  const mappedColumns = mapExcelColumns(headers);
  
  // Check for required fields
  const requiredFields = ['name', 'email', 'phone'];
  requiredFields.forEach(field => {
    if (!(field in mappedColumns)) {
      errors.push(`Required column '${field}' not found. Available columns: ${headers.join(', ')}`);
    }
  });
  
  // Check for unexpected columns
  const validFields = Object.keys(EXCEL_COLUMN_MAPPING);
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase().trim();
    const isMapped = Object.values(EXCEL_COLUMN_MAPPING).some(possibleHeaders => 
      (possibleHeaders as readonly string[]).includes(normalizedHeader)
    );
    
    if (!isMapped && normalizedHeader !== '') {
      errors.push(`Unknown column '${header}'. Valid columns: ${validFields.join(', ')}`);
    }
  });
  
  return errors;
};

// Transform Excel row to lead data
export const transformExcelRowToLead = (
  row: any[], 
  columnMapping: Record<string, number>, 
  rowIndex: number
): Partial<ExcelLeadRowInput> => {
  const leadData: any = {};
  
  // Extract data for each mapped column
  Object.entries(columnMapping).forEach(([fieldName, columnIndex]) => {
    const value = row[columnIndex];
    
    if (value !== undefined && value !== null && value !== '') {
      // Clean and transform the value
      let cleanValue = String(value).trim();
      
      // Special handling for different field types
      switch (fieldName) {
        case 'email':
          cleanValue = cleanValue.toLowerCase();
          leadData[fieldName] = cleanValue;
          break;
        case 'phone':
          // Remove non-numeric characters except + at the beginning
          cleanValue = cleanValue.replace(/[^\d+]/g, '');
          leadData[fieldName] = cleanValue;
          break;
        case 'stage':
          // Convert to uppercase and validate
          cleanValue = cleanValue.toUpperCase().replace(/\s+/g, '_');
          leadData[fieldName] = cleanValue;
          break;
        case 'status':
          cleanValue = cleanValue.toUpperCase().replace(/\s+/g, '_');
          leadData[fieldName] = cleanValue;
          break;
        case 'priority':
          cleanValue = cleanValue.toUpperCase();
          leadData[fieldName] = cleanValue;
          break;
        case 'value':
          // Convert to number
          leadData[fieldName] = parseFloat(cleanValue) || 0;
          break;
        default:
          leadData[fieldName] = cleanValue;
          break;
      }
    }
  });
  
  return leadData;
};

// Validate individual lead row
export const validateLeadRow = (
  leadData: Partial<ExcelLeadRowInput>, 
  rowIndex: number,
  config: ExcelUploadConfigInput
): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  
  // Required field validation
  if (!leadData.name || leadData.name.trim() === '') {
    errors.push({
      row: rowIndex + 2, // +2 because Excel rows start from 1 and we skip header
      field: 'name',
      message: 'Name is required'
    });
  }
  
  if (!leadData.email || leadData.email.trim() === '') {
    errors.push({
      row: rowIndex + 2,
      field: 'email',
      message: 'Email is required'
    });
  } else if (config.validateEmails) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      errors.push({
        row: rowIndex + 2,
        field: 'email',
        message: 'Invalid email format'
      });
    }
  }
  
  if (!leadData.phone || leadData.phone.trim() === '') {
    errors.push({
      row: rowIndex + 2,
      field: 'phone',
      message: 'Phone number is required'
    });
  } else if (config.validatePhones) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(leadData.phone)) {
      errors.push({
        row: rowIndex + 2,
        field: 'phone',
        message: 'Invalid phone number format'
      });
    }
  }
  
  // Optional field validation
  if (leadData.stage && !Object.values(LeadStage).includes(leadData.stage as LeadStage)) {
    errors.push({
      row: rowIndex + 2,
      field: 'stage',
      message: `Invalid stage. Valid values: ${Object.values(LeadStage).join(', ')}`
    });
  }
  
  if (leadData.status && !Object.values(LeadStatus).includes(leadData.status as LeadStatus)) {
    errors.push({
      row: rowIndex + 2,
      field: 'status',
      message: `Invalid status. Valid values: ${Object.values(LeadStatus).join(', ')}`
    });
  }
  
  if (leadData.priority && !Object.values(Priority).includes(leadData.priority as Priority)) {
    errors.push({
      row: rowIndex + 2,
      field: 'priority',
      message: `Invalid priority. Valid values: ${Object.values(Priority).join(', ')}`
    });
  }
  
  if (leadData.value !== undefined && (isNaN(leadData.value) || leadData.value < 0)) {
    errors.push({
      row: rowIndex + 2,
      field: 'value',
      message: 'Value must be a positive number'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Check for duplicate leads
export const checkDuplicateLeads = async (
  leadData: ExcelLeadRowInput,
  rowIndex: number
): Promise<{ isDuplicate: boolean; reason?: string }> => {
  try {
    const { prisma } = await import('../config/database');
    
    // Check for existing lead with same email
    const existingLead = await prisma.lead.findFirst({
      where: { email: leadData.email }
    });
    
    if (existingLead) {
      return {
        isDuplicate: true,
        reason: `Lead with email '${leadData.email}' already exists`
      };
    }
    
    return { isDuplicate: false };
  } catch (error) {
    logger.error(`Duplicate check failed for row ${rowIndex + 2}`, error);
    return { isDuplicate: false };
  }
};

// Process Excel file and return structured data
export const processExcelFile = async (
  fileBuffer: Buffer,
  filename: string,
  config: ExcelUploadConfigInput
): Promise<{
  validLeads: ExcelLeadRowInput[];
  errors: ValidationError[];
  duplicates: DuplicateInfo[];
  totalRows: number;
}> => {
  try {
    // Parse Excel file
    const parseResult = await parseExcelFile(fileBuffer, filename);
    
    // Validate headers
    const headerErrors = validateExcelHeaders(parseResult.headers);
    if (headerErrors.length > 0) {
      throw new Error(`Header validation failed: ${headerErrors.join(', ')}`);
    }
    
    // Map columns
    const columnMapping = mapExcelColumns(parseResult.headers);
    
    // Process rows
    const validLeads: ExcelLeadRowInput[] = [];
    const errors: ValidationError[] = [];
    const duplicates: DuplicateInfo[] = [];
    
    for (let i = 0; i < parseResult.rows.length; i++) {
      const row = parseResult.rows[i];
      
      // Skip empty rows
      if (row.every(cell => cell === '' || cell === null || cell === undefined)) {
        continue;
      }
      
      // Transform row to lead data
      const leadData = transformExcelRowToLead(row, columnMapping, i);
      
      // Validate lead data
      const validation = validateLeadRow(leadData, i, config);
      if (!validation.isValid) {
        errors.push(...validation.errors);
        continue;
      }
      
      // Check for duplicates if enabled
      if (config.skipDuplicates) {
        const duplicateCheck = await checkDuplicateLeads(leadData as ExcelLeadRowInput, i);
        if (duplicateCheck.isDuplicate) {
          duplicates.push({
            row: i + 2,
            email: leadData.email!,
            reason: duplicateCheck.reason!
          });
          continue;
        }
      }
      
      // Add default values
      const finalLeadData: ExcelLeadRowInput = {
        name: leadData.name!,
        email: leadData.email!,
        phone: leadData.phone!,
        organization: leadData.organization || '',
        requirement: leadData.requirement || '',
        source: leadData.source || 'Excel Upload',
        stage: leadData.stage || 'LEAD_GENERATED',
        status: leadData.status || 'NEW',
        priority: leadData.priority || 'MEDIUM',
        notes: leadData.notes || '',
        value: leadData.value || 0,
      };
      
      validLeads.push(finalLeadData);
    }
    
    logger.info(`Excel processing completed: ${filename} - Valid: ${validLeads.length}, Errors: ${errors.length}, Duplicates: ${duplicates.length}`);
    
    return {
      validLeads,
      errors,
      duplicates,
      totalRows: parseResult.totalRows
    };
  } catch (error) {
    logger.error(`Excel processing failed: ${filename}`, error);
    throw error;
  }
};
