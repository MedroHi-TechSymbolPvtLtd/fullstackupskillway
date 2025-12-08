import { useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Search,
  Calendar,
  User,
  Tag,
  Play,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import videoService from "../services/videoService.js";
import mediaUtils from "../utils/mediaUtils.js";

const VideoList = ({ onCreateNew, onEdit, onView }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedVideos, setSelectedVideos] = useState([]);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log('VideoList: Fetching videos with params:', params);
      const response = await videoService.getVideos(params);
      console.log('VideoList: Received response:', response);
      
      const videosData = response.data || [];
      console.log('VideoList: Setting videos data:', videosData);
      
      setVideos(videosData);
      setPagination(response.pagination || {});
      
      if (videosData.length > 0) {
        console.log('VideoList: Successfully loaded', videosData.length, 'videos');
      } else {
        console.log('VideoList: No videos found');
      }
    } catch (error) {
      console.error("VideoList: Fetch videos error:", error);
      toast.error(`Failed to fetch videos: ${error.message}`);
      setVideos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Cleanup any media on unmount
  useEffect(() => {
    return () => {
      mediaUtils.pauseAllMedia();
    };
  }, []);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await videoService.deleteVideo(videoId);
      toast.success("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      toast.error("Failed to delete video");
      console.error("Delete video error:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) {
      toast.error("Please select videos to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedVideos.length} video(s)?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedVideos.map((id) => videoService.deleteVideo(id)));
      toast.success(`${selectedVideos.length} video(s) deleted successfully`);
      setSelectedVideos([]);
      fetchVideos();
    } catch (error) {
      toast.error("Failed to delete some videos");
      console.error("Bulk delete error:", error);
    }
  };

  const toggleSelectVideo = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedVideos(
      selectedVideos.length === videos.length ? [] : videos.map((video) => video.id)
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
      },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      archived: { bg: "bg-gray-100", text: "text-gray-800", label: "Archived" },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getVideoThumbnail = (videoUrl) => {
    return mediaUtils.getYouTubeThumbnail(videoUrl, 'medium');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Videos</h2>
          <p className="text-gray-600">Manage your video content</p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Video
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            {selectedVideos.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedVideos.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video List */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start creating engaging video content for your audience"}
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Video
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedVideos.length === videos.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {selectedVideos.length > 0
                  ? `${selectedVideos.length} selected`
                  : "Select all"}
              </span>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={getVideoThumbnail(video.videoUrl)}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/320x180/f97316/ffffff?text=Video';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedVideos.includes(video.id)}
                      onChange={() => toggleSelectVideo(video.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(video.status)}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(video.createdAt)}
                    </div>
                    {video.creator && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {video.creator.name || 'Unknown'}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{video.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onView(video)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(video)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {video.videoUrl && (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Watch Video"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(currentPage * pagination.limit, pagination.total)}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
                    {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.totalPages)
                      )
                    }
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoList;