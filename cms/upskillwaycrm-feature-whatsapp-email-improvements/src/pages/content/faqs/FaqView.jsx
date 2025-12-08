/**
 * FaqView Page Component
 * 
 * This page component displays detailed information about a specific FAQ.
 * It provides a comprehensive view of FAQ content, metadata, and management actions.
 * 
 * Features:
 * - Complete FAQ information display
 * - Category and order information
 * - Action buttons for editing and deletion
 * - Responsive design with proper error handling
 * - Navigation breadcrumbs
 * 
 * API Integration:
 * - GET /api/v1/faqs/:id - Fetch FAQ details
 * - DELETE /api/v1/faqs/:id - Delete FAQ
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <FaqView />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  HelpCircle, 
  Calendar, 
  Tag, 
  Hash,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// FAQ API service for backend communication
import faqService from '../../../cms/services/faqService.js';

/**
 * FaqView Component
 * 
 * Main component that displays detailed FAQ information and provides management actions.
 * Fetches FAQ data from API and handles FAQ deletion.
 */
const FaqView = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // FAQ ID from URL
  
  // State management
  const [faq, setFaq] = useState(null); // FAQ data object
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for error handling
  const [deleteLoading, setDeleteLoading] = useState(false); // Delete operation loading

  /**
   * Effect hook to fetch FAQ data when component mounts
   * Runs when FAQ ID changes
   */
  useEffect(() => {
    if (id) {
      fetchFaqData();
    }
  }, [id]);

  /**
   * Fetches FAQ data from the API
   * 
   * API Endpoint: GET /api/v1/faqs/:id
   * 
   * @async
   * @function fetchFaqData
   */
  const fetchFaqData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching FAQ data for ID:', id);
      
      // Call FAQ service to get FAQ by ID
      const response = await faqService.getFaqById(id);
      
      console.log('FAQ view API response:', response);
      
      if (response.success && response.data) {
        setFaq(response.data);
      } else {
        throw new Error(response.message || 'FAQ not found');
      }
    } catch (err) {
      console.error('Error fetching FAQ:', err);
      setError(err.message || 'Failed to load FAQ data');
      toast.error('Failed to load FAQ data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles FAQ deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/faqs/:id
   * 
   * @async
   * @function handleDelete
   */
  const handleDelete = async () => {
    if (!faq) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${faq.question}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      setDeleteLoading(true);
      
      console.log('Deleting FAQ:', faq.id);
      
      // Call FAQ service to delete FAQ
      const response = await faqService.deleteFaq(faq.id);
      
      console.log('Delete FAQ response:', response);
      
      if (response.success) {
        toast.success('FAQ deleted successfully');
        navigate('/dashboard/content/faqs'); // Redirect to FAQ list
      } else {
        throw new Error(response.message || 'Failed to delete FAQ');
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      toast.error(err.message || 'Failed to delete FAQ');
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Navigates to FAQ edit page
   */
  const handleEdit = () => {
    navigate(`/dashboard/content/faqs/${id}/edit`);
  };

  /**
   * Navigates back to FAQ list
   */
  const handleBack = () => {
    navigate('/dashboard/content/faqs');
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
   * Formats answer text with proper line breaks
   * 
   * @param {string} answer - FAQ answer text
   * @returns {JSX.Element} Formatted answer content
   */
  const formatAnswer = (answer) => {
    if (!answer) return null;
    
    return answer.split('\n').map((line, index) => (
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
        <span className="ml-2 text-gray-600">Loading FAQ details...</span>
      </div>
    );
  }

  // Show error state if FAQ not found or error occurred
  if (error || !faq) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">FAQ Not Found</h3>
        <p className="text-gray-500 mb-4">{error || 'The requested FAQ could not be found.'}</p>
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to FAQs
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
          Back to FAQs
        </button>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit FAQ
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

      {/* FAQ Header */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">FAQ Details</h1>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h2>
            </div>
            {faq.category && (
              <div className="ml-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Tag className="h-4 w-4 mr-1" />
                  {faq.category}
                </span>
              </div>
            )}
          </div>
          
          {/* FAQ Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Created Date */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">{formatDate(faq.createdAt)}</p>
              </div>
            </div>
            
            {/* Updated Date */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Updated</p>
                <p className="font-semibold text-gray-900">{formatDate(faq.updatedAt)}</p>
              </div>
            </div>
            
            {/* Display Order */}
            <div className="flex items-center">
              <Hash className="h-5 w-5 text-orange-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Display Order</p>
                <p className="font-semibold text-gray-900">{faq.order || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQ Answer */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Answer
            </h3>
            <div className="text-gray-700 leading-relaxed">
              {formatAnswer(faq.answer)}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* FAQ Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQ Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">FAQ ID</p>
                <p className="font-mono text-sm text-gray-900">{faq.id}</p>
              </div>
              
              {faq.category && (
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {faq.category}
                    </span>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Display Order</p>
                <p className="text-sm text-gray-900">{faq.order || 'Not specified'}</p>
              </div>
              
              {faq.creator && (
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="text-sm text-gray-900">{faq.creator.name || 'Admin'}</p>
                </div>
              )}
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
                Edit FAQ
              </button>
              
              <button
                onClick={() => navigate('/dashboard/content/faqs')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                View All FAQs
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
                {deleteLoading ? 'Deleting...' : 'Delete FAQ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqView;