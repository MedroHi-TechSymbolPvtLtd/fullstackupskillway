import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CertifiedCoursesView from '../../../cms/components/CertifiedCoursesView';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import certifiedCoursesService from '../../../cms/services/certifiedCoursesService';
import toast from 'react-hot-toast';

const CertifiedCoursesViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = (course) => {
    navigate(`/dashboard/content/certified-courses/${course.id}/edit`);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this certified course?')) {
      try {
        await certifiedCoursesService.deleteCertifiedCourse(courseId);
        toast.success('Certified course deleted successfully');
        navigate('/dashboard/content/certified-courses');
      } catch (error) {
        console.error('Error deleting certified course:', error);
        toast.error('Failed to delete certified course');
      }
    }
  };

  const handleBack = () => {
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
    <CertifiedCoursesView
      course={course}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
};

export default CertifiedCoursesViewPage;