/**
 * TestimonialView Page Component
 * 
 * This page component displays detailed information about a specific testimonial.
 * It provides a comprehensive view of testimonial content, metadata, and management actions.
 * 
 * Features:
 * - Complete testimonial information display
 * - Author avatar and information
 * - Video testimonial integration
 * - Status indicators with color coding
 * - Action buttons for editing and deletion
 * - Responsive design with proper error handling
 * - Navigation breadcrumbs
 * 
 * API Integration:
 * - GET /api/v1/testimonials/:id - Fetch testimonial details
 * - DELETE /api/v1/testimonials/:id - Delete testimonial
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <TestimonialView />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Star, 
  User, 
  Calendar, 
  MessageSquare, 
  Video,
  Clock,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Testimonial API service for backend communication
import testimonialService from '../../../cms/services/testimonialService.js';

/**
 * TestimonialView Component
 * 
 * Main component that displays detailed testimonial information and provides management actions.
 * Fetches testimonial data from API and handles testimonial deletion.
 */
const TestimonialView = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Testimonial ID from URL
  
  // State management
  const [testimonial, setTestimonial] = useState(null); // Testimonial data object
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for error handling
  const [deleteLoading, setDeleteLoading] = useState(false); // Delete operation loading

  /**
   * Effect hook to fetch testimonial data when component mounts
   * Runs when testimonial ID changes
   */
  useEffect(() => {
    if (id) {
      fetchTestimonialData();
    }
  }, [id]);

  /**
   * Fetches testimonial data from the API
   * 
   * API Endpoint: GET /api/v1/testimonials/:id
   * 
   * @async
   * @function fetchTestimonialData
   */
  const fetchTestimonialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching testimonial data for ID:', id);
      
      // Call testimonial service to get testimonial by ID
      const response = await testimonialService.getTestimonialById(id);
      
      console.log('Testimonial view API response:', response);
      
      if (response.success && response.data) {
        setTestimonial(response.data);
      } else {
        throw new Error(response.message || 'Testimonial not found');
      }
    } catch (err) {
      console.error('Error fetching testimonial:', err);
      setError(err.message || 'Failed to load testimonial data');
      toast.error('Failed to load testimonial data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles testimonial deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/testimonials/:id
   * 
   * @async
   * @function handleDelete
   */
  const handleDelete = async () => {
    if (!testimonial) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the testimonial by "${testimonial.authorName}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      setDeleteLoading(true);
      
      console.log('Deleting testimonial:', testimonial.id);
      
      // Call testimonial service to delete testimonial
      const response = await testimonialService.deleteTestimonial(testimonial.id);
      
      console.log('Delete testimonial response:', response);
      
      if (response.success) {
        toast.success('Testimonial deleted successfully');
        navigate('/dashboard/content/testimonials'); // Redirect to testimonial list
      } else {
        throw new Error(response.message || 'Failed to delete testimonial');
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      toast.error(err.message || 'Failed to delete testimonial');
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Navigates to testimonial edit page
   */
  const handleEdit = () => {
    navigate(`/dashboard/content/testimonials/${id}/edit`);
  };

  /**
   * Navigates back to testimonial list
   */
  const handleBack = () => {
    navigate('/dashboard/content/testimonials');
  };

  /**
   * Returns appropriate status badge component based on testimonial status
   * 
   * @param {string} status - Testimonial status (approved, pending, rejected)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Approved',
        icon: Star
      },
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Pending Review',
        icon: Clock
      },
      rejected: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Rejected',
        icon: AlertCircle
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
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
   * Formats testimonial text with proper line breaks
   * 
   * @param {string} text - Testimonial text
   * @returns {JSX.Element} Formatted testimonial content
   */
  const formatTestimonialText = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-2">
        {line.trim()}
      </p>
    ));
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading testimonial details...</span>
      </div>
    );
  }

  // Show error state if testimonial not found or error occurred
  if (error || !testimonial) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Testimonial Not Found</h3>
        <p className="text-gray-500 mb-4">{error || 'The requested testimonial could not be found.'}</p>
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Testimonials
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
          Back to Testimonials
        </button>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Testimonial
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

      {/* Testimonial Header */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                {testimonial.avatarUrl ? (
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.authorName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Author Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{testimonial.authorName}</h1>
                {testimonial.role && (
                  <p className="text-lg text-gray-600">{testimonial.role}</p>
                )}
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="ml-6">
              {getStatusBadge(testimonial.status)}
            </div>
          </div>
          
          {/* Testimonial Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Created Date */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">{formatDate(testimonial.createdAt)}</p>
              </div>
            </div>
            
            {/* Updated Date */}
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Updated</p>
                <p className="font-semibold text-gray-900">{formatDate(testimonial.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Testimonial Text */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Testimonial
            </h3>
            <div className="text-gray-700 leading-relaxed text-lg italic">
              "{formatTestimonialText(testimonial.text)}"
            </div>
          </div>
          
          {/* Video Testimonial */}
          {testimonial.videoUrl && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Video Testimonial
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">This testimonial includes a video component.</p>
                <a
                  href={testimonial.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Watch Video Testimonial
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Testimonial Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonial Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Testimonial ID</p>
                <p className="font-mono text-sm text-gray-900">{testimonial.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Author Name</p>
                <p className="text-sm text-gray-900">{testimonial.authorName}</p>
              </div>
              
              {testimonial.role && (
                <div>
                  <p className="text-sm text-gray-500">Role/Position</p>
                  <p className="text-sm text-gray-900">{testimonial.role}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">
                  {getStatusBadge(testimonial.status)}
                </div>
              </div>
              
              {testimonial.creator && (
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="text-sm text-gray-900">{testimonial.creator.name || 'Admin'}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Media Information */}
          {(testimonial.avatarUrl || testimonial.videoUrl) && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Assets</h3>
              <div className="space-y-3">
                {testimonial.avatarUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Avatar Image</p>
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.authorName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                
                {testimonial.videoUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Video URL</p>
                    <a
                      href={testimonial.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                    >
                      {testimonial.videoUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Testimonial
              </button>
              
              <button
                onClick={() => navigate('/dashboard/content/testimonials')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                View All Testimonials
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
                {deleteLoading ? 'Deleting...' : 'Delete Testimonial'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialView;