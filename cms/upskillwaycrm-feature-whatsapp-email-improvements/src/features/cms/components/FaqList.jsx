import { useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Search,
  Calendar,
  User,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";
import faqService from "../services/faqService.js";

const FaqList = ({ onCreateNew, onEdit, onView }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedFaqs, setSelectedFaqs] = useState([]);
  const [expandedFaqs, setExpandedFaqs] = useState([]);

  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log('FaqList: Fetching FAQs with params:', params);
      const response = await faqService.getFaqs(params);
      console.log('FaqList: Received response:', response);
      
      const faqsData = response.data || [];
      console.log('FaqList: Setting FAQs data:', faqsData);
      
      setFaqs(faqsData);
      setPagination(response.pagination || {});
      
      if (faqsData.length > 0) {
        console.log('FaqList: Successfully loaded', faqsData.length, 'FAQs');
      } else {
        console.log('FaqList: No FAQs found');
      }
    } catch (error) {
      console.error("FaqList: Fetch FAQs error:", error);
      toast.error(`Failed to fetch FAQs: ${error.message}`);
      setFaqs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoryFilter, searchTerm]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleDelete = async (faqId) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }

    try {
      await faqService.deleteFaq(faqId);
      toast.success("FAQ deleted successfully");
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to delete FAQ");
      console.error("Delete FAQ error:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFaqs.length === 0) {
      toast.error("Please select FAQs to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedFaqs.length} FAQ(s)?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedFaqs.map((id) => faqService.deleteFaq(id)));
      toast.success(`${selectedFaqs.length} FAQ(s) deleted successfully`);
      setSelectedFaqs([]);
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to delete some FAQs");
      console.error("Bulk delete error:", error);
    }
  };

  const toggleSelectFaq = (faqId) => {
    setSelectedFaqs((prev) =>
      prev.includes(faqId)
        ? prev.filter((id) => id !== faqId)
        : [...prev, faqId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedFaqs(
      selectedFaqs.length === faqs.length ? [] : faqs.map((faq) => faq.id)
    );
  };

  const toggleExpandFaq = (faqId) => {
    setExpandedFaqs((prev) =>
      prev.includes(faqId)
        ? prev.filter((id) => id !== faqId)
        : [...prev, faqId]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'Getting Started': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Account': { bg: 'bg-green-100', text: 'text-green-800' },
      'Billing': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Technical': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'General': { bg: 'bg-gray-100', text: 'text-gray-800' },
    };

    const config = categoryColors[category] || categoryColors['General'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {category}
      </span>
    );
  };

  // Get unique categories from FAQs for filter
  const getUniqueCategories = () => {
    const categories = faqs.map(faq => faq.category).filter(Boolean);
    return [...new Set(categories)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New FAQ
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
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {getUniqueCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {selectedFaqs.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedFaqs.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      {faqs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No FAQs found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start creating helpful FAQs for your users"}
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First FAQ
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
                checked={selectedFaqs.length === faqs.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {selectedFaqs.length > 0
                  ? `${selectedFaqs.length} selected`
                  : "Select all"}
              </span>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedFaqs.includes(faq.id)}
                      onChange={() => toggleSelectFaq(faq.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      {/* Question Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <button
                          onClick={() => toggleExpandFaq(faq.id)}
                          className="flex items-center space-x-2 text-left hover:text-green-600 transition-colors"
                        >
                          {expandedFaqs.includes(faq.id) ? (
                            <ChevronDown className="h-4 w-4 text-green-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                        </button>
                        {faq.category && getCategoryBadge(faq.category)}
                      </div>
                      
                      {/* Answer (expandable) */}
                      {expandedFaqs.includes(faq.id) && (
                        <div className="ml-6 mb-3">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                      
                      {/* Meta Information */}
                      <div className="flex items-center space-x-4 ml-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(faq.createdAt)}
                        </div>
                        {faq.creator && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {faq.creator.name || 'Unknown'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(faq)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(faq)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
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
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
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

export default FaqList;