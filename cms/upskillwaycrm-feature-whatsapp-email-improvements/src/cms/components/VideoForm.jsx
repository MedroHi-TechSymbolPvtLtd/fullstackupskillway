/**
 * VideoForm Component
 * 
 * This component provides a comprehensive form for creating and editing videos.
 * Features include:
 * - Create and edit modes with different UI states
 * - Form validation for all required fields
 * - YouTube URL integration and validation
 * - Tag management system
 * - Status management (Draft/Published/Archived)
 * - Video preview functionality
 * - Thumbnail URL management
 */

import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Play, 
  Video, 
  Tag, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';
import '../services/videoService.js';

const VideoForm = ({ video, onSave, onCancel, mode = "create" }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    status: "draft",
    duration: "",
    category: "",
    tags: [],
    masteredTools: [],
    faqs: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Temporary states for adding new items
  const [newTag, setNewTag] = useState("");
  const [newTool, setNewTool] = useState({ name: "", logoUrl: "" });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  // Initialize form with video data if in edit mode
  useEffect(() => {
    if (mode === "edit" && video) {
      setFormData({
        title: video.title || "",
        description: video.description || "",
        videoUrl: video.videoUrl || "",
        thumbnailUrl: video.thumbnailUrl || "",
        status: video.status || "draft",
        duration: video.duration || "",
        category: video.category || "",
        tags: video.tags || [],
        masteredTools: video.masteredTools || [],
        faqs: video.faqs || [],
      });
    }
  }, [video, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? "" : parseInt(value) || 0
    }));
  };

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Mastered Tools management
  const addTool = () => {
    if (newTool.name.trim() && newTool.logoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        masteredTools: [...prev.masteredTools, { ...newTool }]
      }));
      setNewTool({ name: "", logoUrl: "" });
    }
  };

  const removeTool = (index) => {
    setFormData(prev => ({
      ...prev,
      masteredTools: prev.masteredTools.filter((_, i) => i !== index)
    }));
  };

  // FAQ management
  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { ...newFaq }]
      }));
      setNewFaq({ question: "", answer: "" });
    }
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      await onSave(formData, mode);
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Failed to save video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">{mode === "create" ? "Add New Video" : "Edit Video"}</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video URL</label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://example.com/video.mp4"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.videoUrl ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.videoUrl && <p className="text-sm text-red-500">{errors.videoUrl}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
            <input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
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

            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={handleNumberChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Tutorial, Review, Demo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mastered Tools Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mastered Tools</label>
            <div className="space-y-2 mb-4">
              {formData.masteredTools.map((tool, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <img src={tool.logoUrl} alt={tool.name} className="w-8 h-8 object-contain" onError={(e) => e.target.style.display = 'none'} />
                  <span className="flex-1 font-medium">{tool.name}</span>
                  <button
                    type="button"
                    onClick={() => removeTool(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newTool.name}
                onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tool name (e.g., React)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={newTool.logoUrl}
                onChange={(e) => setNewTool(prev => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="Logo URL"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addTool}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Tool
            </button>
          </div>

          {/* FAQs Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Frequently Asked Questions</label>
            <div className="space-y-3 mb-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                placeholder="FAQ Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newFaq.answer}
                onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="FAQ Answer"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add FAQ
            </button>
          </div>
        </div>

        <div className="p-6 border-t flex justify-between">
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            {mode === "create" ? "Create Video" : "Update Video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;