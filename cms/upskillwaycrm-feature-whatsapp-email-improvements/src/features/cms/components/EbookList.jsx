/**
 * EbookList Component
 * 
 * This component displays a list of ebooks in a card-based grid layout.
 * Features include:
 * - Card-based grid layout with ebook covers and information
 * - Search functionality across ebook titles and descriptions
 * - Status filtering (Published, Draft, Archived)
 * - Bulk operations (select and delete multiple ebooks)
 * - Pagination with navigation controls
 * - Responsive design for all screen sizes
 * - Loading states and error handling
 */

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  BookOpen,
  Download,
  Play,
  ExternalLink,
  CheckCircle,
  Clock,
  Archive,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ebookService from '../services/ebookService.js';

/**
 * EbookList functional component
 * @param {Function} onCreateNew - Callback when user wants to create new ebook
 * @param {Function} onEdit - Callback when user wants to edit an ebook
 * @param {Function} onView - Callback when user wants to view ebook details
 */
const EbookList = ({ onCreateNew, onEdit, onView, onShowAPITest }) => {
  // State management
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEbooks, setTotalEbooks] = useState(0);
  const itemsPerPage = 12;
  
  // Bulk operations state
  const [selectedEbooks, setSelectedEbooks] = useState([]);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  /**
   * Fetch ebooks from API with current filters and pagination (with debugging)
   */
  const fetchEbooks = async () => {
    try {
      console.log('🔧 EbookList Debug: Starting to fetch ebooks');
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };

      console.log('🔧 Fetching ebooks with params:', params);
      const response = await ebookService.getEbooks(params);
      console.log('🔧 EbookList response received:', response);
      
      if (response.success) {
        console.log('🔧 Response successful, setting ebooks:', response.data);
        setEbooks(response.data || []);
        
        // Update pagination info
        if (response.pagination) {
          console.log('🔧 Setting pagination info:', response.pagination);
          setTotalPages(response.pagination.totalPages || 1);
          setTotalEbooks(response.pagination.total || 0);
        } else {
          console.log('🔧 No pagination info in response');
        }
      } else {
        console.error('🔧 Response not successful:', response);
        throw new Error(response.message || 'Failed to fetch ebooks');
      }
    } catch (error) {
      console.error('🔧 Error fetching ebooks:', error);
      console.error('🔧 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(error.message);
      toast.error('Failed to load ebooks');
    } finally {
      console.log('🔧 Setting loading to false');
      setLoading(false);
    }
  };

  // Fetch ebooks when component mounts or filters change
  useEffect(() => {
    console.log('🔧 EbookList Debug: useEffect triggered for fetchEbooks');
    console.log('🔧 Dependencies:', { currentPage, searchTerm, statusFilter });
    fetchEbooks();
  }, [currentPage, searchTerm, statusFilter]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    console.log('🔧 EbookList Debug: useEffect triggered for page reset');
    console.log('🔧 Current page:', currentPage);
    if (currentPage !== 1) {
      console.log('🔧 Resetting to page 1');
      setCurrentPage(1);
    }
  }, [currentPage, searchTerm, statusFilter]);

  /**
   * Handle search input change with debouncing
   * @param {Event} e - Input change event
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handle status filter change
   * @param {Event} e - Select change event
   */
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setSelectedEbooks([]); // Clear selections when filter changes
  };

  /**
   * Handle individual ebook selection for bulk operations
   * @param {string} ebookId - ID of ebook to toggle selection
   */
  const handleEbookSelect = (ebookId) => {
    setSelectedEbooks(prev => 
      prev.includes(ebookId) 
        ? prev.filter(id => id !== ebookId)
        : [...prev, ebookId]
    );
  };

  /**
   * Handle select all ebooks on current page
   */
  const handleSelectAll = () => {
    if (selectedEbooks.length === ebooks.length) {
      setSelectedEbooks([]);
    } else {
      setSelectedEbooks(ebooks.map(ebook => ebook.id));
    }
  };

  /**
   * Handle bulk delete of selected ebooks
   */
  const handleBulkDelete = async () => {
    if (selectedEbooks.length === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedEbooks.length} ebook${selectedEbooks.length > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setBulkDeleteLoading(true);
      
      const results = await ebookService.bulkDeleteEbooks(selectedEbooks);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      if (successful > 0) {
        toast.success(`Successfully deleted ${successful} ebook${successful > 1 ? 's' : ''}`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to delete ${failed} ebook${failed > 1 ? 's' : ''}`);
      }

      // Clear selections and refresh list
      setSelectedEbooks([]);
      fetchEbooks();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete ebooks');
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  /**
   * Handle page navigation
   * @param {number} page - Page number to navigate to
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedEbooks([]); // Clear selections when changing pages
    }
  };

  /**
   * Get status badge component for ebook status
   * @param {string} status - Ebook status (published, draft, archived)
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
        icon: CheckCircle
      },
      draft: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-800", 
        label: "Draft",
        icon: Clock
      },
      archived: { 
        bg: "bg-gray-100", 
        text: "text-gray-800", 
        label: "Archived",
        icon: Archive
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  /**
   * Get ebook cover image with fallback
   * @param {Object} ebook - Ebook object
   * @returns {string} Cover image URL
   */
  const getEbookCover = (ebook) => {
    return ebook.coverImageUrl || `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent(ebook.title.substring(0, 20))}`;
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Filters skeleton */}
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Ebooks</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchEbooks}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ebooks</h2>
          <p className="text-gray-600 mt-1">
            Manage your digital book collection ({totalEbooks} total)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {onShowAPITest && (
            <button
              onClick={onShowAPITest}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-5 w-5 mr-2" />
              API Test
            </button>
          )}
          <button
            onClick={onCreateNew}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Ebook
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ebooks by title or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEbooks.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-indigo-900">
                {selectedEbooks.length} ebook{selectedEbooks.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedEbooks([])}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleteLoading}
                className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {bulkDeleteLoading ? 'Deleting...' : 'Delete Selected'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ebooks Grid */}
      {ebooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ebooks found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first ebook.'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Your First Ebook
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Select All Checkbox */}
          <div className="flex items-center mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedEbooks.length === ebooks.length && ebooks.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Select all on this page
              </span>
            </label>
          </div>

          {/* Ebooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ebooks.map((ebook) => (
              <div
                key={ebook.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
                  selectedEbooks.includes(ebook.id) 
                    ? 'border-indigo-500 ring-2 ring-indigo-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedEbooks.includes(ebook.id)}
                    onChange={() => handleEbookSelect(ebook.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-white shadow-sm"
                  />
                </div>

                {/* Ebook Cover */}
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden rounded-t-lg">
                  <img 
                    src={getEbookCover(ebook)} 
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent(ebook.title.substring(0, 20))}`;
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(ebook.status)}
                  </div>
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(ebook)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => onEdit(ebook)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                        title="Edit Ebook"
                      >
                        <Edit3 className="h-5 w-5 text-gray-700" />
                      </button>
                      {ebook.pdfUrl && (
                        <a
                          href={ebook.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                          title="Download PDF"
                        >
                          <Download className="h-5 w-5 text-gray-700" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ebook Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {ebook.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {ebook.description}
                  </p>

                  {/* Tags */}
                  {ebook.tags && ebook.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {ebook.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {ebook.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{ebook.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(ebook)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(ebook)}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {ebook.videoUrl && (
                        <a
                          href={ebook.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                          title="Watch Video"
                        >
                          <Play className="h-4 w-4" />
                        </a>
                      )}
                      {ebook.pdfUrl && (
                        <a
                          href={ebook.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalEbooks)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{totalEbooks}</span>
                    {' '}results
                  </p>
                </div>
                
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      
                      // Show first page, last page, current page, and pages around current
                      const showPage = page === 1 || page === totalPages || 
                                     (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      if (!showPage) {
                        // Show ellipsis for gaps
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                            isCurrentPage
                              ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EbookList;