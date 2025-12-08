import { useState } from 'react';
import FaqList from './FaqList.jsx';
import FaqForm from './FaqForm.jsx';
import FaqView from './FaqView.jsx';
import toast from 'react-hot-toast';
import faqService from '../services/faqService.js';

const Faq = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedFaq(null);
    setCurrentView('create');
  };

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setCurrentView('edit');
  };

  const handleView = (faq) => {
    setSelectedFaq(faq);
    setCurrentView('view');
  };

  const handleSave = (savedFaq) => {
    setCurrentView('list');
    setSelectedFaq(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of FAQ list
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedFaq(null);
  };

  const handleDelete = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      await faqService.deleteFaq(faqId);
      toast.success('FAQ deleted successfully');
      setCurrentView('list');
      setSelectedFaq(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh of FAQ list
    } catch (error) {
      toast.error('Failed to delete FAQ');
      console.error('Delete FAQ error:', error);
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedFaq(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <FaqForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'edit':
        return (
          <FaqForm
            faq={selectedFaq}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'view':
        return (
          <FaqView
            faq={selectedFaq}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );
      
      case 'list':
      default:
        return (
          <FaqList
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

export default Faq;