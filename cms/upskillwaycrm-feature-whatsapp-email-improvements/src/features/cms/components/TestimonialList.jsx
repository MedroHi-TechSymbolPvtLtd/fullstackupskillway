import { useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Search,
  Calendar,
  User,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Play,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import testimonialService from "../services/testimonialService.js";

const TestimonialList = ({ onCreateNew, onEdit, onView }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log('TestimonialList: Fetching testimonials with params:', params);
      const response = await testimonialService.getTestimonials(params);
      console.log('TestimonialList: Received response:', response);
      
      const testimonialsData = response.data || [];
      console.log('TestimonialList: Setting testimonials data:', testimonialsData);
      
      setTestimonials(testimonialsData);
      setPagination(response.pagination || {});
      
      if (testimonialsData.length > 0) {
        console.log('TestimonialList: Successfully loaded', testimonialsData.length, 'testimonials');
      } else {
        console.log('TestimonialList: No testimonials found');
      }
    } catch (error) {
      console.error("TestimonialList: Fetch testimonials error:", error);
      toast.error(`Failed to fetch testimonials: ${error.message}`);
      setTestimonials([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (testimonialId) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await testimonialService.deleteTestimonial(testimonialId);
      toast.success("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete testimonial");
      console.error("Delete testimonial error:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTestimonials.length === 0) {
      toast.error("Please select testimonials to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedTestimonials.length} testimonial(s)?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedTestimonials.map((id) => testimonialService.deleteTestimonial(id)));
      toast.success(`${selectedTestimonials.length} testimonial(s) deleted successfully`);
      setSelectedTestimonials([]);
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete some testimonials");
      console.error("Bulk delete error:", error);
    }
  };

  const toggleSelectTestimonial = (testimonialId) => {
    setSelectedTestimonials((prev) =>
      prev.includes(testimonialId)
        ? prev.filter((id) => id !== testimonialId)
        : [...prev, testimonialId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTestimonials(
      selectedTestimonials.length === testimonials.length ? [] : testimonials.map((testimonial) => testimonial.id)
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
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
        icon: CheckCircle
      },
      pending: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        label: "Pending",
        icon: Clock
      },
      rejected: { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        label: "Rejected",
        icon: XCircle
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getAvatarUrl = (testimonial) => {
    if (testimonial.avatarUrl && testimonial.avatarUrl !== 'https://example.com/avatar.jpg') {
      return testimonial.avatarUrl;
    }
    // Generate a placeholder avatar based on name
    const initials = testimonial.authorName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.authorName)}&background=f97316&color=fff&size=128&bold=true`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Testimonial
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
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            {selectedTestimonials.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedTestimonials.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Testimonial List */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No testimonials found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start collecting testimonials from your satisfied customers"}
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add First Testimonial
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
                checked={selectedTestimonials.length === testimonials.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {selectedTestimonials.length > 0
                  ? `${selectedTestimonials.length} selected`
                  : "Select all"}
              </span>
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header with checkbox and status */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <input
                      type="checkbox"
                      checked={selectedTestimonials.includes(testimonial.id)}
                      onChange={() => toggleSelectTestimonial(testimonial.id)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    {getStatusBadge(testimonial.status)}
                  </div>
                </div>

                {/* Author Info */}
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={getAvatarUrl(testimonial)}
                      alt={testimonial.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.authorName)}&background=f97316&color=fff&size=128&bold=true`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {testimonial.authorName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(testimonial.createdAt)}
                    </div>
                    {testimonial.videoUrl && (
                      <div className="flex items-center">
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onView(testimonial)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(testimonial)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {testimonial.videoUrl && (
                      <a
                        href={testimonial.videoUrl}
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
                  <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md">
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

export default TestimonialList;