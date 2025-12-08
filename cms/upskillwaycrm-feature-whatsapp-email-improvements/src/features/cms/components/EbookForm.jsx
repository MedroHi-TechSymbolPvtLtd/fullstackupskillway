/**
 * EbookForm Component
 * 
 * This component provides a comprehensive form for creating and editing ebooks.
 * Features include:
 * - Create and edit modes with different UI states
 * - Form validation for all required fields
 * - Auto-slug generation from ebook title
 * - Tag management system with add/remove functionality
 * - URL validation for cover image, PDF, and video URLs
 * - Status management (Draft/Published/Archived)
 * - Preview mode to see ebook before saving
 * - Helpful tips and guidance for ebook creation
 */

import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  BookOpen,
  Image,
  FileText,
  Play,
  Tag,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import ebookService from '../services/ebookService.js';

/**
 * EbookForm functional component
 * @param {Object} ebook - Ebook object for editing (null for create mode)
 * @param {string} mode - Form mode ('create' or 'edit')
 * @param {Function} onSave - Callback when ebook is saved successfully
 * @param {Function} onCancel - Callback when form is cancelled
 */
const EbookForm = ({ ebook = null, mode = 'create', onSave, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    coverImageUrl: '',
    pdfUrl: '',
    videoUrl: '',
    tags: [],
    status: 'draft'
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Initialize form data when ebook prop changes
  useEffect(() => {
    console.log('🔧 EbookForm Debug: useEffect triggered');
    console.log('🔧 Ebook prop:', ebook);
    console.log('🔧 Mode:', mode);
    
    if (ebook && mode === 'edit') {
      console.log('🔧 Initializing form data for edit mode');
      const initialData = {
        title: ebook.title || '',
        slug: ebook.slug || '',
        description: ebook.description || '',
        coverImageUrl: ebook.coverImageUrl || '',
        pdfUrl: ebook.pdfUrl || '',
        videoUrl: ebook.videoUrl || '',
        tags: ebook.tags || [],
        status: ebook.status || 'draft'
      };
      console.log('🔧 Setting form data to:', initialData);
      setFormData(initialData);
    } else if (mode === 'create') {
      console.log('🔧 Create mode - using default form data');
      console.log('🔧 Current form data:', formData);
    }
  }, [ebook, mode]);

  /**
   * Handle input field changes with debugging
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('🔧 EbookForm Debug: Input change', { name, value });
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('🔧 Updated form data:', newData);
      return newData;
    });

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = ebookService.generateSlug(value);
      console.log('🔧 Auto-generating slug:', slug);
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }

    // Clear field error when user starts typing
    if (errors[name]) {
      console.log('🔧 Clearing error for field:', name);
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Handle tag addition
   */
  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  /**
   * Handle tag removal
   * @param {string} tagToRemove - Tag to remove from the list
   */
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Handle tag input key press (Enter to add tag)
   * @param {KeyboardEvent} e - Key press event
   */
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  /**
   * Validate form data with debugging
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    console.log('🔧 EbookForm Debug: Validating form data:', formData);
    
    const validation = ebookService.validateEbook(formData);
    console.log('🔧 Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('🔧 Form validation failed with errors:', validation.errors);
      const fieldErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('Title')) fieldErrors.title = error;
        if (error.includes('Description')) fieldErrors.description = error;
        if (error.includes('Cover image')) fieldErrors.coverImageUrl = error;
        if (error.includes('PDF')) fieldErrors.pdfUrl = error;
        if (error.includes('Video')) fieldErrors.videoUrl = error;
        if (error.includes('Status')) fieldErrors.status = error;
      });
      
      console.log('🔧 Setting field errors:', fieldErrors);
      setErrors(fieldErrors);
      toast.error('Please fix the form errors before submitting');
      return false;
    }

    console.log('🔧 Form validation passed');
    setErrors({});
    return true;
  };

  /**
   * Handle form submission with comprehensive debugging
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔧 EbookForm Debug: Form submission started');
    console.log('🔧 Mode:', mode);
    console.log('🔧 Form data:', formData);
    console.log('🔧 Ebook prop:', ebook);
    
    if (!validateForm()) {
      console.log('🔧 Form validation failed');
      return;
    }

    console.log('🔧 Form validation passed, proceeding with API call');

    try {
      setLoading(true);
      console.log('🔧 Loading state set to true');

      let response;
      if (mode === 'create') {
        console.log('🔧 Creating new ebook...');
        console.log('🔧 Calling ebookService.createEbook with:', formData);
        response = await ebookService.createEbook(formData);
        console.log('🔧 Create response received:', response);
        toast.success('Ebook created successfully!');
      } else {
        console.log('🔧 Updating existing ebook with ID:', ebook.id);
        console.log('🔧 Calling ebookService.updateEbook with:', formData);
        response = await ebookService.updateEbook(ebook.id, formData);
        console.log('🔧 Update response received:', response);
        toast.success('Ebook updated successfully!');
      }

      // Call onSave callback with the saved ebook data
      if (onSave) {
        console.log('🔧 Calling onSave callback with data:', response.data);
        onSave(response.data);
      } else {
        console.warn('🔧 No onSave callback provided');
      }
    } catch (error) {
      console.error('🔧 Error saving ebook:', error);
      console.error('🔧 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error(error.message || 'Failed to save ebook');
    } finally {
      console.log('🔧 Setting loading state to false');
      setLoading(false);
    }
  };

  /**
   * Get ebook cover image with fallback
   * @returns {string} Cover image URL
   */
  const getEbookCover = () => {
    return formData.coverImageUrl || `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent(formData.title.substring(0, 20) || 'Ebook')}`;
  };

  /**
   * Get status badge component for ebook status
   * @param {string} status - Ebook status
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: "bg-green-100", text: "text-green-800", label: "Published" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      archived: { bg: "bg-gray-100", text: "text-gray-800", label: "Archived" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Ebook' : 'Edit Ebook'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? 'Add a new ebook to your digital library' 
              : 'Update ebook information and content'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Ebook Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter ebook title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder="url-friendly-slug"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-generated from title. Used in the ebook URL.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe what this ebook is about..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Media URLs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Media & Files
              </h3>
              
              <div className="space-y-4">
                {/* Cover Image URL */}
                <div>
                  <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL *
                  </label>
                  <input
                    type="url"
                    id="coverImageUrl"
                    name="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.coverImageUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/cover-image.jpg"
                  />
                  {errors.coverImageUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.coverImageUrl}
                    </p>
                  )}
                </div>

                {/* PDF URL */}
                <div>
                  <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    PDF File URL *
                  </label>
                  <input
                    type="url"
                    id="pdfUrl"
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.pdfUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/ebook.pdf"
                  />
                  {errors.pdfUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.pdfUrl}
                    </p>
                  )}
                </div>

                {/* Video URL (Optional) */}
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.videoUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {errors.videoUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.videoUrl}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Optional promotional or preview video for the ebook
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags & Categories
              </h3>
              
              <div className="space-y-4">
                {/* Add Tag */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Tags List */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publication Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  {['draft', 'published', 'archived'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={handleInputChange}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
                
                <div className="text-sm text-gray-600">
                  Current status: {getStatusBadge(formData.status)}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : (mode === 'create' ? 'Create Ebook' : 'Update Ebook')}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </h3>
              </div>
              
              <div className="p-4">
                {/* Cover Image */}
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={getEbookCover()} 
                    alt={formData.title || 'Ebook Cover'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent(formData.title.substring(0, 20) || 'Ebook')}`;
                    }}
                  />
                </div>
                
                {/* Ebook Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">
                    {formData.title || 'Ebook Title'}
                  </h4>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {formData.description || 'Ebook description will appear here...'}
                  </p>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {formData.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{formData.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-100">
                    {getStatusBadge(formData.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Tips for Great Ebooks
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-quality cover images (300x400px recommended)</li>
                <li>• Write compelling descriptions that highlight key benefits</li>
                <li>• Add relevant tags for better discoverability</li>
                <li>• Include preview videos when possible</li>
                <li>• Start with draft status to review before publishing</li>
              </ul>
            </div>

            {/* URL Preview */}
            {formData.slug && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">URL Preview</h4>
                <p className="text-sm text-gray-600 font-mono break-all">
                  /ebooks/{formData.slug}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookForm;