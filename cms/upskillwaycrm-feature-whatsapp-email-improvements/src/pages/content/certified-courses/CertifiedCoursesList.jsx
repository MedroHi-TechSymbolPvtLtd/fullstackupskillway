import React from 'react';
import { useNavigate } from 'react-router-dom';
import CertifiedCoursesList from '../../../cms/components/CertifiedCoursesList';

const CertifiedCoursesListPage = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/dashboard/content/certified-courses/create');
  };

  const handleEdit = (course) => {
    navigate(`/dashboard/content/certified-courses/${course.id}/edit`);
  };

  const handleView = (course) => {
    navigate(`/dashboard/content/certified-courses/${course.id}`);
  };

  return (
    <CertifiedCoursesList
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onView={handleView}
    />
  );
};

export default CertifiedCoursesListPage;