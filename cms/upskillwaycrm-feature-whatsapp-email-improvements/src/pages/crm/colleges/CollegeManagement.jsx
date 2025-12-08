import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CollegeList from './CollegeList';
import CollegeView from './CollegeView';
import CollegeForm from './CollegeForm';

const CollegeManagement = () => {
  return (
    <Routes>
      <Route path="/" element={<CollegeList />} />
      <Route path="/create" element={<CollegeForm />} />
      <Route path="/:id" element={<CollegeView />} />
      <Route path="/:id/edit" element={<CollegeForm />} />
    </Routes>
  );
};

export default CollegeManagement;
