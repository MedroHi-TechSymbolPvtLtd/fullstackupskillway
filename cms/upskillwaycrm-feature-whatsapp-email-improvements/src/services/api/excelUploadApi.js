import { mainApi, API_ENDPOINTS } from './apiConfig.js';

class ExcelUploadApi {
  /**
   * Upload and process Excel file
   * @param {File} file - Excel file to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadExcelFile(file, options = {}) {
    const formData = new FormData();
    formData.append('excelFile', file);
    
    // Add options to form data
    if (options.skipDuplicates !== undefined) {
      formData.append('skipDuplicates', options.skipDuplicates.toString());
    }
    if (options.updateExisting !== undefined) {
      formData.append('updateExisting', options.updateExisting.toString());
    }
    if (options.validateEmails !== undefined) {
      formData.append('validateEmails', options.validateEmails.toString());
    }
    if (options.validatePhones !== undefined) {
      formData.append('validatePhones', options.validatePhones.toString());
    }
    if (options.maxRows) {
      formData.append('maxRows', options.maxRows.toString());
    }
    if (options.batchSize) {
      formData.append('batchSize', options.batchSize.toString());
    }

    const response = await mainApi.post(API_ENDPOINTS.EXCEL_UPLOAD.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for large files
    });

    return response.data;
  }

  /**
   * Validate Excel file without processing
   * @param {File} file - Excel file to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateExcelFile(file) {
    const formData = new FormData();
    formData.append('excelFile', file);

    const response = await mainApi.post(API_ENDPOINTS.EXCEL_UPLOAD.VALIDATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute timeout for validation
    });

    return response.data;
  }

  /**
   * Download Excel template
   * @returns {Promise<Blob>} Template file blob
   */
  async downloadTemplate() {
    const response = await mainApi.get(API_ENDPOINTS.EXCEL_UPLOAD.TEMPLATE, {
      responseType: 'blob',
      timeout: 30000,
    });

    return response.data;
  }

  /**
   * Get Excel upload configuration
   * @returns {Promise<Object>} Upload configuration
   */
  async getUploadConfig() {
    const response = await mainApi.get(API_ENDPOINTS.EXCEL_UPLOAD.CONFIG);
    return response.data;
  }

  /**
   * Get upload history
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Upload history
   */
  async getUploadHistory(params = {}) {
    const response = await mainApi.get(API_ENDPOINTS.EXCEL_UPLOAD.HISTORY, {
      params,
    });
    return response.data;
  }

  /**
   * Get upload statistics
   * @returns {Promise<Object>} Upload statistics
   */
  async getUploadStats() {
    const response = await mainApi.get(API_ENDPOINTS.EXCEL_UPLOAD.STATS);
    return response.data;
  }

  /**
   * Helper method to download file from blob
   * @param {Blob} blob - File blob
   * @param {string} filename - Filename for download
   */
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Download template file
   */
  async downloadTemplateFile() {
    try {
      const blob = await this.downloadTemplate();
      this.downloadBlob(blob, 'leads_template.xlsx');
    } catch (error) {
      console.error('Failed to download template:', error);
      throw error;
    }
  }
}

export default new ExcelUploadApi();
