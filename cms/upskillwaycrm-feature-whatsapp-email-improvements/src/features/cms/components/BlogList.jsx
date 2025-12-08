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
} from "lucide-react";
import toast from "react-hot-toast";
import blogService from "../services/blogService.js";

const BlogList = ({ onCreateNew, onEdit, onView }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedBlogs, setSelectedBlogs] = useState([]);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log('BlogList: Fetching blogs with params:', params);
      const response = await blogService.getBlogs(params);
      console.log('BlogList: Received response:', response);
      
      const blogsData = response.data || [];
      console.log('BlogList: Setting blogs data:', blogsData);
      
      setBlogs(blogsData);
      setPagination(response.pagination || {});
      
      if (blogsData.length > 0) {
        console.log('BlogList: Successfully loaded', blogsData.length, 'blogs');
      } else {
        console.log('BlogList: No blogs found');
      }
    } catch (error) {
      console.error("BlogList: Fetch blogs error:", error);
      toast.error(`Failed to fetch blogs: ${error.message}`);
      setBlogs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      await blogService.deleteBlog(blogId);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
      console.error("Delete blog error:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) {
      toast.error("Please select blogs to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedBlogs.length} blog post(s)?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedBlogs.map((id) => blogService.deleteBlog(id)));
      toast.success(`${selectedBlogs.length} blog(s) deleted successfully`);
      setSelectedBlogs([]);
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete some blogs");
      console.error("Bulk delete error:", error);
    }
  };

  const toggleSelectBlog = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === blogs.length ? [] : blogs.map((blog) => blog.id)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info - Remove in production */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <div className="font-medium text-blue-800 mb-2">Debug Info:</div>
        <div className="text-blue-700 space-y-1">
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Blogs count: {blogs.length}</div>
          <div>Status filter: {statusFilter}</div>
          <div>Search term: "{searchTerm}"</div>
          <div>Current page: {currentPage}</div>
          <div>Total pages: {pagination.totalPages || 'N/A'}</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-gray-600">Manage your blog content</p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Blog Post
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
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            {selectedBlogs.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedBlogs.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Edit3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start creating engaging content for your audience"}
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Blog Post
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
                checked={selectedBlogs.length === blogs.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {selectedBlogs.length > 0
                  ? `${selectedBlogs.length} selected`
                  : "Select all"}
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.includes(blog.id)}
                      onChange={() => toggleSelectBlog(blog.id)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {blog.title}
                        </h3>
                        {getStatusBadge(blog.status)}
                      </div>

                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(blog.createdAt)}
                        </div>
                        {blog.creator && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {blog.creator.name || "Unknown"}
                          </div>
                        )}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {blog.tags.slice(0, 2).join(", ")}
                            {blog.tags.length > 2 &&
                              ` +${blog.tags.length - 2}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(blog)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(blog)}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                  <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-md">
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

export default BlogList;
