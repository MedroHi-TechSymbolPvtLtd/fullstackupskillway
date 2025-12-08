import { useState } from 'react';
import CollegeList from './CollegeList';
import CollegeForm from './CollegeForm';
import toast from 'react-hot-toast';
import collegeService from '../services/collegeService';

const College = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedCollege(null);
    setCurrentView('create');
  };

  const handleEdit = (college) => {
    setSelectedCollege(college);
    setCurrentView('edit');
  };

  const handleView = (college) => {
    setSelectedCollege(college);
    setCurrentView('view');
  };

  const handleSave = async (collegeData, mode) => {
    try {
      if (mode === 'create') {
        await collegeService.createCollege(collegeData);
        toast.success('College training created successfully');
      } else {
        await collegeService.updateCollege(selectedCollege.id, collegeData);
        toast.success('College training updated successfully');
      }
      setCurrentView('list');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error(error.message || 'Failed to save college training');
      throw error;
    }
  };

  const handleBack = () => {
    setCurrentView('list');
  };

  const renderView = () => {
    switch (currentView) {
      case 'create':
      case 'edit':
        return (
          <CollegeForm
            college={selectedCollege}
            onSave={handleSave}
            onCancel={handleBack}
            mode={currentView}
          />
        );
      case 'view':
        return (
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedCollege?.title}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Slug</p>
                <p className="font-medium">{selectedCollege?.slug || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{selectedCollege?.description || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">₹{selectedCollege?.price?.toLocaleString('en-IN') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{selectedCollege?.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {selectedCollege?.durationMonths ? `${selectedCollege.durationMonths} months` : 'N/A'}
                    {selectedCollege?.durationHours && ` (${selectedCollege.durationHours} hours)`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Placement Rate</p>
                  <p className="font-medium">{selectedCollege?.placementRate ? `${selectedCollege.placementRate}%` : 'N/A'}</p>
                </div>
              </div>
              {selectedCollege?.tags && selectedCollege.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollege.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleBack}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        );
      case 'list':
      default:
        return (
          <CollegeList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
            refreshTrigger={refreshTrigger}
          />
        );
    }
  };

  return <div className="college-manager">{renderView()}</div>;
};

export default College;



