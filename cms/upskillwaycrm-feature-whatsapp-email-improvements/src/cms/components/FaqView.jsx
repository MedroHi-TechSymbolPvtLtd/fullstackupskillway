/**
 * FaqView Component
 * 
 * This component displays detailed information about a single FAQ.
 * Features include:
 * - Question and answer display
 * - Category information
 * - Status indicators
 * - Action buttons (edit, delete, etc.)
 * - Responsive design
 */

import { useState, useEffect } from 'react';
import { 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  HelpCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Archive, 
  Tag 
} from 'lucide-react';
import 'react-hot-toast';
import faqService from "../services/faqService.js";

const FaqView = ({ faq: initialFaq, onBack }) => {
  const [faq, setFaq] = useState(initialFaq);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full FAQ details if needed
  useEffect(() => {
    const fetchFaqDetails = async () => {
      // If we already have complete FAQ data, no need to fetch
      if (initialFaq && initialFaq.answer) {
        return;
      }
      
      if (!initialFaq || !initialFaq.id) {
        setError("No FAQ selected");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const faqData = await faqService.getFaqById(initialFaq.id);
        setFaq(faqData);
      } catch (err) {
        console.error("Error fetching FAQ details:", err);
        setError("Failed to load FAQ details");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqDetails();
  }, [initialFaq]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading FAQ details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="py-8">
          <div className="text-center text-red-500">{error}</div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="py-8">
          <div className="text-center">No FAQ data available</div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
          {faq.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {faq.category}
            </span>
          )}
        </div>
      </div>
      <div className="px-6 py-4 space-y-6">
        {/* FAQ Answer */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Answer</h3>
          <div className="mt-1 text-gray-600 whitespace-pre-wrap">
            {faq.answer || "No answer provided"}
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-medium">Created</h3>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(faq.createdAt)}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Last Updated</h3>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(faq.updatedAt)}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Display Order</h3>
            <p className="mt-1 text-sm text-gray-500">
              {faq.order !== undefined ? faq.order : "Not specified"}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default FaqView;