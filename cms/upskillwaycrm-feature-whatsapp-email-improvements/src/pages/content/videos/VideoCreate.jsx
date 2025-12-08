import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoForm from '../../../components/forms/VideoForm';
import videosApi from '../../../services/api/videosApi';

const VideoCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      await videosApi.createVideo(formData);
      navigate('/videos');
    } catch (error) {
      setError(error.message || 'Failed to create video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Video</h1>
        <p className="text-gray-600">Add a new video to your content library</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <VideoForm
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={() => navigate('/videos')}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCreate;