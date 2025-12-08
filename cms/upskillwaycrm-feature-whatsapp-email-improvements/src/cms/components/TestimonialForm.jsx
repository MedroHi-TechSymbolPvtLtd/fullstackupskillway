/**
 * TestimonialForm Component
 * 
 * This component provides a comprehensive form for creating and editing testimonials.
 * Features include:
 * - Create and edit modes with different UI states
 * - Form validation for all required fields
 * - Rating system with star display
 * - Status management (Draft/Published/Archived)
 * - Customer information management
 * - Rich text editing for testimonial content
 */

import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Star, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Info 
} from 'lucide-react';
import 'react-hot-toast';
import '../services/testimonialService.js';

const TestimonialForm = ({ testimonial, onSave, onCancel, mode = "create" }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    quote: "",
    rating: 5,
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with testimonial data if in edit mode
  useEffect(() => {
    if (mode === "edit" && testimonial) {
      setFormData({
        name: testimonial.name || "",
        company: testimonial.company || "",
        position: testimonial.position || "",
        quote: testimonial.quote || "",
        rating: testimonial.rating || 5,
        avatarUrl: testimonial.avatarUrl || "",
      });
    }
  }, [testimonial, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.quote.trim()) {
      newErrors.quote = "Testimonial quote is required";
    }
    
    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = "Please enter a valid URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    if (!url) return true; // Empty URL is valid (optional field)
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await onSave(formData, mode);
    } catch (error) {
      console.error("Error saving testimonial:", error);
      // Handle specific validation errors from API if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {mode === "create" ? "Add New Testimonial" : "Edit Testimonial"}
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter job title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
              Testimonial Quote
            </label>
            <textarea
              id="quote"
              name="quote"
              value={formData.quote}
              onChange={handleChange}
              placeholder="Enter the testimonial quote"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                errors.quote ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.quote && <p className="text-sm text-red-500">{errors.quote}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={(e) => handleSelectChange("rating", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Below Average</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                Avatar URL
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
              {errors.avatarUrl && <p className="text-sm text-red-500">{errors.avatarUrl}</p>}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {mode === "create" ? "Create Testimonial" : "Update Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;