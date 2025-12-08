import * as XLSX from 'xlsx';
import { 
  findColumnIndex, 
  cleanAndValidateData, 
  COLUMN_MAPPING, 
  VALID_VALUES 
} from '../validators/excelUpload.js';

class ExcelProcessingService {
  constructor() {
    this.requiredColumns = ['name', 'email', 'phone'];
    this.optionalColumns = [
      'organization', 'requirement', 'source', 'stage', 
      'status', 'priority', 'notes', 'value'
    ];
  }

  /**
   * Parse Excel file and extract data
   * @param {Buffer} fileBuffer - Excel file buffer
   * @param {Object} options - Processing options
   * @returns {Object} Parsed data with headers and rows
   */
  parseExcelFile(fileBuffer, options = {}) {
    try {
      const workbook = XLSX.read(fileBuffer, { 
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false
      });

      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error('No data found in Excel file');
      }

      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: null,
        blankrows: false
      });

      if (jsonData.length === 0) {
        throw new Error('Excel file is empty');
      }

      // Extract headers (first row)
      const headers = jsonData[0].map(header => 
        header ? header.toString().trim() : ''
      );

      // Extract data rows (skip header row)
      const dataRows = jsonData.slice(1);

      return {
        headers,
        dataRows,
        totalRows: dataRows.length,
        sheetName
      };
    } catch (error) {
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  /**
   * Map columns from Excel headers to standard field names
   * @param {Array} headers - Excel column headers
   * @returns {Object} Column mapping object
   */
  mapColumns(headers) {
    const columnMapping = {};
    const missingColumns = [];
    const warnings = [];

    // Map required columns
    for (const column of this.requiredColumns) {
      const index = findColumnIndex(headers, column);
      if (index === -1) {
        missingColumns.push(column);
      } else {
        columnMapping[column] = index;
      }
    }

    // Map optional columns
    for (const column of this.optionalColumns) {
      const index = findColumnIndex(headers, column);
      if (index !== -1) {
        columnMapping[column] = index;
      }
    }

    // Check for unmapped columns
    const mappedIndices = Object.values(columnMapping);
    const unmappedColumns = headers
      .map((header, index) => ({ header, index }))
      .filter(({ index }) => !mappedIndices.includes(index) && header.trim() !== '')
      .map(({ header }) => header);

    if (unmappedColumns.length > 0) {
      warnings.push(`Unmapped columns found: ${unmappedColumns.join(', ')}`);
    }

    return {
      columnMapping,
      missingColumns,
      warnings
    };
  }

  /**
   * Transform raw Excel data to structured lead objects
   * @param {Array} dataRows - Raw data rows from Excel
   * @param {Object} columnMapping - Column mapping object
   * @param {Object} options - Processing options
   * @returns {Object} Transformed data with validation results
   */
  transformData(dataRows, columnMapping, options = {}) {
    const {
      validateEmails = true,
      validatePhones = true,
      maxRows = 1000
    } = options;

    const transformedRows = [];
    const errors = [];
    const warnings = [];
    let processedRows = 0;

    // Limit rows if specified
    const rowsToProcess = Math.min(dataRows.length, maxRows);
    if (dataRows.length > maxRows) {
      warnings.push(`File contains ${dataRows.length} rows. Only the first ${maxRows} rows will be processed.`);
    }

    for (let i = 0; i < rowsToProcess; i++) {
      const row = dataRows[i];
      processedRows++;

      // Skip empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === '')) {
        continue;
      }

      try {
        // Extract data based on column mapping
        const rawData = {};
        for (const [field, columnIndex] of Object.entries(columnMapping)) {
          if (columnIndex < row.length && row[columnIndex] !== null && row[columnIndex] !== undefined) {
            rawData[field] = row[columnIndex];
          }
        }

        // Clean and validate data
        const { cleanedData, errors: rowErrors } = cleanAndValidateData(rawData, i);

        // Add row errors to main errors array
        errors.push(...rowErrors);

        // Only add to transformed rows if it has required fields
        if (cleanedData.name && cleanedData.email && cleanedData.phone) {
          transformedRows.push({
            ...cleanedData,
            _rowIndex: i + 1, // 1-based row index for error reporting
            _rawData: rawData
          });
        } else {
          // Add error for missing required fields
          const missingFields = [];
          if (!cleanedData.name) missingFields.push('name');
          if (!cleanedData.email) missingFields.push('email');
          if (!cleanedData.phone) missingFields.push('phone');

          errors.push({
            row: i + 1,
            field: 'required_fields',
            message: `Missing required fields: ${missingFields.join(', ')}`
          });
        }
      } catch (error) {
        errors.push({
          row: i + 1,
          field: 'processing',
          message: `Failed to process row: ${error.message}`
        });
      }
    }

    return {
      transformedRows,
      errors,
      warnings,
      processedRows,
      totalRows: dataRows.length
    };
  }

  /**
   * Detect duplicate leads by email
   * @param {Array} leads - Array of lead objects
   * @param {Array} existingLeads - Array of existing leads from database
   * @returns {Object} Duplicate detection results
   */
  detectDuplicates(leads, existingLeads = []) {
    const duplicates = [];
    const uniqueLeads = [];
    const emailMap = new Map();

    // Create map of existing leads by email
    const existingEmailMap = new Map();
    existingLeads.forEach(lead => {
      if (lead.email) {
        existingEmailMap.set(lead.email.toLowerCase(), lead);
      }
    });

    // Check for duplicates
    leads.forEach(lead => {
      const email = lead.email.toLowerCase();
      
      // Check against existing leads
      if (existingEmailMap.has(email)) {
        duplicates.push({
          row: lead._rowIndex,
          email: lead.email,
          reason: `Lead with email '${lead.email}' already exists in database`,
          existingLead: existingEmailMap.get(email)
        });
        return;
      }

      // Check against current batch
      if (emailMap.has(email)) {
        duplicates.push({
          row: lead._rowIndex,
          email: lead.email,
          reason: `Duplicate email '${lead.email}' found in current batch (row ${emailMap.get(email)})`,
          duplicateOf: emailMap.get(email)
        });
        return;
      }

      emailMap.set(email, lead._rowIndex);
      uniqueLeads.push(lead);
    });

    return {
      duplicates,
      uniqueLeads,
      duplicateCount: duplicates.length
    };
  }

  /**
   * Process Excel file with full validation and transformation
   * @param {Buffer} fileBuffer - Excel file buffer
   * @param {Object} options - Processing options
   * @returns {Object} Complete processing results
   */
  async processExcelFile(fileBuffer, options = {}) {
    try {
      // Parse Excel file
      const { headers, dataRows, totalRows } = this.parseExcelFile(fileBuffer, options);

      // Map columns
      const { columnMapping, missingColumns, warnings: mappingWarnings } = this.mapColumns(headers);

      // Check for missing required columns
      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      // Transform data
      const {
        transformedRows,
        errors: transformationErrors,
        warnings: transformationWarnings,
        processedRows
      } = this.transformData(dataRows, columnMapping, options);

      // Combine all warnings
      const allWarnings = [...mappingWarnings, ...transformationWarnings];

      return {
        success: true,
        data: {
          headers,
          totalRows,
          processedRows,
          validRows: transformedRows.length,
          transformedRows,
          columnMapping,
          warnings: allWarnings,
          errors: transformationErrors
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Generate Excel template with sample data
   * @returns {Buffer} Excel file buffer
   */
  generateTemplate() {
    const headers = [
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
    ];

    const sampleData = [
      [
        'John Doe',
        'john.doe@example.com',
        '+1234567890',
        'ABC Company',
        'Need JavaScript training',
        'Website',
        'START',
        'NEW',
        'MEDIUM',
        'Interested in React',
        5000
      ],
      [
        'Jane Smith',
        'jane.smith@example.com',
        '+1987654321',
        'XYZ Corp',
        'Python development course',
        'Referral',
        'PENDING',
        'ACTIVE',
        'HIGH',
        'Urgent requirement',
        8000
      ],
      [
        'Bob Johnson',
        'bob.johnson@example.com',
        '+1122334455',
        'Tech Solutions',
        'Data Science bootcamp',
        'Social Media',
        'IN_PROGRESS',
        'QUALIFIED',
        'HIGH',
        'Very interested',
        12000
      ]
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    
    // Set column widths
    const columnWidths = [
      { wch: 20 }, // name
      { wch: 30 }, // email
      { wch: 15 }, // phone
      { wch: 20 }, // organization
      { wch: 30 }, // requirement
      { wch: 15 }, // source
      { wch: 20 }, // stage
      { wch: 15 }, // status
      { wch: 10 }, // priority
      { wch: 30 }, // notes
      { wch: 10 }  // value
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Template');

    // Generate buffer
    const buffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    return buffer;
  }

  /**
   * Get processing statistics
   * @param {Object} processingResult - Result from processExcelFile
   * @returns {Object} Statistics object
   */
  getProcessingStats(processingResult) {
    if (!processingResult.success) {
      return {
        totalRows: 0,
        validRows: 0,
        errorRows: 0,
        duplicateRows: 0,
        successRate: 0
      };
    }

    const { data } = processingResult;
    const totalRows = data.totalRows;
    const validRows = data.validRows;
    const errorRows = data.errors.length;
    const duplicateRows = data.duplicates ? data.duplicates.length : 0;
    const successRate = totalRows > 0 ? ((validRows / totalRows) * 100).toFixed(2) : 0;

    return {
      totalRows,
      validRows,
      errorRows,
      duplicateRows,
      successRate: parseFloat(successRate)
    };
  }
}

export default new ExcelProcessingService();
