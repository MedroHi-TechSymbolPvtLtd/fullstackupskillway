import { useState } from 'react';
import CorporateTrainingList from './CorporateTrainingList';
import CorporateTrainingForm from './CorporateTrainingForm';
import toast from 'react-hot-toast';
import corporateTrainingService from '../services/corporateTrainingService';

const CorporateTraining = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedProgram(null);
    setCurrentView('create');
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setCurrentView('edit');
  };

  const handleView = (program) => {
    setSelectedProgram(program);
    setCurrentView('view');
  };

  const handleSave = async (programData, mode) => {
    try {
      if (mode === 'create') {
        await corporateTrainingService.createTrainingProgram(programData);
        toast.success('Training program created successfully');
      } else {
        await corporateTrainingService.updateTrainingProgram(selectedProgram.id, programData);
        toast.success('Training program updated successfully');
      }
      setCurrentView('list');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error(error.message || 'Failed to save program');
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
          <CorporateTrainingForm
            program={selectedProgram}
            onSave={handleSave}
            onCancel={handleBack}
            mode={currentView}
          />
        );
      case 'view':
        return (
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProgram?.title}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{selectedProgram?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{selectedProgram?.trainingType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">₹{selectedProgram?.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {selectedProgram?.durationMonths} months ({selectedProgram?.durationHours} hours)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{selectedProgram?.status}</p>
                </div>
              </div>
              {selectedProgram?.tags && selectedProgram.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProgram?.masteredTools && selectedProgram.masteredTools.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Mastered Tools</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProgram.masteredTools.map((tool, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="w-16 h-16 flex items-center justify-center bg-white rounded overflow-hidden">
                          {tool.url ? (
                            <img 
                              src={tool.url} 
                              alt={tool.name} 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.parentElement.querySelector('.image-fallback');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="image-fallback w-full h-full flex items-center justify-center text-xs text-gray-500"
                            style={{ display: tool.url ? 'none' : 'flex' }}
                          >
                            {tool.url ? 'Failed' : 'No Image'}
                          </div>
                        </div>
                        <span className="font-medium text-sm text-center">{tool.name}</span>
                      </div>
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
          <CorporateTrainingList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
            refreshTrigger={refreshTrigger}
          />
        );
    }
  };

  return <div className="corporate-training-manager">{renderView()}</div>;
};

export default CorporateTraining;
