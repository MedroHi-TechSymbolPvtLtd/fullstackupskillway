/**
 * VideoList Component
 * 
 * This component displays a list of videos in a card-based layout.
 * Features include:
 * - Search functionality across video titles and descriptions
 * - Status filtering (Published, Draft, Archived)
 * - Bulk operations (select and delete multiple videos)
 * - Pagination with navigation controls
 * - YouTube video thumbnails and previews
 * - External link integration
 */

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Play, 
  Video, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Archive, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  AlertCircle 
} from 'lucide-react';
import 'react-hot-toast';
import videoService from '../services/videoService.js';

// Badge component helper
const Badge = ({ variant = "default", children }) => {
  const variantClasses = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    secondary: "bg-gray-100 text-gray-800",
    default: "bg-blue-100 text-blue-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant] || variantClasses.default}`}>
      {children}
    </span>
  );
};

// Pagination component helper
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const VideoList = ({ onCreateNew, onEdit, onView, refreshTrigger }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // Fetch videos when component mounts or refreshTrigger changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: searchTerm,
        };
        
        const response = await videoService.getVideos(params);
        
        setVideos(response.data || []);
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          limit: pagination.limit,
        });
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [pagination.currentPage, pagination.limit, searchTerm, refreshTrigger]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination({ ...pagination, currentPage: 1 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      published: "success",
      draft: "warning",
      archived: "secondary",
    };
    
    return (
      <Badge variant={statusMap[status] || "default"}>
        {status || "unknown"}
      </Badge>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      <div className="p-6 border-b flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Videos</h2>
          <p className="text-gray-600 mt-1">Manage your video content</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Video
        </button>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search videos..."
                className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No videos found. Create your first video!
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tools</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">FAQs</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {videos.map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <div>
                            <div className="font-medium">{video.title}</div>
                            {video.tags && video.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {video.tags.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                                {video.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">+{video.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {video.masteredTools && video.masteredTools.length > 0 ? (
                            <div className="flex items-center gap-1">
                              {video.masteredTools.slice(0, 3).map((tool, idx) => (
                                <img 
                                  key={idx} 
                                  src={tool.logoUrl} 
                                  alt={tool.name} 
                                  title={tool.name}
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              ))}
                              {video.masteredTools.length > 3 && (
                                <span className="text-xs text-gray-500">+{video.masteredTools.length - 3}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {video.faqs && video.faqs.length > 0 ? (
                            <span className="text-sm">{video.faqs.length} FAQ{video.faqs.length !== 1 ? 's' : ''}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(video.status)}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(video.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                              onClick={() => onView(video)}
                            >
                              View
                            </button>
                            <button
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                              onClick={() => onEdit(video)}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoList;