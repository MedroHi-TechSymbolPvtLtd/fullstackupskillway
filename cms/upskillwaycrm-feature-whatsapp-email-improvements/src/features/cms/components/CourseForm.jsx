/**
 * CourseForm Component
 * 
 * This component provides a form interface for creating and editing courses.
 * Features include:
 * - Form validation for all required fields
 * - Auto-slug generation from course title
 * - Tag management system
 * - Price input with validation
 * - Video demo URL support
 * - Status management (Draft/Published/Archived)
 * - Preview mode to see course before saving
 * - Syllabus content management
 */

import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  Upload, 
  Tag, 
  Calendar,
  FileText,
  BookOpen,
  AlertCircle,
  DollarSign,
  Play,
  ExternalLink,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';
import toast from 'react-hot-toast';
import courseService from '../services/courseService.js';

/**
 * CourseForm functional component
 * @param {Object} course - Course object for editing (null for create mode)
 * @param {Function} onSave - Callback when course is saved successfully
 * @param {Function} onCancel - Callback when user cancels the form
 * @param {string} mode - Form mode: 'create' or 'edit'
 */
const CourseForm = ({ course, onSave, onCancel, mode = 'create' }) => {
  // Form data state - contains all course information
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    syllabus: '',
    
    tags: [],
    price: '',
    status: 'draft'
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Loading state for API operations
  const [loading, setLoading] = useState(false);
  
  // Tag input for adding new tags
  const [tagInput, setTagInput] = useState('');
  
  // Preview mode toggle
  const [previewMode, setPreviewMode] = useState(false);

  /**
   * Initialize form data when editing existing course
   */
  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        description: course.description || '',
        syllabus: course.syllabus || '',
        
        tags: course.tags || [],
        price: course.price || '',
        status: course.status || 'draft'
      });
    }
  }, [course, mode]);

  /**
   * Auto-generate slug from title for new courses
   */
  useEffect(() => {
    if (formData.title && mode === 'create') {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, mode]);

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Add a new tag to the course
   * @param {Event} e - Form submit event
   */
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  /**
   * Remove a tag from the course
   * @param {string} tagToRemove - Tag to remove from the list
   */
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Validate form data before submission
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Course slug is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }

    if (!formData.syllabus.trim()) {
      newErrors.syllabus = 'Course syllabus is required';
    }

    // Price validation
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Please enter a valid price';
    }

    // URL validations
    if (formData.videoDemoUrl && !isValidUrl(formData.videoDemoUrl)) {
      newErrors.videoDemoUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Check if a string is a valid URL
   * @param {string} string - String to validate
   * @returns {boolean} True if valid URL, false otherwise
   */
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  /**
   * Get course thumbnail URL for preview
   * @returns {string} Thumbnail URL
   */
  const getCourseThumbnail = () => {
    return `https://via.placeholder.com/400x225/8b5cf6/ffffff?text=${encodeURIComponent(formData.title.substring(0, 20) || 'Course')}`;
  };

  /**
   * Get status badge component
   * @param {string} status - Course status
   * @returns {JSX.Element} Status badge
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  /**
   * Prepare form data for API submission
   * Converts price to number and ensures proper data types
   * @param {Object} data - Raw form data
   * @returns {Object} Processed data ready for API
   */
  const prepareFormData = (data) => {
    const processedData = { ...data };
    
    // Convert price to number if it exists and is not empty
    if (processedData.price && processedData.price !== '') {
      processedData.price = parseFloat(processedData.price);
    } else {
      // Remove price field if empty (for free courses)
      delete processedData.price;
    }
    
    // Ensure tags is an array
    if (!Array.isArray(processedData.tags)) {
      processedData.tags = [];
    }
    
    // Remove empty videoDemoUrl
    if (!processedData.videoDemoUrl || processedData.videoDemoUrl.trim() === '') {
      delete processedData.videoDemoUrl;
    }
    
    return processedData;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data with proper types for API
      const apiData = prepareFormData(formData);
      
      let response;
      if (mode === 'edit' && course?.id) {
        // Update existing course
        response = await courseService.updateCourse(course.id, apiData);
        toast.success('Course updated successfully!');
      } else {
        // Create new course
        response = await courseService.createCourse(apiData);
        toast.success('Course created successfully!');
      }
      
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to save course');
      console.error('Save course error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save course as draft
   */
  const handleSaveAsDraft = async () => {
    const draftData = { ...formData, status: 'draft' };
    
    try {
      setLoading(true);
      
      // Prepare data with proper types for API
      const apiData = prepareFormData(draftData);
      
      let response;
      if (mode === 'edit' && course?.id) {
        response = await courseService.updateCourse(course.id, apiData);
      } else {
        response = await courseService.createCourse(apiData);
      }
      
      toast.success('Course saved as draft!');
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to save draft');
      console.error('Save draft error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Publish course
   */
  const handlePublish = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before publishing');
      return;
    }

    const publishData = { ...formData, status: 'published' };
    
    try {
      setLoading(true);
      
      // Prepare data with proper types for API
      const apiData = prepareFormData(publishData);
      
      let response;
      if (mode === 'edit' && course?.id) {
        response = await courseService.updateCourse(course.id, apiData);
      } else {
        response = await courseService.createCourse(apiData);
      }
      
      toast.success('Course published successfully!');
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to publish course');
      console.error('Publish course error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render preview mode
  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Preview Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(false)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5 mr-2" />
              Exit Preview
            </button>
            <span className="text-sm text-gray-500">Preview Mode</span>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Course Header */}
          <div className="aspect-video bg-gray-100 relative">
            <img 
              src={getCourseThumbnail()} 
              alt={formData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-full p-6">
                <Play className="h-16 w-16 text-purple-600" />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              {getStatusBadge(formData.status)}
            </div>
            <div className="absolute bottom-4 right-4">
              <span className="bg-white bg-opacity-90 text-gray-900 px-3 py-2 rounded-lg text-lg font-bold">
                {formatPrice(formData.price)}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">{formData.description}</p>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <h3>Course Syllabus</h3>
              <div className="whitespace-pre-wrap text-gray-700">
                {formData.syllabus}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render form mode
  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Course' : 'Create New Course'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'edit' ? 'Update your course information' : 'Create engaging learning experiences for your students'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter course title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Course Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Course Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="course-url-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.slug}
                </p>
              )}
            </div>

            {/* Course Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe what students will learn in this course..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Course Syllabus */}
            <div>
              <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-2">
                Course Syllabus *
              </label>
              <textarea
                id="syllabus"
                name="syllabus"
                rows={8}
                value={formData.syllabus}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.syllabus ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Module 1: Introduction&#10;Module 2: Advanced Topics&#10;Module 3: Projects..."
              />
              {errors.syllabus && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.syllabus}
                </p>
              )}
            </div>

            {/* Demo Video URL */}
            <div>
            
   
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Course Price */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing
              </h3>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="299.99"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.price}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Leave empty for free courses
              </p>
            </div>

            {/* Course Tags */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h3>
              
              {/* Add Tag Form */}
              <form onSubmit={handleAddTag} className="mb-3">
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add tag..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
              
              {/* Display Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Course Status */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Status
              </h3>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                {getStatusBadge(formData.status)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? 'Publishing...' : 'Publish Course'}
                </button>
              </div>
            </div>

            {/* Course Tips */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-medium text-purple-900 mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Course Creation Tips
              </h3>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>• Write clear, compelling course titles</li>
                <li>• Include detailed learning outcomes</li>
                <li>• Structure syllabus in logical modules</li>
                <li>• Add relevant tags for discoverability</li>
                <li>• Include demo video to showcase content</li>
                <li>• Price competitively based on value provided</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;