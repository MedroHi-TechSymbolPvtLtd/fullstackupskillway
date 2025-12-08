/**
 * FaqList Page Component
 * 
 * This page component displays a list of FAQs with full dashboard layout including sidebar.
 * It provides comprehensive FAQ management functionality with search, filtering, and CRUD operations.
 * 
 * Features:
 * - FAQ listing with pagination
 * - Search functionality across FAQ questions and answers
 * - Category filtering
 * - FAQ creation, editing, viewing, and deletion
 * - Responsive design with proper error handling
 * - Integration with FAQ API endpoints
 * 
 * API Integration:
 * - GET /api/v1/faqs - Fetch FAQs with pagination
 * - DELETE /api/v1/faqs/:id - Delete FAQ
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <FaqList />
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
  HelpCircle,
  MessageSquare,
  Tag
} from 'lucide-react';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

// FAQ API service for backend communication
import faqService from '../../../cms/services/faqService.js';

/**
 * FaqList Component
 * 
 * Main component that handles FAQ listing, search, filtering, and basic CRUD operations.
 * Integrates with the FAQ API to fetch, display, and manage FAQs.
 */
const FaqList = () => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // State management for FAQs data and UI
  const [faqs, setFaqs] = useState([]); // Array of FAQ objects
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for error handling
  const [searchTerm, setSearchTerm] = useState(''); // Search input value
  const [categoryFilter, setCategoryFilter] = useState(''); // Category filter value
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
  const ITEMS_PER_PAGE = 10; // Number of FAQs per page

  /**
   * Effect hook to fetch FAQs when component mounts or dependencies change
   * Dependencies: currentPage, searchTerm, categoryFilter
   */
  useEffect(() => {
    fetchFaqs();
  }, [currentPage, searchTerm, categoryFilter]);

  /**
   * Fetches FAQs from the API with current filters and pagination
   * 
   * API Endpoint: GET /api/v1/faqs
   * Query Parameters:
   * - page: Current page number
   * - limit: Items per page
   * - search: Search term (optional)
   * - category: Category filter (optional)
   * 
   * @async
   * @function fetchFaqs
   */
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare API parameters
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter })
      };

      console.log('Fetching FAQs with params:', params);
      
      // Call FAQ service to get FAQs
      const response = await faqService.getFaqs(params);
      
      console.log('FAQ API response:', response);
      
      if (response.success) {
        setFaqs(response.data || []);
        setPagination(response.pagination || {
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        throw new Error(response.message || 'Failed to fetch FAQs');
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(err.message || 'Failed to load FAQs');
      toast.error('Failed to load FAQs');
      setFaqs([]); // Reset FAQs on error
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
   * Handles category filter changes and resets pagination
   * 
   * @param {Event} e - Select change event
   */
  const handleCategoryFilter = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  /**
   * Navigates to FAQ view page
   * 
   * @param {Object} faq - FAQ object to view
   */
  const handleView = (faq) => {
    navigate(`/dashboard/content/faqs/${faq.id}`);
  };

  /**
   * Navigates to FAQ edit page
   * 
   * @param {Object} faq - FAQ object to edit
   */
  const handleEdit = (faq) => {
    navigate(`/dashboard/content/faqs/${faq.id}/edit`);
  };

  /**
   * Handles FAQ deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/faqs/:id
   * 
   * @param {Object} faq - FAQ object to delete
   * @async
   */
  const handleDelete = async (faq) => {
    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      item: faq,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      console.log('Deleting FAQ:', deleteModal.item.id);
      
      // Call FAQ service to delete FAQ
      const response = await faqService.deleteFaq(deleteModal.item.id);
      
      console.log('Delete FAQ response:', response);
      
      if (response.success) {
        toastUtils.crud.deleted('FAQ');
        
        // Remove FAQ from local state
        setFaqs(faqs.filter(f => f.id !== deleteModal.item.id));
        
        // Update pagination total
        setPagination(prev => ({ 
          ...prev, 
          total: prev.total - 1 
        }));
        
        // Refresh FAQs list to ensure consistency
        await fetchFaqs();
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to delete FAQ');
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      toastUtils.crud.deleteError('FAQ', err.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
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
        <span className="ml-2 text-gray-600">Loading FAQs...</span>
      </div>
    );
  }

  // Main component render
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-600">Manage your frequently asked questions</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/content/faqs/create')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create FAQ
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Getting Started">Getting Started</option>
            <option value="Account">Account</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchFaqs}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* FAQs Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Answer Preview
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
              {faqs.length === 0 ? (
                // Empty state when no FAQs found
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || categoryFilter 
                        ? "No FAQs match your current filters." 
                        : "Get started by creating your first FAQ."
                      }
                    </p>
                    {!searchTerm && !categoryFilter && (
                      <button
                        onClick={() => navigate('/dashboard/content/faqs/create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create FAQ
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                // FAQ rows
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    {/* Question Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {truncateText(faq.question, 50)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {faq.category ? (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {faq.category}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">No category</span>
                      )}
                    </td>
                    
                    {/* Answer Preview Column */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {truncateText(faq.answer, 80)}
                      </div>
                    </td>
                    
                    {/* Created Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(faq.createdAt)}
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(faq)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View FAQ"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Edit FAQ"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete FAQ"
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
            Page {currentPage} of {pagination.totalPages} ({pagination.total} total FAQs)
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
        itemName={deleteModal.item?.question || ''}
        itemType="FAQ"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default FaqList;