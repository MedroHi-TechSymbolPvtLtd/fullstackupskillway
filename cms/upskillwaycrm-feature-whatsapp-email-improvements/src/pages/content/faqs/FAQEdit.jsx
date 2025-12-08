import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FAQForm from '../../../components/forms/FAQForm';
import { getFAQ, updateFAQ } from '../../../services/api/faqsApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const FAQEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFAQ();
  }, [id]);

  const fetchFAQ = async () => {
    try {
      setLoading(true);
      const response = await getFAQ(id);
      setFaq(response);
    } catch (err) {
      setError('Failed to fetch FAQ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      await updateFAQ(id, formData);
      navigate('/faqs', { 
        state: { message: 'FAQ updated successfully!' }
      });
    } catch (err) {
      setError(err.message || 'Failed to update FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !faq) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/faqs')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to FAQs
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* FAQ Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <FAQForm
          initialData={faq}
          onSubmit={handleSubmit}
          loading={submitting}
          submitButtonText="Update FAQ"
        />
      </div>
    </div>
  );
};

export default FAQEdit;