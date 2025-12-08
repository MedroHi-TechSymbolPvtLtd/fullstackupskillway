import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TestimonialForm from '../../../components/forms/TestimonialForm';
import { getTestimonial, updateTestimonial } from '../../../services/api/testimonialsApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const TestimonialEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonial();
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      const response = await getTestimonial(id);
      setTestimonial(response);
    } catch (err) {
      setError('Failed to fetch testimonial');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      await updateTestimonial(id, formData);
      navigate('/testimonials', { 
        state: { message: 'Testimonial updated successfully!' }
      });
    } catch (err) {
      setError(err.message || 'Failed to update testimonial');
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

  if (error && !testimonial) {
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
            onClick={() => navigate('/testimonials')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Testimonials
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Testimonial</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Testimonial Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <TestimonialForm
          initialData={testimonial}
          onSubmit={handleSubmit}
          loading={submitting}
          submitButtonText="Update Testimonial"
        />
      </div>
    </div>
  );
};

export default TestimonialEdit;