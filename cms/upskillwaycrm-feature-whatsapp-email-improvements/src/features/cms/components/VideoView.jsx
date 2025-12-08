// VideoView component
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  Eye,
  ExternalLink,
  Share2,
  Play
} from 'lucide-react';
import mediaUtils from '../utils/mediaUtils.js';

const VideoView = ({ video, onEdit, onDelete, onBack }) => {
  if (!video) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Video not found</h3>
          <p className="text-gray-500">The video you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getVideoThumbnail = (videoUrl) => {
    return mediaUtils.getYouTubeThumbnail(videoUrl, 'maxres');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: video.videoUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(video.videoUrl);
      // You could show a toast here
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Videos
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
          <button
            onClick={() => onEdit(video)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Video Content */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Video Player/Thumbnail */}
        <div className="aspect-video bg-gray-100 relative">
          <img 
            src={getVideoThumbnail(video.videoUrl)} 
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x450/3b82f6/ffffff?text=Video';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-6 hover:bg-opacity-100 transition-all cursor-pointer">
              <Play className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          {video.videoUrl && (
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg hover:bg-opacity-100 transition-all"
            >
              <ExternalLink className="h-5 w-5 text-gray-700" />
            </a>
          )}
        </div>
        
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(video.createdAt)}</span>
              </div>
              {video.updatedAt !== video.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated: {formatDate(video.updatedAt)}</span>
                </div>
              )}
              {video.creator && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{video.creator.name || 'Unknown Author'}</span>
                </div>
              )}
            </div>
            {getStatusBadge(video.status)}
          </div>

          {/* Title and Description */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {video.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="flex items-center text-sm text-gray-500 mr-2">
                <Tag className="h-4 w-4 mr-1" />
                Tags:
              </div>
              {video.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Slug Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">URL Slug</h3>
                <p className="text-sm text-gray-600 font-mono">{video.slug}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(video.slug)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Copy
                </button>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Video URL */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-700 mb-1">Video URL</h3>
                <p className="text-sm text-blue-600 font-mono break-all">{video.videoUrl}</p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Watch
                </a>
                <ExternalLink className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Video ID: {video.id}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onEdit(video)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit this video
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onBack}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Back to all videos
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Additional Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onEdit(video)}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit Video
          </button>
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Play className="h-5 w-5 mr-2" />
            Watch Video
          </a>
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoView;