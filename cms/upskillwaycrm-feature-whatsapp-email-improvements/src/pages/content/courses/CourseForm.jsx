/**
 * CourseForm Page Component
 * 
 * This page component provides a comprehensive form for creating and editing courses.
 * It handles both create and edit modes with proper validation and API integration.
 * 
 * Features:
 * - Create and edit modes with different UI states
 * - Comprehensive form validation for all fields
 * - Tag management with add/remove functionality
 * - Price handling with free/paid options
 * - Status management (Draft/Published/Archived)
 * - Rich text editing for course description and syllabus
 * - URL validation for video demo links
 * - Responsive design with proper error handling
 * 
 * API Integration:
 * - POST /api/v1/courses - Create new course
 * - PUT /api/v1/courses/:id - Update existing course
 * - GET /api/v1/courses/:id - Fetch course for editing
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <CourseForm />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  BookOpen, 
  DollarSign, 
  Play, 
  Tag, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

// Course API service for backend communication
import courseService from '../../../cms/services/courseService.js';

/**
 * CourseForm Component
 * 
 * Main form component that handles course creation and editing.
 * Supports both create and edit modes based on URL parameters.
 */
const CourseForm = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Course ID from URL (for edit mode)
  
  // Determine if we're in edit mode based on presence of ID
  const isEditMode = Boolean(id);
  
  // Form state management
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    syllabus: '',
    
    thumbnailUrl: '',
    bannerImageUrl: '',
    aboutSectionImageUrl: '',
    tags: [],
    price: '',
    programName: '',
    durationMonths: '',
    durationHours: '',
    deliveryModes: [],
    language: '',
    status: 'draft',
    masteredTools: [],
    curriculum: [],
    trainingOptions: [],
    projects: [],
    mentors: [],
    careerRoles: [],
    testimonials: [],
    faqs: [],
    relatedPrograms: []
  });
  
  // UI state management
  const [loading, setLoading] = useState(false); // Form submission loading
  const [fetchLoading, setFetchLoading] = useState(isEditMode); // Initial data loading
  const [errors, setErrors] = useState({}); // Form validation errors
  const [newTag, setNewTag] = useState(''); // New tag input value
  const [newDeliveryMode, setNewDeliveryMode] = useState(''); // New delivery mode input

  /**
   * Effect hook to fetch course data when in edit mode
   * Only runs when component mounts and we have a course ID
   */
  useEffect(() => {
    if (isEditMode && id) {
      fetchCourseData();
    }
  }, [id, isEditMode]);

  /**
   * Fetches course data for editing
   * 
   * API Endpoint: GET /api/v1/courses/:id
   * 
   * @async
   * @function fetchCourseData
   */
  const fetchCourseData = async () => {
    try {
      setFetchLoading(true);
      console.log('Fetching course data for ID:', id);
      
      // Call course service to get course by ID
      const response = await courseService.getCourseById(id);
      
      console.log('Fetch course response:', response);
      
      if (response.success && response.data) {
        const course = response.data;
        
        // Populate form with course data
        setFormData({
          title: course.title || '',
          slug: course.slug || '',
          description: course.description || '',
          shortDescription: course.shortDescription || '',
          syllabus: course.syllabus || '',
          
          thumbnailUrl: course.thumbnailUrl || '',
          bannerImageUrl: course.bannerImageUrl || '',
          aboutSectionImageUrl: course.aboutSectionImageUrl || '',
          tags: course.tags || [],
          price: course.price || '',
          programName: course.programName || '',
          durationMonths: course.durationMonths || '',
          durationHours: course.durationHours || '',
          deliveryModes: course.deliveryModes || [],
          language: course.language || '',
          status: course.status || 'draft',
          masteredTools: course.masteredTools || [],
          curriculum: course.curriculum || [],
          trainingOptions: course.trainingOptions || [],
          projects: course.projects || [],
          mentors: course.mentors || [],
          careerRoles: course.careerRoles || [],
          testimonials: course.testimonials || [],
          faqs: course.faqs || [],
          relatedPrograms: course.relatedPrograms || []
        });
      } else {
        throw new Error(response.message || 'Course not found');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      toast.error(err.message || 'Failed to load course data');
      navigate('/dashboard/content/courses'); // Redirect on error
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
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Handles tag input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleTagChange = (e) => {
    setNewTag(e.target.value);
  };

  /**
   * Adds a new tag to the course
   * Validates tag format and prevents duplicates
   * 
   * @param {Event} e - Form submit event or button click
   */
  const addTag = (e) => {
    e.preventDefault();
    
    const tag = newTag.trim().toLowerCase();
    
    // Validate tag
    if (!tag) {
      toast.error('Please enter a tag');
      return;
    }
    
    if (formData.tags.includes(tag)) {
      toast.error('Tag already exists');
      return;
    }
    
    if (formData.tags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
      return;
    }
    
    // Add tag to form data
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
    
    // Clear tag input
    setNewTag('');
  };

  /**
   * Removes a tag from the course
   * 
   * @param {string} tagToRemove - Tag to remove
   */
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Adds a delivery mode to the course
   */
  const addDeliveryMode = (e) => {
    e.preventDefault();
    const mode = newDeliveryMode.trim();
    if (!mode) {
      toast.error('Please enter a delivery mode');
      return;
    }
    if (formData.deliveryModes.includes(mode)) {
      toast.error('Delivery mode already exists');
      return;
    }
    setFormData(prev => ({
      ...prev,
      deliveryModes: [...prev.deliveryModes, mode]
    }));
    setNewDeliveryMode('');
  };

  /**
   * Removes a delivery mode from the course
   */
  const removeDeliveryMode = (modeToRemove) => {
    setFormData(prev => ({
      ...prev,
      deliveryModes: prev.deliveryModes.filter(mode => mode !== modeToRemove)
    }));
  };

  /**
   * Adds a mastered tool
   */
  const addMasteredTool = () => {
    setFormData(prev => ({
      ...prev,
      masteredTools: [...prev.masteredTools, { name: '', logoUrl: '' }]
    }));
  };

  /**
   * Updates a mastered tool
   */
  const updateMasteredTool = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.masteredTools];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, masteredTools: updated };
    });
  };

  /**
   * Removes a mastered tool
   */
  const removeMasteredTool = (index) => {
    setFormData(prev => ({
      ...prev,
      masteredTools: prev.masteredTools.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds a curriculum module
   */
  const addCurriculumModule = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { moduleTitle: '', topics: [] }]
    }));
  };

  /**
   * Updates a curriculum module
   */
  const updateCurriculumModule = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.curriculum];
      if (field === 'topics') {
        updated[index] = { ...updated[index], topics: value.split(',').map(t => t.trim()).filter(Boolean) };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, curriculum: updated };
    });
  };

  /**
   * Removes a curriculum module
   */
  const removeCurriculumModule = (index) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds a training option
   */
  const addTrainingOption = () => {
    setFormData(prev => ({
      ...prev,
      trainingOptions: [...prev.trainingOptions, { name: '', price: 0, currency: 'INR', descriptionPoints: [] }]
    }));
  };

  /**
   * Updates a training option
   */
  const updateTrainingOption = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.trainingOptions];
      if (field === 'descriptionPoints') {
        updated[index] = { ...updated[index], descriptionPoints: value.split(',').map(t => t.trim()).filter(Boolean) };
      } else if (field === 'price') {
        updated[index] = { ...updated[index], price: parseFloat(value) || 0 };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, trainingOptions: updated };
    });
  };

  /**
   * Removes a training option
   */
  const removeTrainingOption = (index) => {
    setFormData(prev => ({
      ...prev,
      trainingOptions: prev.trainingOptions.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds a project
   */
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', imageUrl: '', description: '' }]
    }));
  };

  /**
   * Updates a project
   */
  const updateProject = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  /**
   * Removes a project
   */
  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds a mentor
   */
  const addMentor = () => {
    setFormData(prev => ({
      ...prev,
      mentors: [...prev.mentors, { name: '', title: '', imageUrl: '', bio: '' }]
    }));
  };

  /**
   * Updates a mentor
   */
  const updateMentor = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.mentors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, mentors: updated };
    });
  };

  /**
   * Removes a mentor
   */
  const removeMentor = (index) => {
    setFormData(prev => ({
      ...prev,
      mentors: prev.mentors.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds a career role
   */
  const addCareerRole = () => {
    setFormData(prev => ({
      ...prev,
      careerRoles: [...prev.careerRoles, { title: '', description: '' }]
    }));
  };

  /**
   * Updates a career role
   */
  const updateCareerRole = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.careerRoles];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, careerRoles: updated };
    });
  };

  /**
   * Removes a career role
   */
  const removeCareerRole = (index) => {
    setFormData(prev => ({
      ...prev,
      careerRoles: prev.careerRoles.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds a testimonial
   */
  const addTestimonial = () => {
    setFormData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { studentName: '', studentRole: '', testimonialText: '', rating: 5, studentImageUrl: '' }]
    }));
  };

  /**
   * Updates a testimonial
   */
  const updateTestimonial = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.testimonials];
      if (field === 'rating') {
        updated[index] = { ...updated[index], rating: parseFloat(value) || 5 };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, testimonials: updated };
    });
  };

  /**
   * Removes a testimonial
   */
  const removeTestimonial = (index) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds an FAQ
   */
  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  /**
   * Updates an FAQ
   */
  const updateFAQ = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  /**
   * Removes an FAQ
   */
  const removeFAQ = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  /**
   * Adds a related program
   */
  const addRelatedProgram = () => {
    setFormData(prev => ({
      ...prev,
      relatedPrograms: [...prev.relatedPrograms, { title: '', imageUrl: '', duration: '', price: '', slug: '' }]
    }));
  };

  /**
   * Updates a related program
   */
  const updateRelatedProgram = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.relatedPrograms];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, relatedPrograms: updated };
    });
  };

  /**
   * Removes a related program
   */
  const removeRelatedProgram = (index) => {
    setFormData(prev => ({
      ...prev,
      relatedPrograms: prev.relatedPrograms.filter((_, i) => i !== index)
    }));
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
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }
    
    if (!formData.syllabus.trim()) {
      newErrors.syllabus = 'Course syllabus is required';
    }
    
    // URL validations
    if (formData.videoDemoUrl && !isValidUrl(formData.videoDemoUrl)) {
      newErrors.videoDemoUrl = 'Please enter a valid URL';
    }
    
    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = 'Please enter a valid URL';
    }
    
    // Price validation
    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validates URL format
   * 
   * @param {string} url - URL to validate
   * @returns {boolean} URL validity
   */
  const isValidUrl = (url) => {
    if (!url) return true; // Empty URL is valid (optional field)
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Handles form submission for both create and edit modes
   * 
   * API Endpoints:
   * - POST /api/v1/courses (create mode)
   * - PUT /api/v1/courses/:id (edit mode)
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
      
      // Prepare course data for API
      const courseData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        durationMonths: formData.durationMonths ? parseInt(formData.durationMonths) : undefined,
        durationHours: formData.durationHours ? parseInt(formData.durationHours) : undefined,
        tags: formData.tags.length > 0 ? formData.tags : [],
        deliveryModes: formData.deliveryModes.length > 0 ? formData.deliveryModes : [],
        masteredTools: formData.masteredTools.filter(tool => tool.name.trim() !== ''),
        curriculum: formData.curriculum.filter(module => module.moduleTitle.trim() !== ''),
        trainingOptions: formData.trainingOptions.filter(option => option.name.trim() !== ''),
        projects: formData.projects.filter(project => project.title.trim() !== ''),
        mentors: formData.mentors.filter(mentor => mentor.name.trim() !== ''),
        careerRoles: formData.careerRoles.filter(role => role.title.trim() !== ''),
        testimonials: formData.testimonials.filter(testimonial => testimonial.studentName.trim() !== ''),
        faqs: formData.faqs.filter(faq => faq.question.trim() !== ''),
        relatedPrograms: formData.relatedPrograms.filter(program => program.title.trim() !== '')
      };
      
      console.log('Submitting course data:', courseData);
      
      let response;
      
      if (isEditMode) {
        // Update existing course
        response = await courseService.updateCourse(id, courseData);
        console.log('Update course response:', response);
      } else {
        // Create new course
        response = await courseService.createCourse(courseData);
        console.log('Create course response:', response);
      }
      
      if (response.success) {
        const action = isEditMode ? 'updated' : 'created';
        toast.success(`Course ${action} successfully!`);
        
        // Navigate to course view or list
        if (response.data?.id) {
          navigate(`/dashboard/content/courses/${response.data.id}`);
        } else {
          navigate('/dashboard/content/courses');
        }
      } else {
        throw new Error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} course`);
      }
    } catch (err) {
      console.error('Error saving course:', err);
      toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} course`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form cancellation and navigation back to course list
   */
  const handleCancel = () => {
    navigate('/dashboard/content/courses');
  };

  // Show loading spinner while fetching course data
  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading course data...</span>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update course information and content' : 'Add a new course to your catalog'}
            </p>
          </div>
        </div>
      </div>

      {/* Course Form */}
      <div className="bg-white rounded-lg shadow border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Basic Information
            </h3>
            
            {/* Course Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Course Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              {/* Course Slug */}
              <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Course Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="course-url-slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">Auto-generated from title, but you can customize it</p>
              </div>
            </div>
            
            {/* Short Description */}
            <div className="space-y-2">
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief description (max 500 characters)"
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
              <p className="text-xs text-gray-500">{formData.shortDescription.length}/500 characters</p>
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course"
                rows={4}
                maxLength={1000}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-500">{formData.description.length}/1000 characters</p>
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
            
            {/* Course Syllabus */}
            <div className="space-y-2">
              <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700">
                Course Syllabus *
              </label>
              <textarea
                id="syllabus"
                name="syllabus"
                value={formData.syllabus}
                onChange={handleChange}
                placeholder="Module 1: Introduction&#10;Module 2: Advanced Topics&#10;Module 3: Practical Applications"
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  errors.syllabus ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.syllabus && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.syllabus}
                </p>
              )}
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Media & Resources
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Video Demo URL */}
              <div className="space-y-2">
                <label htmlFor="videoDemoUrl" className="block text-sm font-medium text-gray-700">
                  Video Demo URL
                </label>
                <input
                  id="videoDemoUrl"
                  name="videoDemoUrl"
                  type="url"
                  value={formData.videoDemoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.videoDemoUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.videoDemoUrl && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.videoDemoUrl}
                  </p>
                )}
              </div>
              
              {/* Thumbnail URL */}
              <div className="space-y-2">
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">
                  Thumbnail Image URL
                </label>
                <input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.thumbnailUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.thumbnailUrl && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.thumbnailUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Banner Image URL */}
            <div className="space-y-2">
              <label htmlFor="bannerImageUrl" className="block text-sm font-medium text-gray-700">
                Banner Image URL
              </label>
              <input
                id="bannerImageUrl"
                name="bannerImageUrl"
                type="url"
                value={formData.bannerImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* About Section Image URL */}
            <div className="space-y-2">
              <label htmlFor="aboutSectionImageUrl" className="block text-sm font-medium text-gray-700">
                About Section Image URL
              </label>
              <input
                id="aboutSectionImageUrl"
                name="aboutSectionImageUrl"
                type="url"
                value={formData.aboutSectionImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/about-image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Tags & Categories
            </h3>
            
            {/* Add New Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={handleTagChange}
                placeholder="Add a tag (e.g., javascript, web-development)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {/* Display Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing & Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course Price */}
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Course Price (USD)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00 (Leave empty for free)"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
                <p className="text-xs text-gray-500">Leave empty or set to 0 for free courses</p>
              </div>
              
              {/* Course Status */}
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Course Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Program Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Program Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="programName" className="block text-sm font-medium text-gray-700">
                  Program Name
                </label>
                <input
                  id="programName"
                  name="programName"
                  type="text"
                  value={formData.programName}
                  onChange={handleChange}
                  placeholder="e.g., Full Stack Developer Program"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <input
                  id="language"
                  name="language"
                  type="text"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g., English"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700">
                  Duration (Months)
                </label>
                <input
                  id="durationMonths"
                  name="durationMonths"
                  type="number"
                  min="0"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  placeholder="e.g., 6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="durationHours" className="block text-sm font-medium text-gray-700">
                  Duration (Hours)
                </label>
                <input
                  id="durationHours"
                  name="durationHours"
                  type="number"
                  min="0"
                  value={formData.durationHours}
                  onChange={handleChange}
                  placeholder="e.g., 480"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Modes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Modes</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDeliveryMode}
                onChange={(e) => setNewDeliveryMode(e.target.value)}
                placeholder="Add delivery mode (e.g., Online Bootcamp)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addDeliveryMode(e)}
              />
              <button
                type="button"
                onClick={addDeliveryMode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.deliveryModes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.deliveryModes.map((mode, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {mode}
                    <button
                      type="button"
                      onClick={() => removeDeliveryMode(mode)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mastered Tools Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Mastered Tools</h3>
              <button
                type="button"
                onClick={addMasteredTool}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tool
              </button>
            </div>
            {formData.masteredTools.map((tool, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Tool {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeMasteredTool(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tool name"
                    value={tool.name}
                    onChange={(e) => updateMasteredTool(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="Logo URL"
                    value={tool.logoUrl}
                    onChange={(e) => updateMasteredTool(index, 'logoUrl', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Curriculum Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Curriculum Modules</h3>
              <button
                type="button"
                onClick={addCurriculumModule}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Module
              </button>
            </div>
            {formData.curriculum.map((module, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Module {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCurriculumModule(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Module title"
                  value={module.moduleTitle}
                  onChange={(e) => updateCurriculumModule(index, 'moduleTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Topics (comma-separated)"
                  value={module.topics?.join(', ') || ''}
                  onChange={(e) => updateCurriculumModule(index, 'topics', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Training Options Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Training Options</h3>
              <button
                type="button"
                onClick={addTrainingOption}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </button>
            </div>
            {formData.trainingOptions.map((option, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Option {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTrainingOption(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Option name"
                    value={option.name}
                    onChange={(e) => updateTrainingOption(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={option.price}
                    onChange={(e) => updateTrainingOption(index, 'price', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Currency (e.g., INR)"
                    value={option.currency}
                    onChange={(e) => updateTrainingOption(index, 'currency', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Description points (comma-separated)"
                  value={option.descriptionPoints?.join(', ') || ''}
                  onChange={(e) => updateTrainingOption(index, 'descriptionPoints', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              <button
                type="button"
                onClick={addProject}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </button>
            </div>
            {formData.projects.map((project, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Project {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Project title"
                  value={project.title}
                  onChange={(e) => updateProject(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={project.imageUrl}
                  onChange={(e) => updateProject(index, 'imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Project description"
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Mentors Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Mentors</h3>
              <button
                type="button"
                onClick={addMentor}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Mentor
              </button>
            </div>
            {formData.mentors.map((mentor, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Mentor {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeMentor(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={mentor.name}
                    onChange={(e) => updateMentor(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={mentor.title}
                    onChange={(e) => updateMentor(index, 'title', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={mentor.imageUrl}
                  onChange={(e) => updateMentor(index, 'imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Bio"
                  value={mentor.bio}
                  onChange={(e) => updateMentor(index, 'bio', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Career Roles Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Career Roles</h3>
              <button
                type="button"
                onClick={addCareerRole}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Role
              </button>
            </div>
            {formData.careerRoles.map((role, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Role {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCareerRole(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Role title"
                  value={role.title}
                  onChange={(e) => updateCareerRole(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Role description"
                  value={role.description}
                  onChange={(e) => updateCareerRole(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Testimonials</h3>
              <button
                type="button"
                onClick={addTestimonial}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Testimonial
              </button>
            </div>
            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Testimonial {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Student name"
                    value={testimonial.studentName}
                    onChange={(e) => updateTestimonial(index, 'studentName', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Student role"
                    value={testimonial.studentRole}
                    onChange={(e) => updateTestimonial(index, 'studentRole', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Testimonial text"
                  value={testimonial.testimonialText}
                  onChange={(e) => updateTestimonial(index, 'testimonialText', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="Rating (0-5)"
                    value={testimonial.rating}
                    onChange={(e) => updateTestimonial(index, 'rating', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="Student image URL"
                    value={testimonial.studentImageUrl}
                    onChange={(e) => updateTestimonial(index, 'studentImageUrl', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* FAQs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
              <button
                type="button"
                onClick={addFAQ}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add FAQ
              </button>
            </div>
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">FAQ {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Related Programs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Related Programs</h3>
              <button
                type="button"
                onClick={addRelatedProgram}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Program
              </button>
            </div>
            {formData.relatedPrograms.map((program, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Program {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeRelatedProgram(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Program title"
                  value={program.title}
                  onChange={(e) => updateRelatedProgram(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={program.imageUrl}
                    onChange={(e) => updateRelatedProgram(index, 'imageUrl', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={program.duration}
                    onChange={(e) => updateRelatedProgram(index, 'duration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Price"
                    value={program.price}
                    onChange={(e) => updateRelatedProgram(index, 'price', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Slug"
                    value={program.slug}
                    onChange={(e) => updateRelatedProgram(index, 'slug', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
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
              {loading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;