import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShortCoursesView from '../../../cms/components/ShortCoursesView';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import shortCoursesService from '../../../cms/services/shortCoursesService';
import toast from 'react-hot-toast';

const ShortCoursesViewPage = () => {
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

  const handleEdit = (course) => {
    navigate(`/dashboard/content/short-courses/${course.id}/edit`);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this short course?')) {
      try {
        await shortCoursesService.deleteShortCourse(courseId);
        toast.success('Short course deleted successfully');
        navigate('/dashboard/content/short-courses');
      } catch (error) {
        console.error('Error deleting short course:', error);
        toast.error('Failed to delete short course');
      }
    }
  };

  const handleBack = () => {
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
    <ShortCoursesView
      course={course}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
};

export default ShortCoursesViewPage;