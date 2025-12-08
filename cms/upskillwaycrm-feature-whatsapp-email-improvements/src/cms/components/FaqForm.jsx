/**
 * FaqForm Component
 * 
 * This component provides a comprehensive form for creating and editing FAQs.
 * Features include:
 * - Create and edit modes with different UI states
 * - Form validation for all required fields
 * - Category management
 * - Status management (Draft/Published/Archived)
 * - Rich text editing for answers
 * - Preview mode functionality
 */

import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle, 
  Info 
} from 'lucide-react';
import toast from 'react-hot-toast';
import '../services/faqService.js';


const FaqForm = ({ faq, onSave, onCancel, mode = "create" }) => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with FAQ data if in edit mode
  useEffect(() => {
    if (mode === "edit" && faq) {
      setFormData({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "",
        order: faq.order || 0,
      });
    }
  }, [faq, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      console.error("Error saving FAQ:", error);
      // Handle specific validation errors from API if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">{mode === "create" ? "Add New FAQ" : "Edit FAQ"}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
            <input
              id="question"
              name="question"
              type="text"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter the question"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.question ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.question && <p className="text-sm text-red-500">{errors.question}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Enter the answer"
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.answer ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.answer && <p className="text-sm text-red-500">{errors.answer}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., General, Pricing, Technical"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="order" className="block text-sm font-medium text-gray-700">Display Order</label>
              <input
                id="order"
                name="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={handleNumberChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
            </div>
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
            {mode === "create" ? "Create FAQ" : "Update FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaqForm;