import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Settings
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import TrainerAvailabilityManager from '../../../components/crm/TrainerAvailabilityManager';
import trainerApi from '../../../services/api/trainerApi';
import toastUtils from '../../../utils/toastUtils';

const TrainerList = () => {
  const navigate = useNavigate();
  
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specializationFilter, setSpecializationFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const statusOptions = ['ALL', 'AVAILABLE', 'BOOKED', 'NOT_AVAILABLE', 'INACTIVE'];
  const specializationOptions = [
    'ALL', 'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'Django', 'Spring Boot',
    'Data Science', 'Machine Learning', 'AI', 'Web Development', 'Mobile Development',
    'DevOps', 'Cloud Computing', 'Database Design', 'UI/UX Design', 'Project Management'
  ];

  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        specialization: specializationFilter !== 'ALL' ? specializationFilter : undefined,
        sortBy,
        sortOrder
      };

      const response = await trainerApi.getAllTrainers(params);
      
      if (response.success) {
        setTrainers(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch trainers');
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toastUtils.error(`Failed to fetch trainers: ${error.message}`);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, specializationFilter, sortBy, sortOrder, itemsPerPage]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  // Listen for trainer creation/update events to refresh list in real-time
  useEffect(() => {
    const handleTrainerCreated = (event) => {
      console.log('TrainerList: Trainer created event received:', event.detail);
      // Refresh the trainers list to show the newly created trainer
      fetchTrainers();
      toastUtils.success('New trainer added! Refreshing list...');
    };

    const handleTrainersUpdated = (event) => {
      console.log('TrainerList: Trainers updated event received:', event.detail);
      // Refresh the trainers list
      fetchTrainers();
      if (event.detail.action === 'created') {
        toastUtils.success('New trainer added! Refreshing list...');
      } else {
        toastUtils.info('Trainer updated! Refreshing list...');
      }
    };

    window.addEventListener('trainerCreated', handleTrainerCreated);
    window.addEventListener('trainersUpdated', handleTrainersUpdated);

    return () => {
      window.removeEventListener('trainerCreated', handleTrainerCreated);
      window.removeEventListener('trainersUpdated', handleTrainersUpdated);
    };
  }, [fetchTrainers]);

  // Auto-refresh trainers every 60 seconds for real-time updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only auto-refresh if not actively filtering/searching and page is visible
      if (!searchTerm && statusFilter === 'ALL' && specializationFilter === 'ALL' && document.visibilityState === 'visible') {
        console.log('🔄 Auto-refreshing trainers list...');
        fetchTrainers();
      }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(refreshInterval);
  }, [searchTerm, statusFilter, specializationFilter, fetchTrainers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSpecializationFilterChange = (e) => {
    setSpecializationFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleDeleteClick = (trainer) => {
    setTrainerToDelete(trainer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!trainerToDelete) return;

    try {
      setDeleting(true);
      const response = await trainerApi.deleteTrainer(trainerToDelete.id);
      
      if (response.success) {
        toastUtils.success('Trainer deleted successfully');
        fetchTrainers();
      } else {
        throw new Error(response.message || 'Failed to delete trainer');
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
      toastUtils.error(`Failed to delete trainer: ${error.message}`);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setTrainerToDelete(null);
    }
  };

  const handleAvailabilityClick = (trainer) => {
    setSelectedTrainer(trainer);
    setAvailabilityModalOpen(true);
  };

  const handleAvailabilityUpdate = (updatedTrainer) => {
    // Update the trainer in the list
    setTrainers(prev => prev.map(trainer => 
      trainer.id === updatedTrainer.id ? { ...trainer, ...updatedTrainer } : trainer
    ));
    setAvailabilityModalOpen(false);
    setSelectedTrainer(null);
  };

  const handleCloseAvailabilityModal = () => {
    setAvailabilityModalOpen(false);
    setSelectedTrainer(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800';
      case 'NOT_AVAILABLE':
        return 'bg-red-100 text-red-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return CheckCircle;
      case 'BOOKED':
        return Clock;
      case 'NOT_AVAILABLE':
        return XCircle;
      case 'INACTIVE':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const formatSpecializations = (specializations) => {
    if (!specializations || specializations.length === 0) return 'None';
    if (specializations.length <= 2) return specializations.join(', ');
    return `${specializations.slice(0, 2).join(', ')} +${specializations.length - 2} more`;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 text-sm rounded-lg ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} trainers
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
          <p className="text-gray-600 mt-1">Manage trainer profiles and information</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/crm/trainers/create')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trainer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Filter */}
          <div>
            <select
              value={specializationFilter}
              onChange={handleSpecializationFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specializationOptions.map((specialization) => (
                <option key={specialization} value={specialization}>
                  {specialization === 'ALL' ? 'All Specializations' : specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="rating-desc">Rating (High-Low)</option>
              <option value="rating-asc">Rating (Low-High)</option>
              <option value="experience-desc">Experience (High-Low)</option>
              <option value="experience-asc">Experience (Low-High)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trainers List */}
      <div className="bg-white rounded-lg shadow border">
        {trainers.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trainers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'ALL' || specializationFilter !== 'ALL'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first trainer'
              }
            </p>
            {!searchTerm && statusFilter === 'ALL' && specializationFilter === 'ALL' && (
              <button
                onClick={() => navigate('/dashboard/crm/trainers/create')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Trainer
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {trainers.map((trainer) => {
              const StatusIcon = getStatusIcon(trainer.status);
              
              return (
                <div key={trainer.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {trainer.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>

                      {/* Trainer Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {trainer.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {trainer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {trainer.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {trainer.location}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {trainer.rating || 'N/A'}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            {trainer.experience} years
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {trainer.totalSessions || 0} sessions
                          </div>
                        </div>

                        <div className="mt-2">
                          <span className="text-sm text-gray-600">
                            <strong>Specializations:</strong> {formatSpecializations(trainer.specialization)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/crm/trainers/${trainer.id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/crm/trainers/${trainer.id}/edit`)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit Trainer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAvailabilityClick(trainer)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Update Availability"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(trainer)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Trainer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTrainerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Trainer"
        message={`Are you sure you want to delete "${trainerToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleting}
      />

      {/* Trainer Availability Manager Modal */}
      {availabilityModalOpen && selectedTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <TrainerAvailabilityManager
              trainerId={selectedTrainer.id}
              trainerName={selectedTrainer.name}
              currentAvailability={selectedTrainer.availability || 'AVAILABLE'}
              currentStatus={selectedTrainer.status || 'AVAILABLE'}
              onAvailabilityUpdate={handleAvailabilityUpdate}
              className="border-0"
            />
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseAvailabilityModal}
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerList;