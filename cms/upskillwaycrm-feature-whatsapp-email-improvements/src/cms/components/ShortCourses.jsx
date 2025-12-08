import { useState } from "react";
import ShortCoursesList from "./ShortCoursesList.jsx";
import ShortCoursesForm from "./ShortCoursesForm.jsx";
import ShortCoursesView from "./ShortCoursesView.jsx";
import toast from "react-hot-toast";
import shortCoursesService from "../services/shortCoursesService.js";

const ShortCourses = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedCourse(null);
    setCurrentView("create");
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setCurrentView("edit");
  };

  const handleView = (course) => {
    setSelectedCourse(course);
    setCurrentView("view");
  };

  const handleSave = async (courseData, mode) => {
    try {
      if (mode === "create") {
        await shortCoursesService.createShortCourse(courseData);
        toast.success("Short course created successfully");
      } else {
        await shortCoursesService.updateShortCourse(selectedCourse.id, courseData);
        toast.success("Short course updated successfully");
      }
      setCurrentView("list");
      setRefreshTrigger((prev) => prev + 1); // Force list refresh
    } catch (error) {
      console.error("Error saving short course:", error);
      toast.error("Failed to save short course");
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await shortCoursesService.deleteShortCourse(courseId);
      toast.success("Short course deleted successfully");
      setCurrentView("list");
      setRefreshTrigger((prev) => prev + 1); // Force list refresh
    } catch (error) {
      console.error("Error deleting short course:", error);
      toast.error("Failed to delete short course");
    }
  };

  const handleCancel = () => {
    setCurrentView("list");
  };

  const handleBack = () => {
    setCurrentView("list");
    setSelectedCourse(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return (
          <ShortCoursesForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );

      case "edit":
        return (
          <ShortCoursesForm
            course={selectedCourse}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );

      case "view":
        return (
          <ShortCoursesView
            course={selectedCourse}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );

      case "list":
      default:
        return (
          <ShortCoursesList
            key={refreshTrigger} // Force re-render when refreshTrigger changes
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderCurrentView()}
    </div>
  );
};

export default ShortCourses;