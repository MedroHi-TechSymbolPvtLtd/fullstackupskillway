/**
 * TestimonialList Page Component
 * 
 * This page component displays a list of testimonials with full dashboard layout including sidebar.
 * It provides comprehensive testimonial management functionality with search, filtering, and CRUD operations.
 * 
 * Features:
 * - Testimonial listing with pagination
 * - Search functionality across author names and testimonial text
 * - Status filtering (Approved, Pending, Rejected)
 * - Testimonial creation, editing, viewing, and deletion
 * - Responsive design with proper error handling
 * - Integration with testimonial API endpoints
 * 
 * API Integration:
 * - GET /api/v1/testimonials - Fetch testimonials with pagination
 * - DELETE /api/v1/testimonials/:id - Delete testimonial
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <TestimonialList />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Star,
  User,
  Clock,
  MessageSquare,
  Video,
  ExternalLink
} from 'lucide-react';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

// Testimonial API service for backend communication
import testimonialService from '../../../cms/services/testimonialService.js';

/**
 * TestimonialList Component
 * 
 * Main component that handles testimonial listing, search, filtering, and basic CRUD operations.
 * Integrates with the testimonial API to fetch, display, and manage testimonials.
 */
const TestimonialList = () => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // State management for testimonials data and UI
  const [testimonials, setTestimonials] = useState([]); // Array of testimonial objects
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for error handling
  const [searchTerm, setSearchTerm] = useState(''); // Search input value
  const [statusFilter, setStatusFilter] = useState(''); // Status filter value
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  
  // Pagination state from API response
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false
  });

  // Constants
  const ITEMS_PER_PAGE = 10; // Number of testimonials per page

  /**
   * Effect hook to fetch testimonials when component mounts or dependencies change
   * Dependencies: currentPage, searchTerm, statusFilter
   */
  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, searchTerm, statusFilter]);

  /**
   * Fetches testimonials from the API with current filters and pagination
   * 
   * API Endpoint: GET /api/v1/testimonials
   * Query Parameters:
   * - page: Current page number
   * - limit: Items per page
   * - search: Search term (optional)
   * - status: Status filter (optional)
   * 
   * @async
   * @function fetchTestimonials
   */
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare API parameters
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      };

      console.log('Fetching testimonials with params:', params);
      
      // Call testimonial service to get testimonials
      const response = await testimonialService.getTestimonials(params);
      
      console.log('Testimonial API response:', response);
      
      if (response.success) {
        setTestimonials(response.data || []);
        setPagination(response.pagination || {
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        throw new Error(response.message || 'Failed to fetch testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message || 'Failed to load testimonials');
      toast.error('Failed to load testimonials');
      setTestimonials([]); // Reset testimonials on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles search input changes and resets pagination
   * 
   * @param {Event} e - Input change event
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  /**
   * Handles status filter changes and resets pagination
   * 
   * @param {Event} e - Select change event
   */
  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  /**
   * Navigates to testimonial view page
   * 
   * @param {Object} testimonial - Testimonial object to view
   */
  const handleView = (testimonial) => {
    navigate(`/dashboard/content/testimonials/${testimonial.id}`);
  };

  /**
   * Navigates to testimonial edit page
   * 
   * @param {Object} testimonial - Testimonial object to edit
   */
  const handleEdit = (testimonial) => {
    navigate(`/dashboard/content/testimonials/${testimonial.id}/edit`);
  };

  /**
   * Handles testimonial deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/testimonials/:id
   * 
   * @param {Object} testimonial - Testimonial object to delete
   * @async
   */
  const handleDelete = async (testimonial) => {
    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      item: testimonial,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      console.log('Deleting testimonial:', deleteModal.item.id);
      
      // Call testimonial service to delete testimonial
      const response = await testimonialService.deleteTestimonial(deleteModal.item.id);
      
      console.log('Delete testimonial response:', response);
      
      if (response.success) {
        toastUtils.crud.deleted('Testimonial');
        
        // Remove testimonial from local state
        setTestimonials(testimonials.filter(t => t.id !== deleteModal.item.id));
        
        // Update pagination total
        setPagination(prev => ({ 
          ...prev, 
          total: prev.total - 1 
        }));
        
        // Refresh testimonials list to ensure consistency
        await fetchTestimonials();
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to delete testimonial');
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      toastUtils.crud.deleteError('Testimonial', err.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
  };

  /**
   * Returns appropriate status badge component based on testimonial status
   * 
   * @param {string} status - Testimonial status (approved, pending, rejected)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  /**
   * Formats date string to readable format
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Truncates text to specified length with ellipsis
   * 
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated text
   */
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading testimonials...</span>
      </div>
    );
  }

  // Main component render
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/content/testimonials/create')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Testimonial
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search testimonials by author name or content..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testimonial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.length === 0 ? (
                // Empty state when no testimonials found
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || statusFilter 
                        ? "No testimonials match your current filters." 
                        : "Get started by creating your first testimonial."
                      }
                    </p>
                    {!searchTerm && !statusFilter && (
                      <button
                        onClick={() => navigate('/dashboard/content/testimonials/create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Testimonial
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                // Testimonial rows
                testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    {/* Author Info Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {testimonial.avatarUrl ? (
                            <img
                              src={testimonial.avatarUrl}
                              alt={testimonial.authorName}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.authorName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {testimonial.role || 'Customer'}
                          </div>
                          {testimonial.videoUrl && (
                            <div className="flex items-center mt-1">
                              <Video className="h-3 w-3 text-blue-500 mr-1" />
                              <span className="text-xs text-blue-500">Video Available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Testimonial Text Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <MessageSquare className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                          {truncateText(testimonial.text, 80)}
                        </div>
                      </div>
                    </td>
                    
                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(testimonial.status)}
                    </td>
                    
                    {/* Created Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(testimonial.createdAt)}
                      </div>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(testimonial)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Testimonial"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Edit Testimonial"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {testimonial.videoUrl && (
                          <a
                            href={testimonial.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="Watch Video"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(testimonial)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {pagination.totalPages} ({pagination.total} total testimonials)
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteModal.item ? `testimonial by "${deleteModal.item.authorName}"` : ''}
        itemType="Testimonial"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default TestimonialList;