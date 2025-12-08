import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShortCoursesList from '../../../cms/components/ShortCoursesList';

const ShortCoursesListPage = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/dashboard/content/short-courses/create');
  };

  const handleEdit = (course) => {
    navigate(`/dashboard/content/short-courses/${course.id}/edit`);
  };

  const handleView = (course) => {
    navigate(`/dashboard/content/short-courses/${course.id}`);
  };

  return (
    <ShortCoursesList
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onView={handleView}
    />
  );
};

export default ShortCoursesListPage;