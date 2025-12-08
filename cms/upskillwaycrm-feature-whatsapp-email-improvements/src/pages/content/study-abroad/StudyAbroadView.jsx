import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudyAbroadView from '../../../cms/components/StudyAbroadView';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import studyAbroadService from '../../../cms/services/studyAbroadService';
import toast from 'react-hot-toast';

const StudyAbroadViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = (record) => {
    navigate(`/dashboard/content/study-abroad/${record.id}/edit`);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this study abroad destination?')) {
      try {
        await studyAbroadService.deleteStudyAbroad(recordId);
        toast.success('Study abroad destination deleted successfully');
        navigate('/dashboard/content/study-abroad');
      } catch (error) {
        console.error('Error deleting study abroad record:', error);
        toast.error('Failed to delete study abroad destination');
      }
    }
  };

  const handleBack = () => {
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
    <StudyAbroadView
      record={record}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
};

export default StudyAbroadViewPage;