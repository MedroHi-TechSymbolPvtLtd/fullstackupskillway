/**
 * VideoForm Page Component
 *
 * This page component provides a comprehensive form for creating and editing videos.
 * It handles both create and edit modes with proper validation and API integration.
 *
 * Features:
 * - Create and edit modes with different UI states
 * - Comprehensive form validation for all fields
 * - Tag management with add/remove functionality
 * - YouTube URL validation and preview
 * - Status management (Draft/Published/Archived)
 * - Rich text editing for video descriptions
 * - Responsive design with proper error handling
 *
 * API Integration:
 * - POST /api/v1/videos - Create new video
 * - PUT /api/v1/videos/:id - Update existing video
 * - GET /api/v1/videos/:id - Fetch video for editing
 *
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <VideoForm />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  Plus,
  Trash2,
  Video,
  Play,
  Tag,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

// Video API service for backend communication
import videoService from "../../../cms/services/videoService.js";

/**
 * VideoForm Component
 *
 * Main form component that handles video creation and editing.
 * Supports both create and edit modes based on URL parameters.
 */
const VideoForm = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Video ID from URL (for edit mode)

  // Determine if we're in edit mode based on presence of ID
  const isEditMode = Boolean(id);

  // Form state management
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    videoUrl: "",
    testimonial: "",
    tags: [],
    masteredTools: [],
    faqs: [],
    status: "draft",
  });

  // UI state management
  const [loading, setLoading] = useState(false); // Form submission loading
  const [fetchLoading, setFetchLoading] = useState(isEditMode); // Initial data loading
  const [errors, setErrors] = useState({}); // Form validation errors
  const [newTag, setNewTag] = useState(""); // New tag input value
  const [newTool, setNewTool] = useState({ name: "", logoUrl: "" }); // New tool input
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" }); // New FAQ input

  /**
   * Fetches video data for editing
   *
   * API Endpoint: GET /api/v1/videos/:id
   *
   * @async
   * @function fetchVideoData
   */
  const fetchVideoData = useCallback(async () => {
    try {
      setFetchLoading(true);
      console.log("Fetching video data for ID:", id);

      // Call video service to get video by ID
      const response = await videoService.getVideoById(id);

      console.log("Fetch video response:", response);

      if (response.success && response.data) {
        const video = response.data;

        // Populate form with video data
        setFormData({
          title: video.title || "",
          slug: video.slug || "",
          description: video.description || "",
          videoUrl: video.videoUrl || "",
          testimonial: video.testimonial || "",
          tags: video.tags || [],
          masteredTools: video.masteredTools || [],
          faqs: video.faqs || [],
          status: video.status || "draft",
        });
      } else {
        throw new Error(response.message || "Video not found");
      }
    } catch (err) {
      console.error("Error fetching video:", err);
      toast.error(err.message || "Failed to load video data");
      navigate("/dashboard/content/videos"); // Redirect on error
    } finally {
      setFetchLoading(false);
    }
  }, [id, navigate]);

  /**
   * Effect hook to fetch video data when in edit mode
   * Only runs when component mounts and we have a video ID
   */
  useEffect(() => {
    if (isEditMode && id) {
      fetchVideoData();
    }
  }, [id, isEditMode, fetchVideoData]);

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

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim();

      setFormData((prev) => ({ ...prev, slug }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
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
   * Adds a new tag to the video
   * Validates tag format and prevents duplicates
   *
   * @param {Event} e - Form submit event or button click
   */
  const addTag = (e) => {
    e.preventDefault();

    const tag = newTag.trim().toLowerCase();

    // Validate tag
    if (!tag) {
      toast.error("Please enter a tag");
      return;
    }

    if (formData.tags.includes(tag)) {
      toast.error("Tag already exists");
      return;
    }

    if (formData.tags.length >= 10) {
      toast.error("Maximum 10 tags allowed");
      return;
    }

    // Add tag to form data
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    // Clear tag input
    setNewTag("");
  };

  /**
   * Removes a tag from the video
   *
   * @param {string} tagToRemove - Tag to remove
   */
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  /**
   * Adds a new mastered tool to the video
   *
   * @param {Event} e - Form submit event or button click
   */
  const addTool = (e) => {
    e.preventDefault();

    const { name, logoUrl } = newTool;

    // Validate tool
    if (!name.trim()) {
      toast.error("Please enter a tool name");
      return;
    }

    if (!logoUrl.trim()) {
      toast.error("Please enter a logo URL");
      return;
    }

    // Add tool to form data
    setFormData((prev) => ({
      ...prev,
      masteredTools: [
        ...prev.masteredTools,
        { name: name.trim(), logoUrl: logoUrl.trim() },
      ],
    }));

    // Clear tool inputs
    setNewTool({ name: "", logoUrl: "" });
  };

  /**
   * Removes a mastered tool from the video
   *
   * @param {number} index - Index of tool to remove
   */
  const removeTool = (index) => {
    setFormData((prev) => ({
      ...prev,
      masteredTools: prev.masteredTools.filter((_, i) => i !== index),
    }));
  };

  /**
   * Adds a new FAQ to the video
   *
   * @param {Event} e - Form submit event or button click
   */
  const addFaq = (e) => {
    e.preventDefault();

    const { question, answer } = newFaq;

    // Validate FAQ
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    // Add FAQ to form data
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { question: question.trim(), answer: answer.trim() },
      ],
    }));

    // Clear FAQ inputs
    setNewFaq({ question: "", answer: "" });
  };

  /**
   * Removes an FAQ from the video
   *
   * @param {number} index - Index of FAQ to remove
   */
  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
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
      newErrors.title = "Video title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Video description is required";
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    } else if (!isValidVideoUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Please enter a valid YouTube URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validates YouTube URL format
   *
   * @param {string} url - URL to validate
   * @returns {boolean} URL validity
   */
  const isValidVideoUrl = (url) => {
    if (!url) return false;
    // Check for YouTube URL patterns
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  /**
   * Gets YouTube video ID from URL
   *
   * @param {string} url - YouTube URL
   * @returns {string|null} Video ID or null
   */
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    );
    return match ? match[1] : null;
  };

  /**
   * Gets YouTube thumbnail URL for preview
   *
   * @param {string} videoUrl - YouTube video URL
   * @returns {string|null} Thumbnail URL or null
   */
  const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : null;
  };

  /**
   * Handles form submission for both create and edit modes
   *
   * API Endpoints:
   * - POST /api/v1/videos (create mode)
   * - PUT /api/v1/videos/:id (edit mode)
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

      // Prepare video data for API
      const videoData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : [],
      };

      console.log("Submitting video data:", videoData);

      let response;

      if (isEditMode) {
        // Update existing video
        response = await videoService.updateVideo(id, videoData);
        console.log("Update video response:", response);
      } else {
        // Create new video
        response = await videoService.createVideo(videoData);
        console.log("Create video response:", response);
      }

      if (response.success) {
        const action = isEditMode ? "updated" : "created";
        toast.success(`Video ${action} successfully!`);

        // Navigate to video view or list
        if (response.data?.id) {
          navigate(`/dashboard/content/videos/${response.data.id}`);
        } else {
          navigate("/dashboard/content/videos");
        }
      } else {
        throw new Error(
          response.message ||
            `Failed to ${isEditMode ? "update" : "create"} video`,
        );
      }
    } catch (err) {
      console.error("Error saving video:", err);
      toast.error(
        err.message || `Failed to ${isEditMode ? "update" : "create"} video`,
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form cancellation and navigation back to video list
   */
  const handleCancel = () => {
    navigate("/dashboard/content/videos");
  };

  // Show loading spinner while fetching video data
  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading video data...</span>
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
            Back to Videos
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Video" : "Create New Video"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update video information and content"
                : "Add a new video to your catalog"}
            </p>
          </div>
        </div>
      </div>

      {/* Video Form */}
      <div className="bg-white rounded-lg shadow border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Basic Information
            </h3>

            {/* Video Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Video Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter video title"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Video Slug */}
              <div className="space-y-2">
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700"
                >
                  Video Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="video-url-slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Auto-generated from title, but you can customize it
                </p>
              </div>
            </div>

            {/* Video Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Video Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what viewers will learn from this video"
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Testimonial */}
            <div className="space-y-2">
              <label
                htmlFor="testimonial"
                className="block text-sm font-medium text-gray-700"
              >
                Student Testimonial
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="Add a testimonial from a student who completed this course (e.g., 'This course helped me transition from web design to fullstack development in just 5 months...')"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
              <p className="text-xs text-gray-500">
                Optional: Add a success story or feedback from a student
              </p>
            </div>
          </div>

          {/* Video URL Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Video Content
            </h3>

            {/* Video URL */}
            <div className="space-y-2">
              <label
                htmlFor="videoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                YouTube Video URL *
              </label>
              <input
                id="videoUrl"
                name="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
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

              {/* Video Preview */}
              {formData.videoUrl && isValidVideoUrl(formData.videoUrl) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Video Preview
                  </h4>
                  <div className="flex items-center space-x-4">
                    {getYouTubeThumbnail(formData.videoUrl) && (
                      <img
                        src={getYouTubeThumbnail(formData.videoUrl)}
                        alt="Video thumbnail"
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">
                        Valid YouTube URL detected
                      </p>
                      <a
                        href={formData.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              )}
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
                placeholder="Add a tag (e.g., tutorial, javascript, web-development)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && addTag(e)}
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

          {/* Mastered Tools Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Mastered Tools
            </h3>
            <p className="text-sm text-gray-600">
              Add the tools and technologies covered in this video
            </p>

            {/* Add New Tool */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newTool.name}
                onChange={(e) =>
                  setNewTool((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Tool name (e.g., React, Node.js)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={newTool.logoUrl}
                onChange={(e) =>
                  setNewTool((prev) => ({ ...prev, logoUrl: e.target.value }))
                }
                placeholder="Logo URL (e.g., https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addTool}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </button>

            {/* Display Tools */}
            {formData.masteredTools.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.masteredTools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <img
                      src={tool.logoUrl}
                      alt={tool.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className="flex-1 font-medium text-gray-900">
                      {tool.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTool(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAQs Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-gray-600">
              Add common questions and answers about this video
            </p>

            {/* Add New FAQ */}
            <div className="space-y-2">
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) =>
                  setNewFaq((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Question (e.g., What prerequisites do I need?)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newFaq.answer}
                onChange={(e) =>
                  setNewFaq((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="Answer"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </button>

            {/* Display FAQs */}
            {formData.faqs.length > 0 && (
              <div className="space-y-3">
                {formData.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {faq.question}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Publication Status
            </h3>

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Video Status
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
                ? "Update Video"
                : "Create Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoForm;
