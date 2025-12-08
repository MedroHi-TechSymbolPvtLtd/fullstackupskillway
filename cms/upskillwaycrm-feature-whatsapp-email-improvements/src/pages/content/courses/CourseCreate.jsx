import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import coursesApi from '../../../services/api/coursesApi';
import CourseForm from '../../../components/forms/CourseForm';

const CourseCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialCourseData = {
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'beginner',
    category: '',
    price: '',
    status: 'draft',
    thumbnail: '',
    modules: []
  };

  const handleSubmit = async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      await coursesApi.createCourse(courseData);
      navigate('/content/courses');
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <CourseForm 
        initialData={initialCourseData}
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitLabel="Create Course"
      />
    </div>
  );
};

export default CourseCreate;