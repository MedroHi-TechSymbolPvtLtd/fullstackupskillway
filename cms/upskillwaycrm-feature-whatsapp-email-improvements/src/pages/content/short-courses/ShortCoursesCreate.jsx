import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShortCoursesForm from '../../../components/forms/ShortCoursesForm';
import shortCoursesService from '../../../cms/services/shortCoursesService';
import toast from 'react-hot-toast';

const ShortCoursesCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await shortCoursesService.createShortCourse(formData);
      toast.success('Short course created successfully');
      navigate('/dashboard/content/short-courses');
    } catch (error) {
      console.error('Error creating short course:', error);
      toast.error('Failed to create short course');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/content/short-courses');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Short Course</h1>
        <p className="text-gray-600 mt-2">Add a new short course to your catalog</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ShortCoursesForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default ShortCoursesCreate;