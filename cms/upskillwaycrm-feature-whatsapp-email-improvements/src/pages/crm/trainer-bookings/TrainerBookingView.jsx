import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import trainerBookingsApi from '../../../services/api/trainerBookingsApi';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

const TrainerBookingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isLoading: false
  });

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await trainerBookingsApi.getBookingById(id);
      
      if (response.success) {
        setBooking(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch booking');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toastUtils.crud.fetchError('Booking', error.message);
      navigate('/dashboard/crm/trainer-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setDeleteModal({
      isOpen: true,
      isLoading: false
    });
  };

  const confirmCancel = async () => {
    if (!booking) return;

    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      const response = await trainerBookingsApi.cancelBooking(booking.id);
      
      if (response.success) {
        toastUtils.success('Booking cancelled successfully');
        setBooking(response.data);
        setDeleteModal({ isOpen: false, isLoading: false });
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
    setDeleteModal({ isOpen: false, isLoading: false });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRange = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startStr = start.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endStr = end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${startStr} - ${endStr}`;
  };

  const getDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInHours = Math.abs(end - start) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)} minutes`;
    } else if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours`;
    } else {
      return `${Math.round(diffInHours / 24)} days`;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { 
        label: 'Active', 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle 
      },
      CANCELLED: { 
        label: 'Cancelled', 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle 
      },
      COMPLETED: { 
        label: 'Completed', 
        color: 'bg-blue-100 text-blue-800', 
        icon: CheckCircle 
      }
    };

    const config = statusConfig[status] || statusConfig.ACTIVE;
    const StatusIcon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <StatusIcon className="h-4 w-4 mr-2" />
        {config.label}
      </span>
    );
  };

  const isUpcoming = (startTime) => {
    return new Date(startTime) > new Date();
  };

  const isPast = (endTime) => {
    return new Date(endTime) < new Date();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Booking not found</h3>
        <p className="text-gray-500">The booking you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/crm/trainer-bookings')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{booking.title}</h1>
            <p className="text-gray-600 mt-1">Training session details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBooking}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            title="Refresh Booking Data"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => navigate(`/dashboard/crm/trainer-bookings/${booking.id}/edit`)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Booking
          </button>
          {booking.status === 'ACTIVE' && (
            <button
              onClick={handleCancelBooking}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Overview */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Overview</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                {getStatusBadge(booking.status)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Duration</span>
                <span className="text-sm text-gray-900">{getDuration(booking.startTime, booking.endTime)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Session Type</span>
                <span className="text-sm text-gray-900">
                  {isUpcoming(booking.startTime) ? 'Upcoming' : 
                   isPast(booking.endTime) ? 'Past' : 'Ongoing'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Created</span>
                <span className="text-sm text-gray-900">{formatDate(booking.createdAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <span className="text-sm text-gray-900">{formatDate(booking.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{booking.description}</p>
          </div>

          {/* Schedule Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Start Time</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.startTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">End Time</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.endTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Time Range</p>
                  <p className="text-sm text-gray-600">{formatTimeRange(booking.startTime, booking.endTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trainer Information */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainer Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.trainer?.name || 'Unknown Trainer'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.trainer?.email || ''}
                  </p>
                </div>
              </div>
              
              {booking.trainer?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <p className="text-sm text-gray-900">{booking.trainer.phone}</p>
                </div>
              )}
              
              {booking.trainer?.specialization && booking.trainer.specialization.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.trainer.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {booking.trainer?.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <p className="text-sm text-gray-900">{booking.trainer.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booked By Information */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booked By</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.bookedByUser?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.bookedByUser?.email || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/dashboard/crm/trainer-bookings/${booking.id}/edit`)}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Booking
              </button>
              
              {booking.status === 'ACTIVE' && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Booking
                </button>
              )}
              
              <button
                onClick={() => navigate('/dashboard/crm/trainer-bookings')}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmCancel}
        itemName={booking?.title || ''}
        itemType="Booking"
        isLoading={deleteModal.isLoading}
        confirmText="Cancel Booking"
        title="Cancel Training Session"
        message="Are you sure you want to cancel this training session? This action cannot be undone."
      />
    </div>
  );
};

export default TrainerBookingView;
