import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShortCoursesForm from '../../../components/forms/ShortCoursesForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import shortCoursesService from '../../../cms/services/shortCoursesService';
import toast from 'react-hot-toast';

const ShortCoursesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await shortCoursesService.getShortCourseById(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching short course:', error);
      toast.error('Failed to fetch short course');
      navigate('/dashboard/content/short-courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);
      await shortCoursesService.updateShortCourse(id, formData);
      toast.success('Short course updated successfully');
      navigate('/dashboard/content/short-courses');
    } catch (error) {
      console.error('Error updating short course:', error);
      toast.error('Failed to update short course');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/content/short-courses');
  };

  if (loading) return <LoadingSpinner />;

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Short course not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Short Course</h1>
        <p className="text-gray-600 mt-2">Update the short course information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ShortCoursesForm
          initialData={course}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={submitLoading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default ShortCoursesEdit;