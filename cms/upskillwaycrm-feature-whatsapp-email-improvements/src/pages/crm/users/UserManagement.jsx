import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import UserView from './UserView';
import UserForm from './UserForm';

const UserManagement = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/create" element={<UserForm />} />
      <Route path="/:id" element={<UserView />} />
      <Route path="/:id/edit" element={<UserForm />} />
    </Routes>
  );
};

export default UserManagement;
