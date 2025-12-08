import { useState } from "react";
import StudyAbroadList from "./StudyAbroadList.jsx";
import StudyAbroadForm from "./StudyAbroadForm.jsx";
import StudyAbroadView from "./StudyAbroadView.jsx";
import toast from "react-hot-toast";
import studyAbroadService from "../services/studyAbroadService.js";

const StudyAbroad = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setCurrentView("create");
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setCurrentView("edit");
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setCurrentView("view");
  };

  const handleSave = async (recordData, mode) => {
    try {
      if (mode === "create") {
        await studyAbroadService.createStudyAbroad(recordData);
        toast.success("Study abroad destination created successfully");
      } else {
        await studyAbroadService.updateStudyAbroad(selectedRecord.id, recordData);
        toast.success("Study abroad destination updated successfully");
      }
      setCurrentView("list");
      setRefreshTrigger((prev) => prev + 1); // Force list refresh
    } catch (error) {
      console.error("Error saving study abroad record:", error);
      toast.error("Failed to save study abroad destination");
    }
  };

  const handleDelete = async (recordId) => {
    try {
      await studyAbroadService.deleteStudyAbroad(recordId);
      toast.success("Study abroad destination deleted successfully");
      setCurrentView("list");
      setRefreshTrigger((prev) => prev + 1); // Force list refresh
    } catch (error) {
      console.error("Error deleting study abroad record:", error);
      toast.error("Failed to delete study abroad destination");
    }
  };

  const handleCancel = () => {
    setCurrentView("list");
  };

  const handleBack = () => {
    setCurrentView("list");
    setSelectedRecord(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return (
          <StudyAbroadForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );

      case "edit":
        return (
          <StudyAbroadForm
            record={selectedRecord}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );

      case "view":
        return (
          <StudyAbroadView
            record={selectedRecord}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );

      case "list":
      default:
        return (
          <StudyAbroadList
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

export default StudyAbroad;