/**
 * VideoView Page Component
 * 
 * This page component displays detailed information about a specific video.
 * It provides a comprehensive view of video content, metadata, and management actions.
 * 
 * Features:
 * - Complete video information display
 * - YouTube video embed and thumbnail
 * - Tag display with proper styling
 * - Status indicators with color coding
 * - Action buttons for editing and deletion
 * - Responsive design with proper error handling
 * - Navigation breadcrumbs
 * 
 * API Integration:
 * - GET /api/v1/videos/:id - Fetch video details
 * - DELETE /api/v1/videos/:id - Delete video
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <VideoView />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Video, 
  Play, 
  Calendar, 
  Tag, 
  User, 
  Clock, 
  Eye,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Video API service for backend communication
import videoService from '../../../cms/services/videoService.js';

/**
 * VideoView Component
 * 
 * Main component that displays detailed video information and provides management actions.
 * Fetches video data from API and handles video deletion.
 */
const VideoView = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Video ID from URL
  
  // State management
  const [video, setVideo] = useState(null); // Video data object
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for error handling
  const [deleteLoading, setDeleteLoading] = useState(false); // Delete operation loading

  /**
   * Effect hook to fetch video data when component mounts
   * Runs when video ID changes
   */
  useEffect(() => {
    if (id) {
      fetchVideoData();
    }
  }, [id]);

  /**
   * Fetches video data from the API
   * 
   * API Endpoint: GET /api/v1/videos/:id
   * 
   * @async
   * @function fetchVideoData
   */
  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching video data for ID:', id);
      
      // Call video service to get video by ID
      const response = await videoService.getVideoById(id);
      
      console.log('Video view API response:', response);
      
      if (response.success && response.data) {
        setVideo(response.data);
      } else {
        throw new Error(response.message || 'Video not found');
      }
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.message || 'Failed to load video data');
      toast.error('Failed to load video data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles video deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/videos/:id
   * 
   * @async
   * @function handleDelete
   */
  const handleDelete = async () => {
    if (!video) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${video.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      setDeleteLoading(true);
      
      console.log('Deleting video:', video.id);
      
      // Call video service to delete video
      const response = await videoService.deleteVideo(video.id);
      
      console.log('Delete video response:', response);
      
      if (response.success) {
        toast.success('Video deleted successfully');
        navigate('/dashboard/content/videos'); // Redirect to video list
      } else {
        throw new Error(response.message || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error(err.message || 'Failed to delete video');
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Navigates to video edit page
   */
  const handleEdit = () => {
    navigate(`/dashboard/content/videos/${id}/edit`);
  };

  /**
   * Navigates back to video list
   */
  const handleBack = () => {
    navigate('/dashboard/content/videos');
  };

  /**
   * Returns appropriate status badge component based on video status
   * 
   * @param {string} status - Video status (published, draft, archived)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Published',
        icon: Eye
      },
      draft: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Draft',
        icon: Edit3
      },
      archived: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Archived',
        icon: Clock
      }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const StatusIcon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <StatusIcon className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  /**
   * Formats date string to readable format
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Gets YouTube video ID from URL
   * 
   * @param {string} url - YouTube URL
   * @returns {string|null} Video ID or null
   */
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  /**
   * Gets YouTube thumbnail URL
   * 
   * @param {string} videoUrl - YouTube video URL
   * @returns {string|null} Thumbnail URL or null
   */
  const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  /**
   * Gets YouTube embed URL
   * 
   * @param {string} videoUrl - YouTube video URL
   * @returns {string|null} Embed URL or null
   */
  const getYouTubeEmbedUrl = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading video details...</span>
      </div>
    );
  }

  // Show error state if video not found or error occurred
  if (error || !video) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Video Not Found</h3>
        <p className="text-gray-500 mb-4">{error || 'The requested video could not be found.'}</p>
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Videos
        </button>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Videos
        </button>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Video
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Video Header */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{video.title}</h1>
              <p className="text-gray-600 text-lg">{video.description}</p>
            </div>
            <div className="ml-6">
              {getStatusBadge(video.status)}
            </div>
          </div>
          
          {/* Video Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Created Date */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">{formatDate(video.createdAt)}</p>
              </div>
            </div>
            
            {/* Updated Date */}
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Updated</p>
                <p className="font-semibold text-gray-900">{formatDate(video.updatedAt)}</p>
              </div>
            </div>
            
            {/* Creator */}
            <div className="flex items-center">
              <User className="h-5 w-5 text-orange-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Creator</p>
                <p className="font-semibold text-gray-900">{video.creator?.name || 'Admin'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {video.videoUrl && getYouTubeEmbedUrl(video.videoUrl) && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Video Content
              </h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(video.videoUrl)}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch on YouTube
                </a>
              </div>
            </div>
          )}
          
          {/* Video Description */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Description
            </h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {video.description}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Video Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Video Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Video ID</p>
                <p className="font-mono text-sm text-gray-900">{video.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">URL Slug</p>
                <p className="font-mono text-sm text-gray-900">{video.slug}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">
                  {getStatusBadge(video.status)}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Video URL</p>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {video.videoUrl}
                </a>
              </div>
            </div>
          </div>
          
          {/* Video Thumbnail */}
          {getYouTubeThumbnail(video.videoUrl) && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thumbnail</h3>
              <img
                src={getYouTubeThumbnail(video.videoUrl)}
                alt={video.title}
                className="w-full rounded-lg"
              />
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Video
              </button>
              
              <button
                onClick={() => navigate('/dashboard/content/videos')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Video className="h-4 w-4 mr-2" />
                View All Videos
              </button>
              
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {deleteLoading ? 'Deleting...' : 'Delete Video'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;