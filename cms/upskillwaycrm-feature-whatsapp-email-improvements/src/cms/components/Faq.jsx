import { useState } from "react";
import FaqList from "./FaqList.jsx";
import FaqForm from "./FaqForm.jsx";
import FaqView from "./FaqView.jsx";
import toast from "react-hot-toast";
import faqService from "../services/faqService.js";

const Faq = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedFaq(null);
    setCurrentView("create");
  };

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setCurrentView("edit");
  };

  const handleView = (faq) => {
    setSelectedFaq(faq);
    setCurrentView("view");
  };

  const handleSave = async (faqData, mode) => {
    try {
      if (mode === "create") {
        await faqService.createFaq(faqData);
        toast.success("FAQ created successfully");
      } else {
        await faqService.updateFaq(selectedFaq.id, faqData);
        toast.success("FAQ updated successfully");
      }
      setCurrentView("list");
      setRefreshTrigger((prev) => prev + 1); // Force list refresh
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error("Failed to save FAQ");
    }
  };

  const handleBack = () => {
    setCurrentView("list");
  };

  // Render the appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case "create":
      case "edit":
        return (
          <FaqForm
            faq={selectedFaq}
            onSave={handleSave}
            onCancel={handleBack}
            mode={currentView}
          />
        );
      case "view":
        return <FaqView faq={selectedFaq} onBack={handleBack} />;
      case "list":
      default:
        return (
          <FaqList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
            refreshTrigger={refreshTrigger}
          />
        );
    }
  };

  return (
    <div className="faq-manager">
      {renderView()}
    </div>
  );
};

export default Faq;