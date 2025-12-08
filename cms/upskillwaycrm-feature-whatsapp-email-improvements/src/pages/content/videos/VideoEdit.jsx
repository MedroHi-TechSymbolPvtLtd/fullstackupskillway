import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VideoForm from '../../../components/forms/VideoForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import videosApi from '../../../services/api/videosApi';

const VideoEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const data = await videosApi.getVideoById(id);
      setVideo(data.data);
    } catch (error) {
      setError('Failed to fetch video details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setUpdating(true);
    setError('');
    
    try {
      await videosApi.updateVideo(id, formData);
      navigate('/videos');
    } catch (error) {
      setError(error.message || 'Failed to update video');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !video) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
        <p className="text-gray-600">Update video information</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <VideoForm
            initialData={video}
            onSubmit={handleSubmit}
            loading={updating}
            onCancel={() => navigate('/videos')}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoEdit;