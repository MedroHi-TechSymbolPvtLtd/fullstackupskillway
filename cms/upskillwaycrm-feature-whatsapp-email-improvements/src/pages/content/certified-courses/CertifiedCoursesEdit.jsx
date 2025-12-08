import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CertifiedCoursesForm from '../../../components/forms/CertifiedCoursesForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import certifiedCoursesService from '../../../cms/services/certifiedCoursesService';
import toast from 'react-hot-toast';

const CertifiedCoursesEdit = () => {
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
      const response = await certifiedCoursesService.getCertifiedCourseById(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching certified course:', error);
      toast.error('Failed to fetch certified course');
      navigate('/dashboard/content/certified-courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);
      await certifiedCoursesService.updateCertifiedCourse(id, formData);
      toast.success('Certified course updated successfully');
      navigate('/dashboard/content/certified-courses');
    } catch (error) {
      console.error('Error updating certified course:', error);
      toast.error('Failed to update certified course');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/content/certified-courses');
  };

  if (loading) return <LoadingSpinner />;

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Certified course not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Certified Course</h1>
        <p className="text-gray-600 mt-2">Update the certification program information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <CertifiedCoursesForm
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

export default CertifiedCoursesEdit;