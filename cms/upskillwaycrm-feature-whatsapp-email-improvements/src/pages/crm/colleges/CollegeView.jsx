import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Users,
  DollarSign,
  Globe,
  Award,
  GraduationCap,
  ExternalLink,
  Clock as ClockIcon
} from 'lucide-react';
import collegesApi from '../../../services/api/collegesApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

const CollegeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isLoading: false
  });

  useEffect(() => {
    fetchCollege();
  }, [id]);

  const fetchCollege = async () => {
    try {
      setLoading(true);
      const response = await collegesApi.getCollegeById(id);
      
      if (response.success) {
        setCollege(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch college');
      }
    } catch (error) {
      console.error('Error fetching college:', error);
      toastUtils.crud.fetchError('College', error.message);
      navigate('/dashboard/crm/colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/crm/colleges/${id}/edit`);
  };

  const handleDelete = () => {
    if (!college) return;

    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    if (!college) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      const response = await collegesApi.deleteCollege(college.id);
      
      if (response.success) {
        toastUtils.crud.deleteSuccess('College');
        navigate('/dashboard/crm/colleges');
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
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
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!college) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">College not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The college you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard/crm/colleges')}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Colleges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/crm/colleges')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{college.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              {getStatusBadge(college.status)}
              {getTypeBadge(college.type)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">College Name</label>
                <p className="text-sm text-gray-900">{college.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                <div className="mt-1">
                  {getTypeBadge(college.type)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Ranking</label>
                <p className="text-sm text-gray-900">#{college.ranking || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Established Year</label>
                <p className="text-sm text-gray-900">{college.establishedYear || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Enrollment</label>
                <p className="text-sm text-gray-900">{college.enrollment?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Average Rating</label>
                <p className="text-sm text-gray-900">{college.avgRating ? `${college.avgRating}/5` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Location</label>
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  {college.location}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <p className="text-sm text-gray-900">{college.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                <p className="text-sm text-gray-900">{college.state}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Person</label>
                <p className="text-sm text-gray-900">{college.contactPerson || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Email</label>
                <div className="flex items-center text-sm text-gray-900">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  {college.contactEmail || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Phone</label>
                <div className="flex items-center text-sm text-gray-900">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  {college.contactPhone || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Financial Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Total Revenue</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(college.totalRevenue || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Ranking</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">#{college.ranking || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Enrollment</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {college.enrollment?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-600">Established</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{college.establishedYear || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {college.avgRating ? `${college.avgRating}/5` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                <div className="flex items-center text-sm text-gray-900">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {formatDateTime(college.createdAt)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                <div className="flex items-center text-sm text-gray-900">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {formatDateTime(college.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, isLoading: false })}
        onConfirm={confirmDelete}
        isLoading={deleteModal.isLoading}
        title="Delete College"
        message={`Are you sure you want to delete "${college?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CollegeView;
