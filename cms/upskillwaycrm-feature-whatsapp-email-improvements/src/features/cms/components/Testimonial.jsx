import { useState } from 'react';
import TestimonialList from './TestimonialList.jsx';
import TestimonialForm from './TestimonialForm.jsx';
import TestimonialView from './TestimonialView.jsx';
import toast from 'react-hot-toast';
import testimonialService from '../services/testimonialService.js';

const Testimonial = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedTestimonial(null);
    setCurrentView('create');
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setCurrentView('edit');
  };

  const handleView = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setCurrentView('view');
  };

  const handleSave = (savedTestimonial) => {
    setCurrentView('list');
    setSelectedTestimonial(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of testimonial list
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedTestimonial(null);
  };

  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      await testimonialService.deleteTestimonial(testimonialId);
      toast.success('Testimonial deleted successfully');
      setCurrentView('list');
      setSelectedTestimonial(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh of testimonial list
    } catch (error) {
      toast.error('Failed to delete testimonial');
      console.error('Delete testimonial error:', error);
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedTestimonial(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <TestimonialForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'edit':
        return (
          <TestimonialForm
            testimonial={selectedTestimonial}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'view':
        return (
          <TestimonialView
            testimonial={selectedTestimonial}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );
      
      case 'list':
      default:
        return (
          <TestimonialList
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

export default Testimonial;