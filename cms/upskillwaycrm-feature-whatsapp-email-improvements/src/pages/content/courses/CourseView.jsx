/**
 * CourseView Page Component
 * 
 * This page component displays detailed information about a specific course.
 * It provides a comprehensive view of course content, metadata, and management actions.
 * 
 * Features:
 * - Complete course information display
 * - Course thumbnail and video demo integration
 * - Tag display with proper styling
 * - Status indicators with color coding
 * - Price formatting and display
 * - Syllabus content with proper formatting
 * - Action buttons for editing and deletion
 * - Responsive design with proper error handling
 * - Navigation breadcrumbs
 * 
 * API Integration:
 * - GET /api/v1/courses/:id - Fetch course details
 * - DELETE /api/v1/courses/:id - Delete course
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <CourseView />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Play, 
  DollarSign, 
  Calendar, 
  Tag, 
  User, 
  Clock, 
  Eye,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Course API service for backend communication
import courseService from '../../../cms/services/courseService.js';

/**
 * CourseView Component
 * 
 * Main component that displays detailed course information and provides management actions.
 * Fetches course data from API and handles course deletion.
 */
const CourseView = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Course ID from URL
  
  // State management
  const [course, setCourse] = useState(null); // Course data object
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for error handling
  const [deleteLoading, setDeleteLoading] = useState(false); // Delete operation loading

  /**
   * Effect hook to fetch course data when component mounts
   * Runs when course ID changes
   */
  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  /**
   * Fetches course data from the API
   * 
   * API Endpoint: GET /api/v1/courses/:id
   * 
   * @async
   * @function fetchCourseData
   */
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching course data for ID:', id);
      
      // Call course service to get course by ID
      const response = await courseService.getCourseById(id);
      
      console.log('Course view API response:', response);
      
      if (response.success && response.data) {
        setCourse(response.data);
      } else {
        throw new Error(response.message || 'Course not found');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to load course data');
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles course deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/courses/:id
   * 
   * @async
   * @function handleDelete
   */
  const handleDelete = async () => {
    if (!course) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      setDeleteLoading(true);
      
      console.log('Deleting course:', course.id);
      
      // Call course service to delete course
      const response = await courseService.deleteCourse(course.id);
      
      console.log('Delete course response:', response);
      
      if (response.success) {
        toast.success('Course deleted successfully');
        navigate('/dashboard/content/courses'); // Redirect to course list
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error(err.message || 'Failed to delete course');
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Navigates to course edit page
   */
  const handleEdit = () => {
    navigate(`/dashboard/content/courses/${id}/edit`);
  };

  /**
   * Navigates back to course list
   */
  const handleBack = () => {
    navigate('/dashboard/content/courses');
  };

  /**
   * Returns appropriate status badge component based on course status
   * 
   * @param {string} status - Course status (published, draft, archived)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Published',
        icon: Eye
      },
      draft: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Draft',
        icon: Edit3
      },
      archived: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Archived',
        icon: Clock
      }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const StatusIcon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <StatusIcon className="h-4 w-4 mr-1" />
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Formats price to currency string
   * 
   * @param {string|number} price - Course price
   * @returns {string} Formatted price string
   */
  const formatPrice = (price) => {
    if (!price || price === '0' || price === 0) return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  /**
   * Formats syllabus text with proper line breaks
   * 
   * @param {string} syllabus - Course syllabus text
   * @returns {JSX.Element} Formatted syllabus content
   */
  const formatSyllabus = (syllabus) => {
    if (!syllabus) return null;
    
    return syllabus.split('\n').map((line, index) => (
      <div key={index} className="mb-2">
        {line.trim() && (
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>{line.trim()}</span>
          </div>
        )}
      </div>
    ));
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading course details...</span>
      </div>
    );
  }

  // Show error state if course not found or error occurred
  if (error || !course) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
        <p className="text-gray-500 mb-4">{error || 'The requested course could not be found.'}</p>
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </button>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </button>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Course
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 text-lg">{course.description}</p>
            </div>
            <div className="ml-6">
              {getStatusBadge(course.status)}
            </div>
          </div>
          
          {/* Course Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {/* Price */}
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold text-gray-900">{formatPrice(course.price)}</p>
              </div>
            </div>
            
            {/* Created Date */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">{formatDate(course.createdAt)}</p>
              </div>
            </div>
            
            {/* Updated Date */}
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Updated</p>
                <p className="font-semibold text-gray-900">{formatDate(course.updatedAt)}</p>
              </div>
            </div>
            
            {/* Creator */}
            <div className="flex items-center">
              <User className="h-5 w-5 text-orange-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Creator</p>
                <p className="font-semibold text-gray-900">{course.creator?.name || 'Admin'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Thumbnail */}
        {course.thumbnailUrl && (
          <div className="px-6 pb-6">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Syllabus */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Course Syllabus
            </h3>
            <div className="text-gray-700 leading-relaxed">
              {formatSyllabus(course.syllabus)}
            </div>
          </div>
          
          {/* Video Demo */}
          {course.videoDemoUrl && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Course Demo
              </h3>
              <a
                href={course.videoDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Demo Video
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Course Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Course ID</p>
                <p className="font-mono text-sm text-gray-900">{course.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">URL Slug</p>
                <p className="font-mono text-sm text-gray-900">{course.slug}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">
                  {getStatusBadge(course.status)}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Pricing</p>
                <p className="text-lg font-semibold text-green-600">{formatPrice(course.price)}</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Course
              </button>
              
              <button
                onClick={() => navigate('/dashboard/content/courses')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View All Courses
              </button>
              
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {deleteLoading ? 'Deleting...' : 'Delete Course'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;