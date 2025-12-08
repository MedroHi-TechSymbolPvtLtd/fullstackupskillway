import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  Upload, 
  Tag, 
  Calendar,
  FileText,
  Video as VideoIcon,
  AlertCircle,
  Play,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import videoService from '../services/videoService.js';
import mediaUtils from '../utils/mediaUtils.js';

const VideoForm = ({ video, onSave, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    videoUrl: '',
    tags: [],
    status: 'draft'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (video && mode === 'edit') {
      setFormData({
        title: video.title || '',
        slug: video.slug || '',
        description: video.description || '',
        videoUrl: video.videoUrl || '',
        tags: video.tags || [],
        status: video.status || 'draft'
      });
    }
  }, [video, mode]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && mode === 'create') {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getVideoThumbnail = (videoUrl) => {
    return mediaUtils.getYouTubeThumbnail(videoUrl, 'medium');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setLoading(true);
      
      let response;
      if (mode === 'edit' && video?.id) {
        response = await videoService.updateVideo(video.id, formData);
        toast.success('Video updated successfully!');
      } else {
        response = await videoService.createVideo(formData);
        toast.success('Video created successfully!');
      }
      
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to save video');
      console.error('Save video error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const draftData = { ...formData, status: 'draft' };
    setFormData(draftData);
    
    try {
      setLoading(true);
      
      let response;
      if (mode === 'edit' && video?.id) {
        response = await videoService.updateVideo(video.id, draftData);
      } else {
        response = await videoService.createVideo(draftData);
      }
      
      toast.success('Video saved as draft!');
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to save draft');
      console.error('Save draft error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before publishing');
      return;
    }

    const publishData = { ...formData, status: 'published' };
    setFormData(publishData);
    
    try {
      setLoading(true);
      
      let response;
      if (mode === 'edit' && video?.id) {
        response = await videoService.updateVideo(video.id, publishData);
      } else {
        response = await videoService.createVideo(publishData);
      }
      
      toast.success('Video published successfully!');
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to publish video');
      console.error('Publish video error:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Video Thumbnail/Player */}
          <div className="aspect-video bg-gray-100 relative">
            <img 
              src={getVideoThumbnail(formData.videoUrl)} 
              alt={formData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-full p-4">
                <Play className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            {formData.videoUrl && (
              <a
                href={formData.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-lg hover:bg-opacity-100 transition-all"
              >
                <ExternalLink className="h-4 w-4 text-gray-700" />
              </a>
            )}
          </div>
          
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">{formData.description}</p>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Video' : 'Create New Video'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'edit' ? 'Update your video content' : 'Share engaging video content with your audience'}
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter video title..."
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
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="video-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.slug}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your video content..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
              {formData.videoUrl && !errors.videoUrl && (
                <div className="mt-3">
                  <img 
                    src={getVideoThumbnail(formData.videoUrl)} 
                    alt="Video preview" 
                    className="w-full max-w-sm h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h3>
              <form onSubmit={handleAddTag} className="mb-3">
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add tag..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Status
              </h3>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Actions */}
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
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;