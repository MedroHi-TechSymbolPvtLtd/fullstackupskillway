import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CertifiedCoursesForm from '../../../components/forms/CertifiedCoursesForm';
import certifiedCoursesService from '../../../cms/services/certifiedCoursesService';
import toast from 'react-hot-toast';

const CertifiedCoursesCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await certifiedCoursesService.createCertifiedCourse(formData);
      toast.success('Certified course created successfully');
      navigate('/dashboard/content/certified-courses');
    } catch (error) {
      console.error('Error creating certified course:', error);
      toast.error('Failed to create certified course');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/content/certified-courses');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Certified Course</h1>
        <p className="text-gray-600 mt-2">Add a new certification program to your catalog</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <CertifiedCoursesForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default CertifiedCoursesCreate;