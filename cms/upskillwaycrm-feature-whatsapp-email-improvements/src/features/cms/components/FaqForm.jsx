import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  Upload, 
  HelpCircle,
  FileText,
  AlertCircle,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import faqService from '../services/faqService.js';

const FaqForm = ({ faq, onSave, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Common FAQ categories
  const categories = [
    'Getting Started',
    'Account',
    'Billing',
    'Technical',
    'General',
    'Support'
  ];

  useEffect(() => {
    if (faq && mode === 'edit') {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || ''
      });
    }
  }, [faq, mode]);

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

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      if (mode === 'edit' && faq?.id) {
        response = await faqService.updateFaq(faq.id, formData);
        toast.success('FAQ updated successfully!');
      } else {
        response = await faqService.createFaq(formData);
        toast.success('FAQ created successfully!');
      }
      
      onSave(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to save FAQ');
      console.error('Save FAQ error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'Getting Started': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Account': { bg: 'bg-green-100', text: 'text-green-800' },
      'Billing': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Technical': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'General': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'Support': { bg: 'bg-pink-100', text: 'text-pink-800' },
    };

    const config = categoryColors[category] || categoryColors['General'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {category}
      </span>
    );
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {formData.question}
                </h1>
              </div>
              {formData.category && (
                <div className="ml-4">
                  {getCategoryBadge(formData.category)}
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {formData.answer}
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
            {mode === 'edit' ? 'Edit FAQ' : 'Create New FAQ'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'edit' ? 'Update your FAQ content' : 'Help users by answering common questions'}
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
            {/* Question */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.question ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="What question are you answering?"
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.question}
                </p>
              )}
            </div>

            {/* Answer */}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                Answer *
              </label>
              <textarea
                id="answer"
                name="answer"
                rows={8}
                value={formData.answer}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.answer ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Provide a clear and helpful answer..."
              />
              {errors.answer && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.answer}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Category
              </h3>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.category}
                </p>
              )}
              
              {formData.category && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  {getCategoryBadge(formData.category)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : (mode === 'edit' ? 'Update FAQ' : 'Create FAQ')}
                </button>
              </div>
            </div>

            {/* Help */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Tips for Great FAQs
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Keep questions clear and specific</li>
                <li>• Provide complete, helpful answers</li>
                <li>• Use simple, easy-to-understand language</li>
                <li>• Include relevant examples when helpful</li>
                <li>• Choose the most appropriate category</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FaqForm;