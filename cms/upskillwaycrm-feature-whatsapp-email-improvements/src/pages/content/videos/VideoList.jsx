/**
 * VideoList Page Component
 * 
 * This page component displays a list of videos with full dashboard layout including sidebar.
 * It provides comprehensive video management functionality with search, filtering, and CRUD operations.
 * 
 * Features:
 * - Video listing with pagination
 * - Search functionality across video titles and descriptions
 * - Status filtering (Published, Draft, Archived)
 * - Video creation, editing, viewing, and deletion
 * - Responsive design with proper error handling
 * - Integration with video API endpoints
 * 
 * API Integration:
 * - GET /api/v1/videos - Fetch videos with pagination
 * - DELETE /api/v1/videos/:id - Delete video
 * 
 * @component
 * @example
 * return (
 *   <DashboardLayout>
 *     <VideoList />
 *   </DashboardLayout>
 * )
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Video,
  Play,
  Clock,
  Tag,
  ExternalLink
} from 'lucide-react';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

// Video API service for backend communication
import videoService from '../../../cms/services/videoService.js';

/**
 * VideoList Component
 * 
 * Main component that handles video listing, search, filtering, and basic CRUD operations.
 * Integrates with the video API to fetch, display, and manage videos.
 */
const VideoList = () => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // State management for videos data and UI
  const [videos, setVideos] = useState([]); // Array of video objects
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for error handling
  const [searchTerm, setSearchTerm] = useState(''); // Search input value
  const [statusFilter, setStatusFilter] = useState(''); // Status filter value
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  
  // Pagination state from API response
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false
  });

  // Constants
  const ITEMS_PER_PAGE = 10; // Number of videos per page

  /**
   * Effect hook to fetch videos when component mounts or dependencies change
   * Dependencies: currentPage, searchTerm, statusFilter
   */
  useEffect(() => {
    fetchVideos();
  }, [currentPage, searchTerm, statusFilter]);

  /**
   * Fetches videos from the API with current filters and pagination
   * 
   * API Endpoint: GET /api/v1/videos
   * Query Parameters:
   * - page: Current page number
   * - limit: Items per page
   * - search: Search term (optional)
   * - status: Status filter (optional)
   * 
   * @async
   * @function fetchVideos
   */
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare API parameters
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      };

      console.log('Fetching videos with params:', params);
      
      // Call video service to get videos
      const response = await videoService.getVideos(params);
      
      console.log('Video API response:', response);
      
      if (response.success) {
        setVideos(response.data || []);
        setPagination(response.pagination || {
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        throw new Error(response.message || 'Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
      toast.error('Failed to load videos');
      setVideos([]); // Reset videos on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles search input changes and resets pagination
   * 
   * @param {Event} e - Input change event
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  /**
   * Handles status filter changes and resets pagination
   * 
   * @param {Event} e - Select change event
   */
  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  /**
   * Navigates to video view page
   * 
   * @param {Object} video - Video object to view
   */
  const handleView = (video) => {
    navigate(`/dashboard/content/videos/${video.id}`);
  };

  /**
   * Navigates to video edit page
   * 
   * @param {Object} video - Video object to edit
   */
  const handleEdit = (video) => {
    navigate(`/dashboard/content/videos/${video.id}/edit`);
  };

  /**
   * Handles video deletion with confirmation
   * 
   * API Endpoint: DELETE /api/v1/videos/:id
   * 
   * @param {Object} video - Video object to delete
   * @async
   */
  const handleDelete = async (video) => {
    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      item: video,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      console.log('Deleting video:', deleteModal.item.id);
      
      // Call video service to delete video
      const response = await videoService.deleteVideo(deleteModal.item.id);
      
      console.log('Delete video response:', response);
      
      if (response.success) {
        toastUtils.crud.deleted('Video');
        
        // Remove video from local state
        setVideos(videos.filter(v => v.id !== deleteModal.item.id));
        
        // Update pagination total
        setPagination(prev => ({ 
          ...prev, 
          total: prev.total - 1 
        }));
        
        // Refresh videos list to ensure consistency
        await fetchVideos();
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      toastUtils.crud.deleteError('Video', err.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
  };

  /**
   * Returns appropriate status badge component based on video status
   * 
   * @param {string} status - Video status (published, draft, archived)
   * @returns {JSX.Element} Status badge component
   */
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

  /**
   * Formats date string to readable format
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Truncates text to specified length with ellipsis
   * 
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated text
   */
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  /**
   * Extracts video ID from YouTube URL
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
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading videos...</span>
      </div>
    );
  }

  // Main component render
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600">Manage your video content and tutorials</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/content/videos/create')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Video
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos by title or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchVideos}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Videos Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {videos.length === 0 ? (
                // Empty state when no videos found
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || statusFilter 
                        ? "No videos match your current filters." 
                        : "Get started by creating your first video."
                      }
                    </p>
                    {!searchTerm && !statusFilter && (
                      <button
                        onClick={() => navigate('/dashboard/content/videos/create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Video
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                // Video rows
                videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    {/* Video Info Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {getYouTubeThumbnail(video.videoUrl) ? (
                            <img
                              src={getYouTubeThumbnail(video.videoUrl)}
                              alt={video.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                              <Video className="h-6 w-6 text-red-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {video.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {truncateText(video.description)}
                          </div>
                          {video.videoUrl && (
                            <div className="flex items-center mt-1">
                              <Play className="h-3 w-3 text-red-500 mr-1" />
                              <span className="text-xs text-red-500">Video Available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(video.status)}
                    </td>
                    
                    {/* Tags Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {video.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {video.tags?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{video.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Created Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(video.createdAt)}
                      </div>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(video)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Video"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(video)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Edit Video"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {video.videoUrl && (
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Watch Video"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(video)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Video"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {pagination.totalPages} ({pagination.total} total videos)
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.title || ''}
        itemType="Video"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default VideoList;