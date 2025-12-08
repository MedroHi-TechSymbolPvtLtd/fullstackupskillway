/**
 * Course Component
 * 
 * This is the main component that manages the course management interface.
 * It handles navigation between different views and manages the overall state
 * of the course management system.
 * 
 * Features:
 * - View switching (list, create, edit, view)
 * - State management for selected course
 * - CRUD operation handlers
 * - Refresh triggers for data updates
 * - API testing interface integration
 */

import { useState } from 'react';
import CourseList from './CourseList.jsx';
import CourseForm from './CourseForm.jsx';
import CourseView from './CourseView.jsx';
import toast from 'react-hot-toast';
import courseService from '../services/courseService.js';

/**
 * Course functional component - Main course management interface
 * @returns {JSX.Element} Course management interface
 */
const Course = () => {
  // Current view state - determines which component to render
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view', 'test'
  
  // Currently selected course for edit/view operations
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Refresh trigger - increment to force re-fetch of course list
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Handle creating a new course
   * Switches to create form view
   */
  const handleCreateNew = () => {
    setSelectedCourse(null); // Clear any selected course
    setCurrentView('create');
  };

  /**
   * Handle editing an existing course
   * @param {Object} course - Course object to edit
   */
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setCurrentView('edit');
  };

  /**
   * Handle viewing course details
   * @param {Object} course - Course object to view
   */
  const handleView = (course) => {
    setSelectedCourse(course);
    setCurrentView('view');
  };

  /**
   * Handle successful save operation
   * Returns to list view and triggers refresh
   * @param {Object} savedCourse - The saved course data
   */
  const handleSave = (savedCourse) => {
    setCurrentView('list');
    setSelectedCourse(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of course list
  };

  /**
   * Handle form cancellation
   * Returns to list view without saving
   */
  const handleCancel = () => {
    setCurrentView('list');
    setSelectedCourse(null);
  };

  /**
   * Handle course deletion
   * @param {string} courseId - ID of course to delete
   */
  const handleDelete = async (courseId) => {
    // Confirm deletion with user
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      // Call API to delete course
      await courseService.deleteCourse(courseId);
      toast.success('Course deleted successfully');
      
      // Return to list view and refresh data
      setCurrentView('list');
      setSelectedCourse(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh of course list
    } catch (error) {
      toast.error('Failed to delete course');
      console.error('Delete course error:', error);
    }
  };

  /**
   * Handle back navigation from detail views
   * Returns to list view
   */
  const handleBack = () => {
    setCurrentView('list');
    setSelectedCourse(null);
  };

  /**
   * Handle switching to API test view
   */
  const handleShowAPITest = () => {
    setCurrentView('test');
    setSelectedCourse(null);
  };

  /**
   * Render the appropriate view based on current state
   * @returns {JSX.Element} The current view component
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        // Render course creation form
        return (
          <CourseForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'edit':
        // Render course editing form
        return (
          <CourseForm
            course={selectedCourse}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'view':
        // Render course detail view
        return (
          <CourseView
            course={selectedCourse}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );
      
      case 'test':
        // Render API testing interface
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Course API Testing</h2>
            <p className="text-gray-600 mb-4">API testing interface has been removed.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Course List
            </button>
          </div>
        );
      
      case 'list':
      default:
        // Render course list (default view)
        return (
          <CourseList
            key={refreshTrigger} // Force re-render when refreshTrigger changes
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
            onShowAPITest={handleShowAPITest}
          />
        );
    }
  };

  // Main component render
  return (
    <div className="space-y-6">
      {renderCurrentView()}
    </div>
  );
};

export default Course;