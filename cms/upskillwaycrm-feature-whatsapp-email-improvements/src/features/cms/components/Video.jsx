import { useState } from 'react';
import VideoList from './VideoList.jsx';
import VideoForm from './VideoForm.jsx';
import VideoView from './VideoView.jsx';
import toast from 'react-hot-toast';
import videoService from '../services/videoService.js';

const Video = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedVideo(null);
    setCurrentView('create');
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setCurrentView('edit');
  };

  const handleView = (video) => {
    setSelectedVideo(video);
    setCurrentView('view');
  };

  const handleSave = (savedVideo) => {
    setCurrentView('list');
    setSelectedVideo(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of video list
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedVideo(null);
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await videoService.deleteVideo(videoId);
      toast.success('Video deleted successfully');
      setCurrentView('list');
      setSelectedVideo(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh of video list
    } catch (error) {
      toast.error('Failed to delete video');
      console.error('Delete video error:', error);
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedVideo(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <VideoForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'edit':
        return (
          <VideoForm
            video={selectedVideo}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      
      case 'view':
        return (
          <VideoView
            video={selectedVideo}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );
      
      case 'list':
      default:
        return (
          <VideoList
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

export default Video;