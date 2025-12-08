import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TestimonialForm from '../../../components/forms/TestimonialForm';
import { createTestimonial } from '../../../services/api/testimonialsApi';

const TestimonialCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await createTestimonial(formData);
      navigate('/testimonials', { 
        state: { message: 'Testimonial created successfully!' }
      });
    } catch (err) {
      setError(err.message || 'Failed to create testimonial');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Create New Testimonial</h1>
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
          onSubmit={handleSubmit}
          loading={loading}
          submitButtonText="Create Testimonial"
        />
      </div>
    </div>
  );
};

export default TestimonialCreate;