/**
 * VideoView Component
 * 
 * This component displays detailed information about a single video.
 * Features include:
 * - Video player integration
 * - Metadata display (title, description, duration, etc.)
 * - Status indicators
 * - Action buttons (edit, delete, etc.)
 * - Responsive design
 */

import { useState, useEffect } from 'react';
import { 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Play, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Eye, 
  Tag 
} from 'lucide-react';
import videoService from '../services/videoService.js';

const VideoView = ({ video: initialVideo, onBack }) => {
  const [video, setVideo] = useState(initialVideo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full video details if needed
  useEffect(() => {
    const fetchVideoDetails = async () => {
      // If we already have complete video data, no need to fetch
      if (initialVideo && initialVideo.description) {
        return;
      }
      
      if (!initialVideo || !initialVideo.id) {
        setError("No video selected");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const videoData = await videoService.getVideoById(initialVideo.id);
        setVideo(videoData);
      } catch (err) {
        console.error('Error fetching video details:', err);
        setError('Failed to load video details');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [initialVideo]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border">
        <div className="py-8">
          <div className="text-center text-red-500">{error}</div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border">
        <div className="py-8">
          <div className="text-center">No video data available</div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{video.title}</h2>
          {getStatusBadge(video.status)}
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Video Preview */}
        {video.videoUrl && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Video Preview</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              {video.thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </a>
                  </div>
                </div>
              ) : (
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Video
                </a>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {video.description && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mastered Tools */}
        {video.masteredTools && video.masteredTools.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Mastered Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {video.masteredTools.map((tool, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <img 
                    src={tool.logoUrl} 
                    alt={tool.name} 
                    className="w-10 h-10 object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <span className="font-medium text-sm">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {video.faqs && video.faqs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {video.faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {video.duration && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Duration: {formatDuration(video.duration)}</span>
            </div>
          )}
          
          {video.category && (
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Category: {video.category}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Created: {formatDate(video.createdAt)}</span>
          </div>
          
          {video.updatedAt !== video.createdAt && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Updated: {formatDate(video.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 border-t">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default VideoView;