/**
 * Ebook Component
 * 
 * This is the main component that manages the ebook management interface.
 * It handles navigation between different views and manages the overall state
 * of the ebook management system.
 * 
 * Features:
 * - View switching (list, create, edit, view, debug, test)
 * - State management for selected ebook
 * - CRUD operation handlers with comprehensive debugging
 * - Refresh triggers for data updates
 * - Debug mode for troubleshooting issues
 * - API testing interface for verification
 */

import { useState } from 'react';
import EbookList from './EbookList.jsx';
import EbookForm from './EbookForm.jsx';
import EbookView from './EbookView.jsx';
import toast from 'react-hot-toast';
import ebookService from '../services/ebookService.js';

/**
 * Ebook functional component - Main ebook management interface
 * Matches the Blog component pattern exactly with added debugging
 * @returns {JSX.Element} Ebook management interface
 */
const Ebook = () => {
  // Current view state - determines which component to render
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view', 'test', 'debug'
  
  // Currently selected ebook for edit/view operations
  const [selectedEbook, setSelectedEbook] = useState(null);
  
  // Refresh trigger - increment to force re-fetch of ebook list
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Debug mode toggle
  const [debugMode, setDebugMode] = useState(false);

  /**
   * Handle creating a new ebook
   * Switches to create form view with debugging
   */
  const handleCreateNew = () => {
    console.log('🔧 Ebook Debug: handleCreateNew called');
    console.log('🔧 Current view before:', currentView);
    
    setSelectedEbook(null); // Clear any selected ebook
    setCurrentView('create');
    
    console.log('🔧 Selected ebook cleared, view set to create');
    
    // Show debug toast if debug mode is enabled
    if (debugMode) {
      toast.success('Debug: Switching to create ebook form');
    }
  };

  /**
   * Handle editing an existing ebook
   * @param {Object} ebook - Ebook object to edit
   */
  const handleEdit = (ebook) => {
    console.log('🔧 Ebook Debug: handleEdit called with:', ebook);
    
    setSelectedEbook(ebook);
    setCurrentView('edit');
    
    console.log('🔧 Selected ebook set, view changed to edit');
    
    if (debugMode) {
      toast.success(`Debug: Editing ebook "${ebook?.title}"`);
    }
  };

  /**
   * Handle viewing ebook details
   * @param {Object} ebook - Ebook object to view
   */
  const handleView = (ebook) => {
    console.log('🔧 Ebook Debug: handleView called with:', ebook);
    
    setSelectedEbook(ebook);
    setCurrentView('view');
    
    console.log('🔧 Selected ebook set, view changed to view');
    
    if (debugMode) {
      toast.success(`Debug: Viewing ebook "${ebook?.title}"`);
    }
  };

  /**
   * Handle successful save operation
   * Returns to list view and triggers refresh (matches Blog pattern exactly)
   * @param {Object} savedEbook - The saved ebook data
   */
  const handleSave = (savedEbook) => {
    console.log('🔧 Ebook Debug: handleSave called with:', savedEbook);
    
    setCurrentView('list');
    setSelectedEbook(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of ebook list
    
    console.log('🔧 Returned to list view, refresh trigger incremented');
    
    if (debugMode) {
      toast.success('Debug: Ebook saved, returned to list');
    }
  };

  /**
   * Handle form cancellation
   * Returns to list view without saving
   */
  const handleCancel = () => {
    console.log('🔧 Ebook Debug: handleCancel called');
    
    setCurrentView('list');
    setSelectedEbook(null);
    
    console.log('🔧 Returned to list view, selected ebook cleared');
    
    if (debugMode) {
      toast.info('Debug: Form cancelled, returned to list');
    }
  };

  /**
   * Handle ebook deletion (matches Blog pattern exactly)
   * @param {string} ebookId - ID of ebook to delete
   */
  const handleDelete = async (ebookId) => {
    console.log('🔧 Ebook Debug: handleDelete called with ID:', ebookId);
    
    // Confirm deletion with user
    if (!window.confirm('Are you sure you want to delete this ebook?')) {
      console.log('🔧 Deletion cancelled by user');
      return;
    }

    try {
      console.log('🔧 Attempting to delete ebook...');
      
      // Call API to delete ebook
      await ebookService.deleteEbook(ebookId);
      toast.success('Ebook deleted successfully');
      
      console.log('🔧 Ebook deleted successfully');
      
      // Return to list view and refresh data
      setCurrentView('list');
      setSelectedEbook(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh of ebook list
    } catch (error) {
      toast.error('Failed to delete ebook');
      console.error('Delete ebook error:', error);
    }
  };

  /**
   * Handle back navigation from detail views
   * Returns to list view
   */
  const handleBack = () => {
    console.log('🔧 Ebook Debug: handleBack called');
    
    setCurrentView('list');
    setSelectedEbook(null);
    
    console.log('🔧 Returned to list view');
  };

  /**
   * Handle switching to API test view
   */
  const handleShowAPITest = () => {
    console.log('🔧 Ebook Debug: handleShowAPITest called');
    
    setCurrentView('test');
    setSelectedEbook(null);
    
    console.log('🔧 Switched to API test view');
  };

  /**
   * Handle switching to debug view
   */
  const handleShowDebug = () => {
    console.log('🔧 Ebook Debug: handleShowDebug called');
    
    setCurrentView('debug');
    setSelectedEbook(null);
    
    console.log('🔧 Switched to debug view');
  };

  /**
   * Toggle debug mode on/off
   */
  const toggleDebugMode = () => {
    setDebugMode(prev => !prev);
    const newMode = !debugMode;
    
    console.log('🔧 Debug mode toggled:', newMode ? 'ON' : 'OFF');
    toast.success(`Debug mode ${newMode ? 'enabled' : 'disabled'}`);
  };

  /**
   * Render the appropriate view based on current state
   * @returns {JSX.Element} The current view component
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        // Render ebook creation form
        return (
          <EbookForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'edit':
        // Render ebook editing form
        return (
          <EbookForm
            ebook={selectedEbook}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'view':
        // Render ebook detail view
        return (
          <EbookView
            ebook={selectedEbook}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );
      
      case 'test':
        // Render API testing interface
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ebook API Testing</h2>
            <p className="text-gray-600 mb-4">API testing interface has been removed.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Ebook List
            </button>
          </div>
        );
      
      case 'debug':
        // Render debug interface
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Ebook System Debug</h2>
              <button
                onClick={() => setCurrentView('list')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Ebook List
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Debug interface has been removed.</p>
            </div>
          </div>
        );
      
      case 'list':
      default:
        // Render ebook list (default view)
        return (
          <EbookList
            key={refreshTrigger} // Force re-render when refreshTrigger changes
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
            onShowAPITest={handleShowAPITest}
            onShowDebug={handleShowDebug}
            debugMode={debugMode}
          />
        );
    }
  };

  // Main component render with debug controls
  return (
    <div className="space-y-6">
      {/* Debug Controls Bar */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-medium text-yellow-800">
              🔧 Ebook Debug Controls
            </h3>
            <span className="text-xs text-yellow-600">
              Current View: {currentView} | Selected: {selectedEbook?.title || 'None'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDebugMode}
              className={`px-3 py-1 text-xs rounded ${
                debugMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              Debug: {debugMode ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleShowDebug}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              System Debug
            </button>
            <button
              onClick={handleShowAPITest}
              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              API Test
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderCurrentView()}
    </div>
  );
};

export default Ebook;