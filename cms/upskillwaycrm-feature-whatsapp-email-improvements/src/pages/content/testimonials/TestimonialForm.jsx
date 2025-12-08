/**
 * TestimonialForm Page Component
 *
 * This page component provides a comprehensive form for creating and editing testimonials.
 * It handles both create and edit modes with proper validation and API integration.
 *
 * Features:
 * - Create and edit modes with different UI states
 * - Comprehensive form validation for all fields
 * - Avatar URL validation and preview
 * - Video URL validation for testimonial videos
 * - Status management (Approved/Pending/Rejected)
 * - Rich text editing for testimonial content
 * - Responsive design with proper error handling
 *
 * API Integration:
 * - POST /api/v1/testimonials - Create new testimonial
 * - PUT /api/v1/testimonials/:id - Update existing testimonial
 * - GET /api/v1/testimonials/:id - Fetch testimonial for editing
 *
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <TestimonialForm />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  Star,
  User,
  MessageSquare,
  Video,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

// Testimonial API service for backend communication
import testimonialService from "../../../cms/services/testimonialService.js";

/**
 * TestimonialForm Component
 *
 * Main form component that handles testimonial creation and editing.
 * Supports both create and edit modes based on URL parameters.
 */
const TestimonialForm = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Testimonial ID from URL (for edit mode)

  // Determine if we're in edit mode based on presence of ID
  const isEditMode = Boolean(id);

  // Form state management
  const [formData, setFormData] = useState({
    authorName: "",
    role: "",
    text: "",
    avatarUrl: "",
    videoUrl: "",
    status: "pending",
  });

  // UI state management
  const [loading, setLoading] = useState(false); // Form submission loading
  const [fetchLoading, setFetchLoading] = useState(isEditMode); // Initial data loading
  const [errors, setErrors] = useState({}); // Form validation errors

  /**
   * Effect hook to fetch testimonial data when in edit mode
   * Only runs when component mounts and we have a testimonial ID
   */
  useEffect(() => {
    if (isEditMode && id) {
      fetchTestimonialData();
    }
  }, [id, isEditMode]);

  /**
   * Fetches testimonial data for editing
   *
   * API Endpoint: GET /api/v1/testimonials/:id
   *
   * @async
   * @function fetchTestimonialData
   */
  const fetchTestimonialData = async () => {
    try {
      setFetchLoading(true);
      console.log("Fetching testimonial data for ID:", id);

      // Call testimonial service to get testimonial by ID
      const response = await testimonialService.getTestimonialById(id);

      console.log("Fetch testimonial response:", response);

      if (response.success && response.data) {
        const testimonial = response.data;

        // Populate form with testimonial data
        setFormData({
          authorName: testimonial.authorName || "",
          role: testimonial.role || "",
          text: testimonial.text || "",
          avatarUrl: testimonial.avatarUrl || "",
          videoUrl: testimonial.videoUrl || "",
          status: testimonial.status || "pending",
        });
      } else {
        throw new Error(response.message || "Testimonial not found");
      }
    } catch (err) {
      console.error("Error fetching testimonial:", err);
      toast.error(err.message || "Failed to load testimonial data");
      navigate("/dashboard/content/testimonials"); // Redirect on error
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
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
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
    if (!formData.authorName.trim()) {
      newErrors.authorName = "Author name is required";
    }

    if (!formData.text.trim()) {
      newErrors.text = "Testimonial text is required";
    }

    // URL validations
    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = "Please enter a valid URL";
    }

    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Please enter a valid URL";
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
   * - POST /api/v1/testimonials (create mode)
   * - PUT /api/v1/testimonials/:id (edit mode)
   *
   * @param {Event} e - Form submit event
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);

      // Prepare testimonial data for API
      const testimonialData = {
        ...formData,
      };

      console.log("Submitting testimonial data:", testimonialData);

      let response;

      if (isEditMode) {
        // Update existing testimonial
        response = await testimonialService.updateTestimonial(
          id,
          testimonialData,
        );
        console.log("Update testimonial response:", response);
      } else {
        // Create new testimonial
        response = await testimonialService.createTestimonial(testimonialData);
        console.log("Create testimonial response:", response);
      }

      if (response.success) {
        const action = isEditMode ? "updated" : "created";
        toast.success(`Testimonial ${action} successfully!`);

        // Navigate to testimonial view or list
        if (response.data?.id) {
          navigate(`/dashboard/content/testimonials/${response.data.id}`);
        } else {
          navigate("/dashboard/content/testimonials");
        }
      } else {
        throw new Error(
          response.message ||
            `Failed to ${isEditMode ? "update" : "create"} testimonial`,
        );
      }
    } catch (err) {
      console.error("Error saving testimonial:", err);
      toast.error(
        err.message ||
          `Failed to ${isEditMode ? "update" : "create"} testimonial`,
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form cancellation and navigation back to testimonial list
   */
  const handleCancel = () => {
    navigate("/dashboard/content/testimonials");
  };

  // Show loading spinner while fetching testimonial data
  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading testimonial data...</span>
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
            Back to Testimonials
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Testimonial" : "Create New Testimonial"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update testimonial information and content"
                : "Add a new customer testimonial"}
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial Form */}
      <div className="bg-white rounded-lg shadow border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Author Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Author Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Author Name */}
              <div className="space-y-2">
                <label
                  htmlFor="authorName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Author Name *
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  value={formData.authorName}
                  onChange={handleChange}
                  placeholder="Enter author's full name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.authorName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.authorName && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.authorName}
                  </p>
                )}
              </div>

              {/* Author Role */}
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role/Position
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer, CEO, Student"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Avatar Image URL
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.avatarUrl ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.avatarUrl && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.avatarUrl}
                </p>
              )}

              {/* Avatar Preview */}
              {formData.avatarUrl && isValidUrl(formData.avatarUrl) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Avatar Preview:</p>
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Testimonial Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Testimonial Content
            </h3>

            {/* Testimonial Text */}
            <div className="space-y-2">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Testimonial Text *
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Enter the customer's testimonial or review..."
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  errors.text ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.text && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.text}
                </p>
              )}
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Media Content
            </h3>

            {/* Video URL */}
            <div className="space-y-2">
              <label
                htmlFor="videoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Video Testimonial URL
              </label>
              <input
                id="videoUrl"
                name="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://example.com/testimonial-video.mp4"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.videoUrl ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.videoUrl && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.videoUrl}
                </p>
              )}

              {/* Video Link Preview */}
              {formData.videoUrl && isValidUrl(formData.videoUrl) && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Video URL provided:
                  </p>
                  <a
                    href={formData.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Video
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Approval Status
            </h3>

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Testimonial Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <p className="text-xs text-gray-500">
                Set the approval status for this testimonial
              </p>
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
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Testimonial"
                : "Create Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialForm;
