import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  Upload, 
  User,
  Briefcase,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Star,
  Play,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import testimonialService from '../services/testimonialService.js';

const TestimonialForm = ({ testimonial, onSave, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    authorName: '',
    role: '',
    text: '',
    avatarUrl: '',
    videoUrl: '',
    status: 'pending'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (testimonial && mode === 'edit') {
      setFormData({
        authorName: testimonial.authorName || '',
        role: testimonial.role || '',
        text: testimonial.text || '',
        avatarUrl: testimonial.avatarUrl || '',
        videoUrl: testimonial.videoUrl || '',
        status: testimonial.status || 'pending'
      });
    }
  }, [testimonial, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role/Position is required';
    }

    if (!formData.text.trim()) {
      newErrors.text = 'Testimonial text is required';
    }

    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = 'Please enter a valid URL';
    }

    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
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

  const getAvatarUrl = () => {
    if (formData.avatarUrl && formData.avatarUrl !== 'https://example.com/avatar.jpg') {
      return formData.avatarUrl;
    }
    if (formData.authorName) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.authorName)}&background=f97316&color=fff&size=128&bold=true`;
    }
    return 'https://via.placeholder.com/128x128/f97316/ffffff?text=Avatar';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
        icon: CheckCircle
      },
      pending: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        label: "Pending",
        icon: Clock
      },
      rejected: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        label: "Rejected",
        icon: XCircle
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
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
      if (mode === 'edit' && testimonial?.id) {
        response = await testimonialService.updateTestimonial(testimonial.id, formData);
        toast.success('Testimonial updated successfully!');
      } else {
        response = await testimonialService.createTestimonial(formData);
        toast.success('Testimonial created successfully!');
      }
      
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to save testimonial');
      console.error('Save testimonial error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const draftData = { ...formData, status: 'pending' };
    setFormData(draftData);
    
    try {
      setLoading(true);
      
      let response;
      if (mode === 'edit' && testimonial?.id) {
        response = await testimonialService.updateTestimonial(testimonial.id, draftData);
      } else {
        response = await testimonialService.createTestimonial(draftData);
      }
      
      toast.success('Testimonial saved as pending!');
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to save testimonial');
      console.error('Save testimonial error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before approving');
      return;
    }

    const approvedData = { ...formData, status: 'approved' };
    setFormData(approvedData);
    
    try {
      setLoading(true);
      
      let response;
      if (mode === 'edit' && testimonial?.id) {
        response = await testimonialService.updateTestimonial(testimonial.id, approvedData);
      } else {
        response = await testimonialService.createTestimonial(approvedData);
      }
      
      toast.success('Testimonial approved successfully!');
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to approve testimonial');
      console.error('Approve testimonial error:', error);
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-md mx-auto">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={getAvatarUrl()}
                alt={formData.authorName}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formData.authorName}
                    </h3>
                    <p className="text-sm text-gray-600">{formData.role}</p>
                  </div>
                  {getStatusBadge(formData.status)}
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  "{formData.text}"
                </p>
                
                {formData.videoUrl && (
                  <div className="mt-4">
                    <a
                      href={formData.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Watch Video Testimonial
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Testimonial' : 'Create New Testimonial'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'edit' ? 'Update testimonial information' : 'Add a customer testimonial to showcase success stories'}
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
            {/* Author Name */}
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.authorName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer name..."
              />
              {errors.authorName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.authorName}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role/Position *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Software Engineer, CEO, Student..."
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Testimonial Text */}
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Text *
              </label>
              <textarea
                id="text"
                name="text"
                rows={6}
                value={formData.text}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.text ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter the testimonial text..."
              />
              {errors.text && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.text}
                </p>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.videoUrl ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/testimonial-video.mp4"
              />
              {errors.videoUrl && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.videoUrl}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Avatar
              </h3>
              <div className="space-y-3">
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.avatarUrl ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/avatar.jpg"
                />
                {errors.avatarUrl && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.avatarUrl}
                  </p>
                )}
                <div className="flex justify-center">
                  <img 
                    src={getAvatarUrl()} 
                    alt="Avatar preview" 
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/128x128/f97316/ffffff?text=Avatar';
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Leave empty to auto-generate from name
                </p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                {getStatusBadge(formData.status)}
              </div>
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
                  Save as Pending
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Approve & Save'}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-medium text-yellow-900 mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Testimonial Tips
              </h3>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Keep testimonials authentic and specific</li>
                <li>• Include the customer's role for credibility</li>
                <li>• Focus on results and benefits achieved</li>
                <li>• Video testimonials are more engaging</li>
                <li>• Always get permission before publishing</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;