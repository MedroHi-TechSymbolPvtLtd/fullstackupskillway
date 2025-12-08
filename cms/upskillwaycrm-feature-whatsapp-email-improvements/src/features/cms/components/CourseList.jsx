/**
 * CourseList Component
 * 
 * This component displays a list of courses in a card-based grid layout.
 * Features include:
 * - Search and filter functionality
 * - Bulk selection and deletion
 * - Pagination support
 * - Status badges and pricing display
 * - Responsive grid layout
 * - Course thumbnails and demo video links
 */

import { useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Search,
  Calendar,
  User,
  Tag,
  BookOpen,
  DollarSign,
  Play,
  ExternalLink,
  CheckCircle,
  Clock,
  Archive
} from "lucide-react";
import toast from "react-hot-toast";
import courseService from "../services/courseService.js";

/**
 * CourseList functional component
 * @param {Function} onCreateNew - Callback when user wants to create new course
 * @param {Function} onEdit - Callback when user wants to edit a course
 * @param {Function} onView - Callback when user wants to view course details
 */
const CourseList = ({ onCreateNew, onEdit, onView, onShowAPITest }) => {
  // State management for component data and UI
  const [courses, setCourses] = useState([]); // Array of course objects
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter selection
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const [pagination, setPagination] = useState({}); // Pagination metadata
  const [selectedCourses, setSelectedCourses] = useState([]); // Selected course IDs for bulk operations

  /**
   * Fetch courses from API with current filters and pagination
   * Uses useCallback to prevent unnecessary re-renders
   */
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build parameters object for API call
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log('CourseList: Fetching courses with params:', params);
      
      // Call API service to get courses
      const response = await courseService.getCourses(params);
      console.log('CourseList: Received response:', response);
      
      // Extract courses data from response
      const coursesData = response.data || [];
      console.log('CourseList: Setting courses data:', coursesData);
      
      // Update component state with fetched data
      setCourses(coursesData);
      setPagination(response.pagination || {});
      
      // Log success message
      if (coursesData.length > 0) {
        console.log('CourseList: Successfully loaded', coursesData.length, 'courses');
      } else {
        console.log('CourseList: No courses found');
      }
    } catch (error) {
      // Handle and display errors
      console.error("CourseList: Fetch courses error:", error);
      toast.error(`Failed to fetch courses: ${error.message}`);
      setCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  /**
   * Effect hook to fetch courses when dependencies change
   */
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /**
   * Handle deletion of a single course
   * @param {string} courseId - ID of course to delete
   */
  const handleDelete = async (courseId) => {
    // Confirm deletion with user
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      toast.success("Course deleted successfully");
      fetchCourses(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete course");
      console.error("Delete course error:", error);
    }
  };

  /**
   * Handle bulk deletion of selected courses
   */
  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select courses to delete");
      return;
    }

    // Confirm bulk deletion
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedCourses.length} course(s)?`
      )
    ) {
      return;
    }

    try {
      // Delete all selected courses in parallel
      await Promise.all(selectedCourses.map((id) => courseService.deleteCourse(id)));
      toast.success(`${selectedCourses.length} course(s) deleted successfully`);
      setSelectedCourses([]); // Clear selection
      fetchCourses(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete some courses");
      console.error("Bulk delete error:", error);
    }
  };

  /**
   * Toggle selection of a single course
   * @param {string} courseId - ID of course to toggle
   */
  const toggleSelectCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId) // Remove if already selected
        : [...prev, courseId] // Add if not selected
    );
  };

  /**
   * Toggle selection of all courses
   */
  const toggleSelectAll = () => {
    setSelectedCourses(
      selectedCourses.length === courses.length 
        ? [] // Deselect all if all are selected
        : courses.map((course) => course.id) // Select all if none/some are selected
    );
  };

  /**
   * Format date string for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Format price for display
   * @param {string|number} price - Course price
   * @returns {string} Formatted price with currency symbol
   */
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'Free' : `$${numPrice.toFixed(2)}`;
  };

  /**
   * Get status badge component for course status
   * @param {string} status - Course status (published, draft, archived)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
        icon: CheckCircle
      },
      draft: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        label: "Draft",
        icon: Clock
      },
      archived: { 
        bg: "bg-gray-100", 
        text: "text-gray-800", 
        label: "Archived",
        icon: Archive
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  /**
   * Get course thumbnail URL (placeholder for now)
   * @param {Object} course - Course object
   * @returns {string} Thumbnail URL
   */
  const getCourseThumbnail = (course) => {
    // For now, return a placeholder. In the future, this could extract from videoDemoUrl or use a dedicated thumbnail field
    return `https://via.placeholder.com/320x180/8b5cf6/ffffff?text=${encodeURIComponent(course.title.substring(0, 20))}`;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
          <p className="text-gray-600">Manage your online courses and learning content</p>
        </div>
        <div className="flex items-center space-x-3">
          {onShowAPITest && (
            <button
              onClick={onShowAPITest}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-5 w-5 mr-2" />
              API Test
            </button>
          )}
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Course
          </button>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            {/* Bulk Delete Button (shown only when courses are selected) */}
            {selectedCourses.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedCourses.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Course List Section */}
      {courses.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start creating engaging courses for your students"}
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Course
            </button>
          </div>
        </div>
      ) : (
        // Course Grid
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Selection Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCourses.length === courses.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {selectedCourses.length > 0
                  ? `${selectedCourses.length} selected`
                  : "Select all"}
              </span>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Course Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={getCourseThumbnail(course)}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => toggleSelectCourse(course.id)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(course.status)}
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded text-sm font-semibold">
                      {formatPrice(course.price)}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(course.createdAt)}
                    </div>
                    {course.creator && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {course.creator.name || 'Unknown'}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{course.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onView(course)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Course"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(course)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit Course"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Demo Video Link */}
                    {course.videoDemoUrl && (
                      <a
                        href={course.videoDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Watch Demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                {/* Results Info */}
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(currentPage * pagination.limit, pagination.total)}{" "}
                  of {pagination.total} results
                </div>
                
                {/* Pagination Controls */}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md">
                    {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.totalPages)
                      )
                    }
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;