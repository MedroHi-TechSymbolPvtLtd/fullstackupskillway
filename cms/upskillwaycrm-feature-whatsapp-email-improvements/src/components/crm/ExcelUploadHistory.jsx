import React, { useState, useEffect } from 'react';
import { History, Download, Eye, Calendar, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import excelUploadApi from '../../services/api/excelUploadApi.js';
import toast from 'react-hot-toast';

const ExcelUploadHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [pagination.page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await excelUploadApi.getUploadHistory({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setHistory(response.data);
        setPagination(response.pagination);
      } else {
        toast.error('Failed to fetch upload history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch upload history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await excelUploadApi.getUploadStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (successRate) => {
    if (successRate >= 90) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (successRate >= 70) {
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (successRate) => {
    if (successRate >= 90) return 'text-green-600';
    if (successRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <History className="h-6 w-6 mr-2" />
          Excel Upload History
        </h2>
        <p className="text-gray-600">
          View the history of Excel file uploads and their processing results.
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Uploads</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUploads}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Leads Created</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalLeadsCreated}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Leads Updated</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.totalLeadsUpdated}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-purple-600 font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-purple-900">{stats.averageSuccessRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rows
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Processed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Processing Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((upload, index) => (
              <tr key={upload.uploadId || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {upload.fileName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(upload.fileSize)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(upload.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {upload.totalRows}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>Inserted: {upload.insertedRows}</div>
                    <div>Updated: {upload.updatedRows}</div>
                    <div>Skipped: {upload.skippedRows}</div>
                    <div>Errors: {upload.errorRows}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(upload.successRate)}
                    <span className={`ml-2 text-sm font-medium ${getStatusColor(upload.successRate)}`}>
                      {upload.successRate}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {upload.processingTime}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {history.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upload history</h3>
          <p className="text-gray-500">
            No Excel files have been uploaded yet. Upload your first file to see the history here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadHistory;
