import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Users,
  DollarSign,
  Globe
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import collegesApi from '../../../services/api/collegesApi';
import leadsApi from '../../../services/api/leadsApi';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

const CollegeList = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showConvertedLeads, setShowConvertedLeads] = useState(false);
  const [convertedLeads, setConvertedLeads] = useState([]);
  const [convertedLeadsLoading, setConvertedLeadsLoading] = useState(false);
  const [convertedLeadsPagination, setConvertedLeadsPagination] = useState({});
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false
  });

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 CollegeList - Starting to fetch colleges...');
      
      const params = {
        page: currentPage,
        limit: 10,
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log('🔄 CollegeList - Fetch params:', params);

      const response = await collegesApi.getAllColleges(params);
      
      console.log('📦 CollegeList - API Response:', response);
      console.log('📦 CollegeList - Response data:', response.data);
      console.log('📦 CollegeList - Response pagination:', response.pagination);
      
      if (response.success) {
        const collegeData = response.data || [];
        console.log(`✅ CollegeList - Setting ${collegeData.length} colleges:`, collegeData);
        setColleges(collegeData);
        setPagination(response.pagination || {});
        
        // Debug: Check for converted colleges
        const convertedColleges = collegeData.filter(college => college.sourceLeadId);
        console.log(`🔄 CollegeList - Found ${convertedColleges.length} converted colleges:`, convertedColleges);
      } else {
        console.error('❌ CollegeList - API returned error:', response.message);
        throw new Error(response.message || 'Failed to fetch colleges');
      }
    } catch (error) {
      console.error('❌ CollegeList - Error fetching colleges:', error);
      toastUtils.crud.fetchError('College', error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, typeFilter, statusFilter, searchTerm]);

  const fetchConvertedLeads = useCallback(async () => {
    try {
      setConvertedLeadsLoading(true);
      const response = await leadsApi.getConvertedLeads({
        page: currentPage,
        limit: 10
      });
      
      if (response.success) {
        setConvertedLeads(response.data || []);
        setConvertedLeadsPagination(response.pagination || {});
      } else {
        throw new Error(response.message || 'Failed to fetch converted leads');
      }
    } catch (error) {
      console.error('Error fetching converted leads:', error);
      toastUtils.error('Failed to load converted leads');
      setConvertedLeads([]);
    } finally {
      setConvertedLeadsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Listen for lead conversion events to refresh college list in real-time
  useEffect(() => {
    const handleLeadConverted = (event) => {
      console.log('CollegeList: Lead converted event received:', event.detail);
      // Refresh the college list to show the newly created/linked college
      fetchColleges();
      // Also refresh converted leads if the view is shown
      if (showConvertedLeads) {
        fetchConvertedLeads();
      }
      toastUtils.success('New college added from lead conversion! Refreshing list...');
    };

    const handleCollegeCreated = (event) => {
      console.log('CollegeList: College created event received:', event.detail);
      // Refresh the college list
      fetchColleges();
      // Also refresh converted leads if the view is shown
      if (showConvertedLeads) {
        fetchConvertedLeads();
      }
      if (event.detail.college) {
        toastUtils.success(`New college "${event.detail.college.name}" created from lead conversion!`);
      }
    };

    const handleCollegesUpdated = (event) => {
      console.log('CollegeList: Colleges updated event received:', event.detail);
      // Refresh the college list
      fetchColleges();
      // Also refresh converted leads if the view is shown
      if (showConvertedLeads) {
        fetchConvertedLeads();
      }
    };

    window.addEventListener('leadConverted', handleLeadConverted);
    window.addEventListener('collegeCreated', handleCollegeCreated);
    window.addEventListener('collegesUpdated', handleCollegesUpdated);

    return () => {
      window.removeEventListener('leadConverted', handleLeadConverted);
      window.removeEventListener('collegeCreated', handleCollegeCreated);
      window.removeEventListener('collegesUpdated', handleCollegesUpdated);
    };
  }, [fetchColleges, fetchConvertedLeads, showConvertedLeads]);

  // Auto-refresh colleges every 60 seconds for real-time updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only auto-refresh if not actively filtering/searching and page is visible
      if (!searchTerm && typeFilter === 'all' && statusFilter === 'all' && document.visibilityState === 'visible') {
        console.log('🔄 Auto-refreshing colleges list...');
        fetchColleges();
      }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(refreshInterval);
  }, [searchTerm, typeFilter, statusFilter, fetchColleges]);

  // Fetch converted leads when view is shown
  useEffect(() => {
    if (showConvertedLeads) {
      fetchConvertedLeads();
    }
  }, [showConvertedLeads, fetchConvertedLeads]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'type') {
      setTypeFilter(value);
    } else if (filterType === 'status') {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handleView = (id) => {
    navigate(`/dashboard/crm/colleges/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/crm/colleges/${id}/edit`);
  };

  const handleDelete = (college) => {
    setDeleteModal({
      isOpen: true,
      item: college,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      const response = await collegesApi.deleteCollege(deleteModal.item.id);
      
      if (response.success) {
        toastUtils.crud.deleteSuccess('College');
        setColleges(prev => prev.filter(college => college.id !== deleteModal.item.id));
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to delete college');
      }
    } catch (error) {
      console.error('Error deleting college:', error);
      toastUtils.crud.deleteError('College', error.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      INACTIVE: { color: 'bg-red-100 text-red-800', icon: XCircle },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      PARTNER: { color: 'bg-blue-100 text-blue-800', icon: Star }
    };

    const config = statusConfig[status] || statusConfig.INACTIVE;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      ENGINEERING: { color: 'bg-blue-100 text-blue-800' },
      MEDICAL: { color: 'bg-red-100 text-red-800' },
      BUSINESS: { color: 'bg-green-100 text-green-800' },
      ARTS: { color: 'bg-purple-100 text-purple-800' },
      SCIENCE: { color: 'bg-yellow-100 text-yellow-800' },
      LAW: { color: 'bg-indigo-100 text-indigo-800' },
      OTHER: { color: 'bg-gray-100 text-gray-800' }
    };

    const config = typeConfig[type] || typeConfig.OTHER;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {type}
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Colleges</h1>
          <p className="text-purple-600">Manage college information and partnerships</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowConvertedLeads(!showConvertedLeads)}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
              showConvertedLeads
                ? 'bg-purple-700 text-white'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            title="View converted leads with colleges"
          >
            <Users className="w-5 h-5 mr-2" />
            {showConvertedLeads ? 'Hide' : 'Show'} Converted Leads
          </button>
          <button
            onClick={fetchColleges}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Refresh colleges list (includes converted leads)"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => {
              console.log('🔍 DEBUG - Manual localStorage check...');
              const storageData = localStorage.getItem('colleges-data');
              console.log('🔍 DEBUG - Raw localStorage data:', storageData);
              const parsed = storageData ? JSON.parse(storageData) : [];
              console.log('🔍 DEBUG - Parsed colleges:', parsed);
              const converted = parsed.filter(c => c.sourceLeadId);
              console.log('🔍 DEBUG - Converted colleges:', converted);
              alert(`Found ${parsed.length} colleges in localStorage (${converted.length} from conversions)`);
            }}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            title="Debug localStorage"
          >
            🔍 Debug
          </button>
          <button
            onClick={() => navigate('/dashboard/crm/colleges/create')}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add College
          </button>
        </div>
      </div>

      {/* Converted Leads View */}
      {showConvertedLeads && (
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Converted Leads</h2>
              <p className="text-sm text-gray-600 mt-1">Leads that have been converted to colleges</p>
            </div>
            <button
              onClick={() => setShowConvertedLeads(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {convertedLeadsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : convertedLeads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No converted leads found</h3>
              <p className="text-gray-500">Convert leads to see them here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {convertedLeads.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.email}</div>
                          <div className="text-xs text-gray-400">{item.organization}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.college ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.college.name}</div>
                            <div className="text-xs text-gray-500">{item.college.status}</div>
                            <div className="text-xs text-gray-400">{item.college.city}, {item.college.state}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No college linked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.convertedAt ? formatDate(item.convertedAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/crm/leads/${item.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Lead"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {item.college && (
                            <button
                              onClick={() => navigate(`/dashboard/crm/colleges/${item.college.id}`)}
                              className="text-purple-600 hover:text-purple-900"
                              title="View College"
                            >
                              <Building2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination for converted leads */}
          {convertedLeadsPagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {((convertedLeadsPagination.page - 1) * convertedLeadsPagination.limit) + 1} to{' '}
                {Math.min(convertedLeadsPagination.page * convertedLeadsPagination.limit, convertedLeadsPagination.total)} of{' '}
                {convertedLeadsPagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!convertedLeadsPagination.hasPrev}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, convertedLeadsPagination.totalPages))}
                  disabled={!convertedLeadsPagination.hasNext}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="ENGINEERING">Engineering</option>
            <option value="MEDICAL">Medical</option>
            <option value="BUSINESS">Business</option>
            <option value="ARTS">Arts</option>
            <option value="SCIENCE">Science</option>
            <option value="LAW">Law</option>
            <option value="OTHER">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
            <option value="PARTNER">Partner</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">🔍 Debug Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Total Colleges:</span>
            <span className="ml-2 text-blue-700">{pagination.total || 0}</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">From Conversions:</span>
            <span className="ml-2 text-blue-700">
              {colleges.filter(college => college.sourceLeadId).length}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Data Source:</span>
            <span className="ml-2 text-blue-700">
              {colleges.length > 0 ? 'localStorage' : 'empty'}
            </span>
          </div>
        </div>
        {colleges.filter(college => college.sourceLeadId).length > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            💡 Colleges with sourceLeadId were created from lead conversions
          </div>
        )}
      </div>

      {/* Colleges Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {colleges.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No colleges found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'Get started by creating a new college.'}
            </p>
            {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/dashboard/crm/colleges/create')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add College
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">
                              {college.name}
                            </div>
                            {/* Conversion Indicator */}
                            {college.sourceLeadId && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🔄 From Lead
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {college.sourceLeadId ? (
                              <>Converted from Lead ID: {college.sourceLeadId}</>
                            ) : (
                              <>Ranking: #{college.ranking || 'N/A'}</>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(college.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {college.city}, {college.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400 mr-1" />
                          {college.contactEmail}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          {college.contactPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(college.totalRevenue || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(college.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(college.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(college.id)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded-md hover:bg-orange-50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(college.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(college)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrev}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={!pagination.hasNext}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((pagination.page - 1) * pagination.limit) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, isLoading: false })}
        onConfirm={confirmDelete}
        isLoading={deleteModal.isLoading}
        title="Delete College"
        message={`Are you sure you want to delete "${deleteModal.item?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CollegeList;
