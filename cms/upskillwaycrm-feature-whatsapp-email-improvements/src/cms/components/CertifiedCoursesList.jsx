import { useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Search,
  Award,
  DollarSign,
  Video,
  Filter,
  Tag,
  Calendar,
} from "lucide-react";
import toastUtils from "../../utils/toastUtils";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import certifiedCoursesService from "../services/certifiedCoursesService.js";

const CertifiedCoursesList = ({ onCreateNew, onEdit, onView }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false
  });

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log("CertifiedCoursesList: Fetching courses with params:", params);
      const response = await certifiedCoursesService.getCertifiedCourses(params);
      console.log("CertifiedCoursesList: Received response:", response);

      const coursesData = response.data || [];
      console.log("CertifiedCoursesList: Setting courses data:", coursesData);

      setCourses(coursesData);
      setPagination(response.pagination || {});

      if (coursesData.length > 0) {
        console.log("CertifiedCoursesList: Successfully loaded", coursesData.length, "courses");
      } else {
        console.log("CertifiedCoursesList: No courses found");
      }
    } catch (error) {
      console.error("CertifiedCoursesList: Fetch courses error:", error);
      toast.error("Failed to fetch certified courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (id) => {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      item: course,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      await certifiedCoursesService.deleteCertifiedCourse(deleteModal.item.id);
      toastUtils.crud.deleted('Certified Course');
      fetchCourses(); // Refresh the list
      setDeleteModal({ isOpen: false, item: null, isLoading: false });
    } catch (error) {
      console.error("CertifiedCoursesList: Delete error:", error);
      toastUtils.crud.deleteError('Certified Course', error.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select courses to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedCourses.length} selected courses?`)) {
      try {
        await certifiedCoursesService.bulkDeleteCertifiedCourses(selectedCourses);
        toast.success(`${selectedCourses.length} courses deleted successfully`);
        setSelectedCourses([]);
        fetchCourses(); // Refresh the list
      } catch (error) {
        console.error("CertifiedCoursesList: Bulk delete error:", error);
        toast.error("Failed to delete selected courses");
      }
    }
  };

  const handleSelectCourse = (id) => {
    setSelectedCourses(prev => 
      prev.includes(id) 
        ? prev.filter(courseId => courseId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map(course => course.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: "bg-green-100", text: "text-green-800", label: "Published" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      archived: { bg: "bg-gray-100", text: "text-gray-800", label: "Archived" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certified Courses</h1>
          <p className="text-gray-600">Manage your certification programs</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Certification
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedCourses.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedCourses.length})
            </button>
          )}
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certified courses found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first certification program.</p>
            <button
              onClick={onCreateNew}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Certification
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCourses.length === courses.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Select All ({courses.length})
                </span>
              </div>
            </div>

            {/* Courses */}
            <div className="divide-y divide-gray-200">
              {courses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleSelectCourse(course.id)}
                        className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="h-5 w-5 text-purple-600 flex-shrink-0" />
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {course.title}
                          </h3>
                          {getStatusBadge(course.status)}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Course Details */}
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">
                              {formatCurrency(course.price)}
                            </span>
                          </div>
                          
                          {course.videoDemoUrl && (
                            <div className="flex items-center gap-1">
                              <Video className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-600">Demo Available</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(course.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Slug */}
                        <div className="mb-2">
                          <span className="text-xs text-gray-500">Slug: </span>
                          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {course.slug}
                          </span>
                        </div>

                        {/* Tags */}
                        {course.tags && course.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {course.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {course.tags.length > 4 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                +{course.tags.length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Syllabus Preview */}
                        {course.syllabus && (
                          <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700">
                            <strong>Syllabus:</strong> {course.syllabus.split('\n')[0]}
                            {course.syllabus.split('\n').length > 1 && '...'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(course)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(course)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
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
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * (pagination.limit || 10)) + 1} to{" "}
                    {Math.min(currentPage * (pagination.limit || 10), pagination.total || 0)} of{" "}
                    {pagination.total || 0} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={currentPage === pagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.title || ''}
        itemType="Certified Course"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default CertifiedCoursesList;