import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, X, Eye, BarChart3 } from 'lucide-react';
import excelUploadApi from '../../services/api/excelUploadApi.js';
import toast from 'react-hot-toast';

const ExcelUploadWidget = ({ onUploadComplete, compact = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [uploadOptions, setUploadOptions] = useState({
    skipDuplicates: true,
    updateExisting: false,
    validateEmails: true,
    validatePhones: true,
    maxRows: 1000
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showValidation, setShowValidation] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        toast.error('File size exceeds 10MB limit');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        toast.error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.');
      } else {
        toast.error('File upload rejected');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setUploadResult(null);
      setValidationResult(null);
      toast.success(`File selected: ${file.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleValidate = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsValidating(true);
    setShowValidation(true);

    try {
      const result = await excelUploadApi.validateExcelFile(selectedFile);
      setValidationResult(result);
      
      if (result.success) {
        if (result.data.isValid) {
          toast.success('File validation passed!');
        } else {
          toast.warning(`File validation completed with ${result.data.errors.length} errors`);
        }
      } else {
        toast.error('File validation failed');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate file');
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);

    try {
      const result = await excelUploadApi.uploadExcelFile(selectedFile, uploadOptions);
      setUploadResult(result);
      
      if (result.success) {
        toast.success('File uploaded and processed successfully!');
        
        // Dispatch event to notify all components about leads update
        window.dispatchEvent(new CustomEvent('leadsUpdated', {
          detail: {
            source: 'excel_upload',
            result: result,
            insertedRows: result.data?.insertedRows || 0,
            updatedRows: result.data?.updatedRows || 0
          }
        }));
        
        if (onUploadComplete) {
          onUploadComplete(result);
        }
      } else {
        toast.error('File upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await excelUploadApi.downloadTemplateFile();
      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Template download error:', error);
      toast.error('Failed to download template');
    }
  };

  const handleOptionChange = (option, value) => {
    setUploadOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setValidationResult(null);
    setShowValidation(false);
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            Excel Upload
          </h3>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            Template
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          {isDragActive ? (
            <p className="text-blue-600 text-sm">Drop the Excel file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 text-sm mb-1">
                Drag & drop an Excel file here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                Supports .xlsx and .xls files up to 10MB
              </p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleValidate}
                disabled={isValidating}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {uploadResult && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {uploadResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${
                uploadResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadResult.message}
              </span>
            </div>
            
            {uploadResult.success && uploadResult.data && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Total: {uploadResult.data.totalRows}</div>
                <div>Processed: {uploadResult.data.processedRows}</div>
                <div>Inserted: {uploadResult.data.insertedRows}</div>
                <div>Success: {uploadResult.data.successRate}%</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Excel Lead Upload</h2>
        <p className="text-gray-600">
          Upload an Excel file to bulk import leads into the CRM system.
        </p>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Drop the Excel file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop an Excel file here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx and .xls files up to 10MB
              </p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Upload Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="skipDuplicates"
              checked={uploadOptions.skipDuplicates}
              onChange={(e) => handleOptionChange('skipDuplicates', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="skipDuplicates" className="text-sm text-gray-700">
              Skip duplicate leads
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="updateExisting"
              checked={uploadOptions.updateExisting}
              onChange={(e) => handleOptionChange('updateExisting', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="updateExisting" className="text-sm text-gray-700">
              Update existing leads
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="validateEmails"
              checked={uploadOptions.validateEmails}
              onChange={(e) => handleOptionChange('validateEmails', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="validateEmails" className="text-sm text-gray-700">
              Validate email formats
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="validatePhones"
              checked={uploadOptions.validatePhones}
              onChange={(e) => handleOptionChange('validatePhones', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="validatePhones" className="text-sm text-gray-700">
              Validate phone formats
            </label>
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="maxRows" className="block text-sm font-medium text-gray-700 mb-2">
            Maximum rows to process
          </label>
          <input
            type="number"
            id="maxRows"
            value={uploadOptions.maxRows}
            onChange={(e) => handleOptionChange('maxRows', parseInt(e.target.value))}
            min="1"
            max="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </button>
        
        {selectedFile && (
          <>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isValidating ? 'Validating...' : 'Validate File'}
            </button>
            
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </>
        )}
      </div>

      {/* Validation Results */}
      {showValidation && validationResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Results</h3>
          <div className={`p-4 rounded-lg ${
            validationResult.data.isValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center mb-3">
              {validationResult.data.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              )}
              <span className={`font-medium ${
                validationResult.data.isValid ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {validationResult.data.isValid ? 'File is valid' : 'File has validation issues'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Rows:</span> {validationResult.data.totalRows}
              </div>
              <div>
                <span className="font-medium">Valid Rows:</span> {validationResult.data.validRows}
              </div>
              <div>
                <span className="font-medium">Errors:</span> {validationResult.data.errors.length}
              </div>
              <div>
                <span className="font-medium">Warnings:</span> {validationResult.data.warnings.length}
              </div>
            </div>
            
            {validationResult.data.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {validationResult.data.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">
                      Row {error.row}: {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {validationResult.data.warnings.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-yellow-800 mb-2">Warnings:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {validationResult.data.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-yellow-700 mb-1">
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Results</h3>
          <div className={`p-4 rounded-lg ${
            uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center mb-3">
              {uploadResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${
                uploadResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadResult.message}
              </span>
            </div>
            
            {uploadResult.success && uploadResult.data && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="font-medium">Total Rows:</span> {uploadResult.data.totalRows}
                </div>
                <div>
                  <span className="font-medium">Processed:</span> {uploadResult.data.processedRows}
                </div>
                <div>
                  <span className="font-medium">Inserted:</span> {uploadResult.data.insertedRows}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {uploadResult.data.updatedRows}
                </div>
                <div>
                  <span className="font-medium">Skipped:</span> {uploadResult.data.skippedRows}
                </div>
                <div>
                  <span className="font-medium">Errors:</span> {uploadResult.data.errorRows}
                </div>
                <div>
                  <span className="font-medium">Success Rate:</span> {uploadResult.data.successRate}%
                </div>
                <div>
                  <span className="font-medium">Processing Time:</span> {uploadResult.data.processingTime}ms
                </div>
              </div>
            )}
            
            {uploadResult.success && uploadResult.data.errors && uploadResult.data.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {uploadResult.data.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">
                      Row {error.row}: {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {uploadResult.success && uploadResult.data.duplicates && uploadResult.data.duplicates.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-yellow-800 mb-2">Duplicates:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {uploadResult.data.duplicates.map((duplicate, index) => (
                    <div key={index} className="text-sm text-yellow-700 mb-1">
                      Row {duplicate.row}: {duplicate.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadWidget;
