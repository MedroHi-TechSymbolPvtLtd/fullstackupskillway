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
 */

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import CourseList from './CourseList.jsx';
import CourseForm from './CourseForm.jsx';
import CourseView from './CourseView.jsx';
import courseService from '../services/courseService.js';

const Course = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setMode] = useState("create"); // create or edit

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setMode("create");
    setActiveTab("form");
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setMode("edit");
    setActiveTab("form");
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setActiveTab("view");
  };

  const handleSaveCourse = async (courseData, mode) => {
    try {
      setLoading(true);
      setError(null);
      
      let savedCourse;
      if (mode === "create") {
        savedCourse = await courseService.createCourse(courseData);
      } else {
        savedCourse = await courseService.updateCourse(selectedCourse.id, courseData);
      }
      
      // Refresh the courses list
      await fetchCourses();
      
      // Switch to view the newly created/updated course
      setSelectedCourse(savedCourse);
      setActiveTab("view");
      
      return savedCourse;
    } catch (err) {
      console.error("Error saving course:", err);
      setError(`Failed to ${mode === "create" ? "create" : "update"} course. ${err.message || ""}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await courseService.deleteCourse(courseId);
      
      // Refresh the courses list
      await fetchCourses();
      
      // If the deleted course was selected, clear the selection
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null);
        setActiveTab("list");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      setError(`Failed to delete course. ${err.message || ""}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setActiveTab("list");
    setSelectedCourse(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Course Management</h2>
      </div>
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("list")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "list"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Course List
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Create Course
              </button>
              {activeTab === "edit" && (
                <button
                  onClick={() => setActiveTab("edit")}
                  className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
                >
                  Edit Course
                </button>
              )}
              {activeTab === "view" && (
                <button
                  onClick={() => setActiveTab("view")}
                  className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
                >
                  View Course
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "list" && (
              <>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <button 
                        onClick={handleCreateCourse}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add New Course
                      </button>
                    </div>
                    <CourseList 
                      courses={courses} 
                      onEdit={handleEditCourse} 
                      onView={handleViewCourse} 
                      onDelete={handleDeleteCourse} 
                    />
                  </>
                )}
              </>
            )}
            
            {activeTab === "create" && (
              <CourseForm 
                course={null} 
                onSave={handleSaveCourse} 
                onCancel={handleCancel} 
                mode="create" 
              />
            )}
            
            {activeTab === "edit" && (
              <CourseForm 
                course={selectedCourse} 
                onSave={handleSaveCourse} 
                onCancel={handleCancel} 
                mode="edit" 
              />
            )}
            
            {activeTab === "view" && (
              <CourseView 
                course={selectedCourse} 
                onBack={handleCancel} 
                onEdit={() => {
                  setMode("edit");
                  setActiveTab("edit");
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;