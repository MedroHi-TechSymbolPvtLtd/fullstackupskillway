import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import coursesApi from '../../../services/api/coursesApi';
import CourseForm from '../../../components/forms/CourseForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError('Failed to load course. Please try again.');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmit = async (courseData) => {
    try {
      setSubmitting(true);
      setError(null);
      await coursesApi.updateCourse(id, courseData);
      navigate('/content/courses');
    } catch (err) {
      setError(err.message || 'Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/content/courses');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button 
          onClick={() => navigate('/content/courses')} 
          className="ml-4 text-blue-500 underline"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      
      {course && (
        <CourseForm 
          initialData={course}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={submitting}
          submitLabel="Update Course"
        />
      )}
    </div>
  );
};

export default CourseEdit;