/**
 * CourseList Page Component
 * 
 * This page component displays a list of courses with full dashboard layout including sidebar.
 * It provides comprehensive course management functionality with search, filtering, and CRUD operations.
 * 
 * Features:
 * - Course listing with pagination
 * - Search functionality across course titles and descriptions
 * - Status filtering (Published, Draft, Archived)
 * - Course creation, editing, viewing, and deletion
 * - Responsive design with proper error handling
 * - Integration with course API endpoints
 * 
 * API Integration:
 * - GET /api/v1/courses - Fetch courses with pagination
 * - DELETE /api/v1/courses/:id - Delete course
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <CourseList />
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
  BookOpen, 
  Play,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

// Course API service for backend communication
import courseService from '../../../cms/services/courseService.js';

/**
 * CourseList Component
 * 
 * Main component that handles course listing, search, filtering, and basic CRUD operations.
 * Integrates with the course API to fetch, display, and manage courses.
 */
const CourseList = () => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // State management for courses data and UI
  const [courses, setCourses] = useState([]); // Array of course objects
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
  const ITEMS_PER_PAGE = 10; // Number of courses per page

  /**
   * Effect hook to fetch courses when component mounts or dependencies change
   * Dependencies: currentPage, searchTerm, statusFilter
   */
  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, statusFilter]);

  /**
   * Fetches courses from the API with current filters and pagination
   * 
   * API Endpoint: GET /api/v1/courses
   * Query Parameters:
   * - page: Current page number
   * - limit: Items per page
   * - search: Search term (optional)
   * - status: Status filter (optional)
   * 
   * @async
   * @function fetchCourses
   */
  const fetchCourses = async () => {
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

      console.log('Fetching courses with params:', params);
      
      // Call course service to get courses
      const response = await courseService.getCourses(params);
      
      console.log('Course API response:', response);
      
      if (response.success) {
        setCourses(response.data || []);
        setPagination(response.pagination || {
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        throw new Error(response.message || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to load courses');
      toast.error('Failed to load courses');
      setCourses([]); // Reset courses on error
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
   * Navigates to course view page
   * 
   * @param {Object} course - Course object to view
   */
  const handleView = (course) => {
    navigate(`/dashboard/content/courses/${course.id}`);
  };

  /**
   * Navigates to course edit page
   * 
   * @param {Object} course - Course object to edit
   */
  const handleEdit = (course) => {
    navigate(`/dashboard/content/courses/${course.id}/edit`);
  };

  /**
   * Handles course deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/courses/:id
   * 
   * @param {Object} course - Course object to delete
   * @async
   */
  const handleDelete = async (course) => {
    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      item: course,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      console.log('Deleting course:', deleteModal.item.id);
      
      // Call course service to delete course
      const response = await courseService.deleteCourse(deleteModal.item.id);
      
      console.log('Delete course response:', response);
      
      if (response.success) {
        toastUtils.crud.deleted('Course');
        
        // Remove course from local state
        setCourses(courses.filter(c => c.id !== deleteModal.item.id));
        
        // Update pagination total
        setPagination(prev => ({ 
          ...prev, 
          total: prev.total - 1 
        }));
        
        // Refresh courses list to ensure consistency
        await fetchCourses();
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      toastUtils.crud.deleteError('Course', err.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
  };

  /**
   * Returns appropriate status badge component based on course status
   * 
   * @param {string} status - Course status (published, draft, archived)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
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
   * Formats price to currency string
   * 
   * @param {string|number} price - Course price
   * @returns {string} Formatted price string
   */
  const formatPrice = (price) => {
    if (!price || price === '0') return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
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
        <span className="ml-2 text-gray-600">Loading courses...</span>
      </div>
    );
  }

  // Main component render
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage your educational courses and content</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/content/courses/create')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
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
              {courses.length === 0 ? (
                // Empty state when no courses found
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || statusFilter 
                        ? "No courses match your current filters." 
                        : "Get started by creating your first course."
                      }
                    </p>
                    {!searchTerm && !statusFilter && (
                      <button
                        onClick={() => navigate('/dashboard/content/courses/create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                // Course rows
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    {/* Course Info Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {course.thumbnailUrl ? (
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {truncateText(course.description)}
                          </div>
                          {course.videoDemoUrl && (
                            <div className="flex items-center mt-1">
                              <Play className="h-3 w-3 text-blue-500 mr-1" />
                              <span className="text-xs text-blue-500">Demo Available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Price Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                    </td>
                    
                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(course.status)}
                    </td>
                    
                    {/* Tags Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {course.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {course.tags?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{course.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Created Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(course.createdAt)}
                      </div>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(course)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Course"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Edit Course"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Course"
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
            Page {currentPage} of {pagination.totalPages} ({pagination.total} total courses)
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
        itemName={deleteModal.item?.title || ''}
        itemType="Course"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default CourseList;