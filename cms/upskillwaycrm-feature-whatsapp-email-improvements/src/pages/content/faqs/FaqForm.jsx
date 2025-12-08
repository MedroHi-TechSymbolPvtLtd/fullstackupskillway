/**
 * FaqForm Page Component
 * 
 * This page component provides a comprehensive form for creating and editing FAQs.
 * It handles both create and edit modes with proper validation and API integration.
 * 
 * Features:
 * - Create and edit modes with different UI states
 * - Comprehensive form validation for all fields
 * - Category management with predefined options
 * - Rich text editing for FAQ answers
 * - Responsive design with proper error handling
 * 
 * API Integration:
 * - POST /api/v1/faqs - Create new FAQ
 * - PUT /api/v1/faqs/:id - Update existing FAQ
 * - GET /api/v1/faqs/:id - Fetch FAQ for editing
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <FaqForm />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  HelpCircle, 
  MessageSquare, 
  Tag, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

// FAQ API service for backend communication
import faqService from '../../../cms/services/faqService.js';

/**
 * FaqForm Component
 * 
 * Main form component that handles FAQ creation and editing.
 * Supports both create and edit modes based on URL parameters.
 */
const FaqForm = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // FAQ ID from URL (for edit mode)
  
  // Determine if we're in edit mode based on presence of ID
  const isEditMode = Boolean(id);
  
  // Form state management
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: ''
  });
  
  // UI state management
  const [loading, setLoading] = useState(false); // Form submission loading
  const [fetchLoading, setFetchLoading] = useState(isEditMode); // Initial data loading
  const [errors, setErrors] = useState({}); // Form validation errors

  // Predefined FAQ categories
  const categories = [
    'Getting Started',
    'Account',
    'Billing',
    'Technical',
    'General',
    'Support'
  ];

  /**
   * Effect hook to fetch FAQ data when in edit mode
   * Only runs when component mounts and we have an FAQ ID
   */
  useEffect(() => {
    if (isEditMode && id) {
      fetchFaqData();
    }
  }, [id, isEditMode]);

  /**
   * Fetches FAQ data for editing
   * 
   * API Endpoint: GET /api/v1/faqs/:id
   * 
   * @async
   * @function fetchFaqData
   */
  const fetchFaqData = async () => {
    try {
      setFetchLoading(true);
      console.log('Fetching FAQ data for ID:', id);
      
      // Call FAQ service to get FAQ by ID
      const response = await faqService.getFaqById(id);
      
      console.log('Fetch FAQ response:', response);
      
      if (response.success && response.data) {
        const faq = response.data;
        
        // Populate form with FAQ data
        setFormData({
          question: faq.question || '',
          answer: faq.answer || '',
          category: faq.category || '',
          order: faq.order || ''
        });
      } else {
        throw new Error(response.message || 'FAQ not found');
      }
    } catch (err) {
      console.error('Error fetching FAQ:', err);
      toast.error(err.message || 'Failed to load FAQ data');
      navigate('/dashboard/content/faqs'); // Redirect on error
    } finally {
      setFetchLoading(false);
    }
  };

  /**
   * Handles form input changes and updates state
   * Also clears validation errors for the changed field
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Validates the form data
   * Returns true if valid, false otherwise
   * Sets error messages for invalid fields
   * 
   * @returns {boolean} Form validity
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    // Order validation (if provided)
    if (formData.order && (isNaN(formData.order) || parseInt(formData.order) < 0)) {
      newErrors.order = 'Order must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission for both create and edit modes
   * 
   * API Endpoints:
   * - POST /api/v1/faqs (create mode)
   * - PUT /api/v1/faqs/:id (edit mode)
   * 
   * @param {Event} e - Form submit event
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare FAQ data for API
      const faqData = {
        ...formData,
        order: formData.order ? parseInt(formData.order) : undefined
      };
      
      console.log('Submitting FAQ data:', faqData);
      
      let response;
      
      if (isEditMode) {
        // Update existing FAQ
        response = await faqService.updateFaq(id, faqData);
        console.log('Update FAQ response:', response);
      } else {
        // Create new FAQ
        response = await faqService.createFaq(faqData);
        console.log('Create FAQ response:', response);
      }
      
      if (response.success) {
        const action = isEditMode ? 'updated' : 'created';
        toast.success(`FAQ ${action} successfully!`);
        
        // Navigate to FAQ view or list
        if (response.data?.id) {
          navigate(`/dashboard/content/faqs/${response.data.id}`);
        } else {
          navigate('/dashboard/content/faqs');
        }
      } else {
        throw new Error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} FAQ`);
      }
    } catch (err) {
      console.error('Error saving FAQ:', err);
      toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} FAQ`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form cancellation and navigation back to FAQ list
   */
  const handleCancel = () => {
    navigate('/dashboard/content/faqs');
  };

  // Show loading spinner while fetching FAQ data
  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading FAQ data...</span>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to FAQs
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit FAQ' : 'Create New FAQ'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update FAQ information and content' : 'Add a new frequently asked question'}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Form */}
      <div className="bg-white rounded-lg shadow border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              FAQ Information
            </h3>
            
            {/* FAQ Question */}
            <div className="space-y-2">
              <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                Question *
              </label>
              <input
                id="question"
                name="question"
                type="text"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter the frequently asked question"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.question ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.question && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.question}
                </p>
              )}
            </div>
            
            {/* FAQ Answer */}
            <div className="space-y-2">
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                Answer *
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Provide a detailed answer to the question"
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  errors.answer ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.answer && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.answer}
                </p>
              )}
            </div>
          </div>

          {/* Organization Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Organization
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FAQ Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Display Order */}
              <div className="space-y-2">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                  Display Order
                </label>
                <input
                  id="order"
                  name="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.order ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.order && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.order}
                  </p>
                )}
                <p className="text-xs text-gray-500">Lower numbers appear first (optional)</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : (isEditMode ? 'Update FAQ' : 'Create FAQ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FaqForm;