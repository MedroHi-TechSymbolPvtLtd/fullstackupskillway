import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudyAbroadForm from '../../../components/forms/StudyAbroadForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import studyAbroadService from '../../../cms/services/studyAbroadService';
import toast from 'react-hot-toast';

const StudyAbroadEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const response = await studyAbroadService.getStudyAbroadById(id);
      setRecord(response.data);
    } catch (error) {
      console.error('Error fetching study abroad record:', error);
      toast.error('Failed to fetch study abroad destination');
      navigate('/dashboard/content/study-abroad');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);
      await studyAbroadService.updateStudyAbroad(id, formData);
      toast.success('Study abroad destination updated successfully');
      navigate('/dashboard/content/study-abroad');
    } catch (error) {
      console.error('Error updating study abroad record:', error);
      toast.error('Failed to update study abroad destination');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/content/study-abroad');
  };

  if (loading) return <LoadingSpinner />;

  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Study abroad destination not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Study Abroad Destination</h1>
        <p className="text-gray-600 mt-2">Update the study abroad destination information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <StudyAbroadForm
          initialData={record}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={submitLoading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default StudyAbroadEdit;