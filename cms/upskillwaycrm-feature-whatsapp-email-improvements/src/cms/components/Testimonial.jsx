import { useState } from "react";
import TestimonialList from "./TestimonialList.jsx";
import TestimonialForm from "./TestimonialForm.jsx";
import TestimonialView from "./TestimonialView.jsx";
import toast from "react-hot-toast";
import testimonialService from "../services/testimonialService.js";

const Testimonial = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedTestimonial(null);
    setCurrentView("create");
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setCurrentView("edit");
  };

  const handleView = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setCurrentView("view");
  };

  const handleSave = async (testimonialData, mode) => {
    try {
      if (mode === "create") {
        await testimonialService.createTestimonial(testimonialData);
        toast.success("Testimonial created successfully");
      } else {
        await testimonialService.updateTestimonial(selectedTestimonial.id, testimonialData);
        toast.success("Testimonial updated successfully");
      }
      setCurrentView("list");
      setRefreshTrigger((prev) => prev + 1); // Force list refresh
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error("Failed to save testimonial");
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
          <TestimonialForm
            testimonial={selectedTestimonial}
            onSave={handleSave}
            onCancel={handleBack}
            mode={currentView}
          />
        );
      case "view":
        return <TestimonialView testimonial={selectedTestimonial} onBack={handleBack} />;
      case "list":
      default:
        return (
          <TestimonialList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
            refreshTrigger={refreshTrigger}
          />
        );
    }
  };

  return (
    <div className="testimonial-manager">
      {renderView()}
    </div>
  );
};

export default Testimonial;