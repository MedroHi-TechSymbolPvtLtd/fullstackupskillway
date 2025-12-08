import { useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Search,
  MapPin,
  DollarSign,
  GraduationCap,
  Filter,
  MoreVertical,
} from "lucide-react";
import toastUtils from "../../utils/toastUtils";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import studyAbroadService from "../services/studyAbroadService.js";

const StudyAbroadList = ({ onCreateNew, onEdit, onView }) => {
  const [studyAbroadRecords, setStudyAbroadRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false
  });

  const fetchStudyAbroadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log("StudyAbroadList: Fetching records with params:", params);
      const response = await studyAbroadService.getStudyAbroadRecords(params);
      console.log("StudyAbroadList: Received response:", response);

      const recordsData = response.data || [];
      console.log("StudyAbroadList: Setting records data:", recordsData);

      setStudyAbroadRecords(recordsData);
      setPagination(response.pagination || {});

      if (recordsData.length > 0) {
        console.log("StudyAbroadList: Successfully loaded", recordsData.length, "records");
      } else {
        console.log("StudyAbroadList: No records found");
      }
    } catch (error) {
      console.error("StudyAbroadList: Fetch records error:", error);
      toast.error("Failed to fetch study abroad records");
      setStudyAbroadRecords([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchStudyAbroadRecords();
  }, [fetchStudyAbroadRecords]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (id) => {
    const record = studyAbroadRecords.find(r => r.id === id);
    if (!record) return;

    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      item: record,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      await studyAbroadService.deleteStudyAbroad(deleteModal.item.id);
      toastUtils.crud.deleted('Study Abroad Record');
      fetchStudyAbroadRecords(); // Refresh the list
      setDeleteModal({ isOpen: false, item: null, isLoading: false });
    } catch (error) {
      console.error("StudyAbroadList: Delete error:", error);
      toastUtils.crud.deleteError('Study Abroad Record', error.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
  };

  const handleBulkDelete = async () => {
    if (selectedRecords.length === 0) {
      toast.error("Please select records to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} selected records?`)) {
      try {
        await studyAbroadService.bulkDeleteStudyAbroad(selectedRecords);
        toast.success(`${selectedRecords.length} records deleted successfully`);
        setSelectedRecords([]);
        fetchStudyAbroadRecords(); // Refresh the list
      } catch (error) {
        console.error("StudyAbroadList: Bulk delete error:", error);
        toast.error("Failed to delete selected records");
      }
    }
  };

  const handleSelectRecord = (id) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(recordId => recordId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === studyAbroadRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(studyAbroadRecords.map(record => record.id));
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Abroad</h1>
          <p className="text-gray-600">Manage study abroad destinations and programs</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Destination
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
                placeholder="Search by city, university, or tags..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedRecords.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedRecords.length})
            </button>
          )}
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {studyAbroadRecords.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study abroad records found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first study abroad destination.</p>
            <button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Destination
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRecords.length === studyAbroadRecords.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Select All ({studyAbroadRecords.length})
                </span>
              </div>
            </div>

            {/* Records */}
            <div className="divide-y divide-gray-200">
              {studyAbroadRecords.map((record) => (
                <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {record.imageUrl ? (
                          <img
                            src={record.imageUrl}
                            alt={record.city}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                            <MapPin className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {record.city}
                          </h3>
                          {getStatusBadge(record.status)}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {record.description}
                        </p>

                        {/* Universities */}
                        {record.universities && record.universities.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {record.universities.slice(0, 2).join(", ")}
                              {record.universities.length > 2 && ` +${record.universities.length - 2} more`}
                            </span>
                          </div>
                        )}

                        {/* Financial Info */}
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Tuition: {formatCurrency(record.avgTuition)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Living: {formatCurrency(record.livingCost)}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {record.tags && record.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {record.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {record.tags.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                +{record.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(record)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(record)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
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
        itemName={deleteModal.item?.title || deleteModal.item?.programName || ''}
        itemType="Study Abroad Record"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default StudyAbroadList;