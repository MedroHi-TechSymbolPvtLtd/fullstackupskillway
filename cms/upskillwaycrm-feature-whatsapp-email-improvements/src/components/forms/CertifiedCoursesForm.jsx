import { useState, useEffect } from 'react';
import { Save, X, Plus, BookOpen, DollarSign, Video, FileText, Award } from 'lucide-react';

const CertifiedCoursesForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    landingCardImageUrl: '',
    badgeLabel: '',
    price: '',
    originalPrice: '',
    instructor: '',
    profileImageUrl: '',
    averageRating: 0,
    landingShortText: '',
    description: '',
    syllabus: '',
    videoDemoUrl: '',
    tags: [],
    status: 'published',
    ...initialData
  });
  
  const [tagInput, setTagInput] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEdit]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        landingCardImageUrl: initialData.landingCardImageUrl || '',
        badgeLabel: initialData.badgeLabel || '',
        price: initialData.price || '',
        originalPrice: initialData.originalPrice || '',
        instructor: initialData.instructor || '',
        profileImageUrl: initialData.profileImageUrl || '',
        averageRating: initialData.averageRating || 0,
        landingShortText: initialData.landingShortText || '',
        description: initialData.description || '',
        syllabus: initialData.syllabus || '',
        videoDemoUrl: initialData.videoDemoUrl || '',
        tags: initialData.tags || [],
        status: initialData.status || 'published',
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numbers for API
    const submitData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || 0,
      averageRating: parseFloat(formData.averageRating) || 0,
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          <Award className="inline w-4 h-4 mr-1" />
          Certification Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Full Stack Web Development Certification"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
          URL Slug *
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="fullstack-certification-2024"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          URL-friendly version of the title (auto-generated)
        </p>
      </div>

      {/* Landing Card Image URL */}
      <div>
        <label htmlFor="landingCardImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Landing Card Image URL *
        </label>
        <input
          type="url"
          id="landingCardImageUrl"
          name="landingCardImageUrl"
          value={formData.landingCardImageUrl}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://www.bing.com/..."
          required
        />
        {formData.landingCardImageUrl && (
          <img 
            src={formData.landingCardImageUrl} 
            alt="Preview" 
            className="mt-2 w-32 h-20 object-cover rounded-lg border"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </div>

      {/* Badge Label & Landing Short Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="badgeLabel" className="block text-sm font-medium text-gray-700 mb-2">
            Badge Label *
          </label>
          <input
            type="text"
            id="badgeLabel"
            name="badgeLabel"
            value={formData.badgeLabel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Design"
            required
          />
        </div>
        <div>
          <label htmlFor="landingShortText" className="block text-sm font-medium text-gray-700 mb-2">
            Landing Short Text *
          </label>
          <input
            type="text"
            id="landingShortText"
            name="landingShortText"
            value={formData.landingShortText}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Master graphic design from scratch..."
            required
          />
        </div>
      </div>

      {/* Instructor Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
            Instructor Name *
          </label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Wilson"
            required
          />
        </div>
        <div>
          <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Instructor Profile Image URL
          </label>
          <input
            type="url"
            id="profileImageUrl"
            name="profileImageUrl"
            value={formData.profileImageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/images/wilson-profile.jpg"
          />
        </div>
      </div>

      {/* Pricing & Rating */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Price (USD) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2000"
            required
          />
        </div>
        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Original Price (USD)
          </label>
          <input
            type="number"
            id="originalPrice"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1999"
          />
        </div>
        <div>
          <label htmlFor="averageRating" className="block text-sm font-medium text-gray-700 mb-2">
            Average Rating (0-5)
          </label>
          <input
            type="number"
            id="averageRating"
            name="averageRating"
            value={formData.averageRating}
            onChange={handleInputChange}
            step="0.1"
            min="0"
            max="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="3.5"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline w-4 h-4 mr-1" />
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the certification program and what students will achieve..."
          required
        />
      </div>

      {/* Syllabus */}
      <div>
        <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-2">
          Certification Syllabus *
        </label>
        <textarea
          id="syllabus"
          name="syllabus"
          value={formData.syllabus}
          onChange={handleInputChange}
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Phase 1: Foundation&#10;Phase 2: Advanced Topics&#10;Phase 3: Projects&#10;Phase 4: Certification"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          List the certification phases and topics (use line breaks for each phase)
        </p>
      </div>

      {/* Video Demo URL */}
      <div>
        <label htmlFor="videoDemoUrl" className="block text-sm font-medium text-gray-700 mb-2">
          <Video className="inline w-4 h-4 mr-1" />
          Demo Video URL
        </label>
        <input
          type="url"
          id="videoDemoUrl"
          name="videoDemoUrl"
          value={formData.videoDemoUrl}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://youtube.com/watch?v=certification-demo"
        />
        <p className="text-sm text-gray-500 mt-1">
          YouTube or other video platform URL for certification preview
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter tag and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Add relevant tags like "Certification", "Full Stack", "JavaScript", etc.
        </p>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? 'Update Certification' : 'Create Certification'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CertifiedCoursesForm;