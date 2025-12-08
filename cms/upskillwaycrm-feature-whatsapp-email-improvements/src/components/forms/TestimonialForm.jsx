import React, { useState } from 'react';

const TestimonialForm = ({ initialData, onSubmit, loading = false, onCancel }) => {
  const [formData, setFormData] = useState({
    authorName: initialData?.authorName || '',
    role: initialData?.role || '',
    text: initialData?.text || '',
    videoUrl: initialData?.videoUrl || '',
    avatarUrl: initialData?.avatarUrl || '',
    status: initialData?.status || 'pending'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }

    if (!formData.text.trim()) {
      newErrors.text = 'Testimonial text is required';
    }

    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid video URL';
    }

    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = 'Please enter a valid avatar URL';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Name *
          </label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.authorName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter author's name"
          />
          {errors.authorName && (
            <p className="mt-1 text-sm text-red-600">{errors.authorName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role/Position
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Engineer, CEO"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL
          </label>
          <input
            type="url"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.avatarUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/avatar.jpg"
          />
          {errors.avatarUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.avatarUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Testimonial Text *
        </label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          rows={5}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.text ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter the testimonial text"
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video URL (Optional)
        </label>
        <input
          type="url"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.videoUrl ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://example.com/testimonial-video.mp4"
        />
        {errors.videoUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.videoUrl}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Testimonial'}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;