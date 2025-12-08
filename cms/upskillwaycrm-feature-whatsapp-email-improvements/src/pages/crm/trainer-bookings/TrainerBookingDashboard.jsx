import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Edit3,
  RefreshCw,
  Filter,
  Search,
  Settings
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import TrainerBookingCard from '../../../components/crm/TrainerBookingCard';
import TrainerCalendar from '../../../components/crm/TrainerCalendar';
import TrainerStatusManager from '../../../components/crm/TrainerStatusManager';
import CollegeTrainerAssignment from '../../../components/crm/CollegeTrainerAssignment';
import trainerBookingsApi from '../../../services/api/trainerBookingsApi';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

const TrainerBookingDashboard = () => {
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelling, setCancelling] = useState(false);
  
  // Trainer management state
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStatusManager, setShowStatusManager] = useState(false);
  const [showAssignmentManager, setShowAssignmentManager] = useState(false);
  const [trainers, setTrainers] = useState([]);
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false
  });

  useEffect(() => {
    fetchDashboardData();
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      // Mock trainers data - replace with actual API call
      const mockTrainers = [
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'John Smith', email: 'john@example.com', status: 'AVAILABLE' },
        { id: 'trainer-2', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'BOOKED' },
        { id: 'trainer-3', name: 'Mike Wilson', email: 'mike@example.com', status: 'AVAILABLE' }
      ];
      setTrainers(mockTrainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all bookings
      const bookingsResponse = await trainerBookingsApi.getAllBookings({ limit: 50 });
      
      if (bookingsResponse.success) {
        const allBookings = bookingsResponse.data;
        setBookings(allBookings);
        
        // Filter recent bookings (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recent = allBookings.filter(booking => 
          new Date(booking.createdAt) >= sevenDaysAgo
        );
        setRecentBookings(recent.slice(0, 5));
        
        // Filter upcoming bookings (next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const upcoming = allBookings.filter(booking => 
          new Date(booking.startTime) >= new Date() && 
          new Date(booking.startTime) <= thirtyDaysFromNow &&
          booking.status === 'ACTIVE'
        );
        setUpcomingBookings(upcoming.slice(0, 5));
      }
      
      // Fetch stats
      try {
        const statsResponse = await trainerBookingsApi.getBookingStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.warn('Stats not available, using calculated stats');
        // Calculate basic stats from bookings data
        const calculatedStats = {
          total: bookingsResponse.data.length,
          active: bookingsResponse.data.filter(b => b.status === 'ACTIVE').length,
          cancelled: bookingsResponse.data.filter(b => b.status === 'CANCELLED').length,
          completed: bookingsResponse.data.filter(b => b.status === 'COMPLETED').length
        };
        setStats(calculatedStats);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toastUtils.error('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/dashboard/crm/trainer-bookings/${bookingId}`);
  };

  const handleEditBooking = (bookingId) => {
    navigate(`/dashboard/crm/trainer-bookings/${bookingId}/edit`);
  };

  const handleCancelBooking = (booking) => {
    setDeleteModal({
      isOpen: true,
      item: booking,
      isLoading: false
    });
  };

  const confirmCancel = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      const response = await trainerBookingsApi.cancelBooking(deleteModal.item.id);
      
      if (response.success) {
        toastUtils.success('Booking cancelled successfully');
        fetchDashboardData(); // Refresh data
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toastUtils.error('Failed to cancel booking: ' + error.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
  };

  const handleTrainerSelect = (trainer) => {
    setSelectedTrainer(trainer);
    setShowCalendar(true);
    setShowStatusManager(false);
  };

  const handleStatusUpdate = (updatedTrainer) => {
    setTrainers(prev => prev.map(trainer => 
      trainer.id === updatedTrainer.id ? updatedTrainer : trainer
    ));
    if (selectedTrainer?.id === updatedTrainer.id) {
      setSelectedTrainer(updatedTrainer);
    }
    toastUtils.success('Trainer status updated successfully');
  };

  const handleBookingClick = (booking) => {
    navigate(`/dashboard/crm/trainer-bookings/${booking.id}`);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.trainer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookedByUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'text-purple-600 bg-purple-100',
      COMPLETED: 'text-purple-700 bg-purple-200',
      CANCELLED: 'text-purple-400 bg-purple-25'
    };
    return colors[status] || colors.ACTIVE;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="purple-theme crm-dashboard space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Booking Dashboard</h1>
          <p className="text-purple-600 mt-2">Overview of training sessions and bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => navigate('/dashboard/crm/trainer-bookings/create')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active || 0}</p>
              </div>
            </div>
          </div>
          
          
          <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-purple-300" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trainer Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trainer List */}
        <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trainers</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Calendar
              </button>
              <button
                onClick={() => setShowStatusManager(!showStatusManager)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-500 bg-purple-25 rounded-lg hover:bg-purple-50"
              >
                <Settings className="h-4 w-4 mr-1" />
                Status
              </button>
              <button
                onClick={() => setShowAssignmentManager(!showAssignmentManager)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
              >
                <Users className="h-4 w-4 mr-1" />
                Assignments
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTrainer?.id === trainer.id 
                    ? 'bg-purple-50 border-purple-300' 
                    : 'bg-purple-25 border-purple-200 hover:bg-purple-50'
                }`}
                onClick={() => handleTrainerSelect(trainer)}
              >
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trainer.name}</p>
                    <p className="text-xs text-gray-600">{trainer.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  trainer.status === 'AVAILABLE' 
                    ? 'bg-purple-100 text-purple-800' 
                    : trainer.status === 'BOOKED'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-purple-200 text-purple-900'
                }`}>
                  {trainer.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trainer Calendar */}
        {showCalendar && selectedTrainer && (
          <TrainerCalendar
            trainerId={selectedTrainer.id}
            trainerName={selectedTrainer.name}
            onBookingClick={handleBookingClick}
            className="lg:col-span-1"
          />
        )}

        {/* Trainer Status Manager */}
        {showStatusManager && selectedTrainer && (
          <TrainerStatusManager
            trainerId={selectedTrainer.id}
            trainerName={selectedTrainer.name}
            currentStatus={selectedTrainer.status}
            onStatusUpdate={handleStatusUpdate}
            className="lg:col-span-1"
          />
        )}

        {/* College Trainer Assignment Manager */}
        {showAssignmentManager && (
          <CollegeTrainerAssignment
            className="lg:col-span-2"
          />
        )}
      </div>

      {/* College Trainer Assignment Section */}
      <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">College-Trainer Assignments</h3>
              <p className="text-sm text-gray-600">Manage trainer assignments to colleges</p>
            </div>
          </div>
          <button
            onClick={() => setShowAssignmentManager(!showAssignmentManager)}
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              showAssignmentManager 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            {showAssignmentManager ? 'Hide Assignments' : 'Manage Assignments'}
          </button>
        </div>

        {showAssignmentManager ? (
          <CollegeTrainerAssignment />
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">College-Trainer Assignment Management</h4>
            <p className="text-gray-500 mb-4">
              Assign available trainers to colleges and manage their assignments
            </p>
            <button
              onClick={() => setShowAssignmentManager(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Open Assignment Manager
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button
              onClick={() => navigate('/dashboard/crm/trainer-bookings')}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View All
            </button>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No recent bookings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{booking.title}</p>
                    <p className="text-xs text-gray-500">
                      {booking.trainer?.name} • {formatDate(booking.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <button
                      onClick={() => handleViewBooking(booking.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <button
              onClick={() => navigate('/dashboard/crm/trainer-bookings')}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View All
            </button>
          </div>
          
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No upcoming sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{booking.title}</p>
                    <p className="text-xs text-gray-500">
                      {booking.trainer?.name} • {formatDate(booking.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <button
                      onClick={() => handleViewBooking(booking.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All Bookings */}
      <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">Get started by creating your first trainer booking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.slice(0, 9).map((booking) => (
              <TrainerBookingCard
                key={booking.id}
                booking={booking}
                onView={handleViewBooking}
                onEdit={handleEditBooking}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        )}

        {filteredBookings.length > 9 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/dashboard/crm/trainer-bookings')}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              View All Bookings
            </button>
          </div>
        )}
      </div>

      {/* College-Trainer Assignment Management */}
      <div className="mt-8">
        <CollegeTrainerAssignment />
      </div>

      {/* Cancel Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmCancel}
        itemName={deleteModal.item?.title || ''}
        itemType="Booking"
        isLoading={deleteModal.isLoading}
        confirmText="Cancel Booking"
        title="Cancel Training Session"
        message="Are you sure you want to cancel this training session? This action cannot be undone."
      />
    </div>
  );
};

export default TrainerBookingDashboard;
