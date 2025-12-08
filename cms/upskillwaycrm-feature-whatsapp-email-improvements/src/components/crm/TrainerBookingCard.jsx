import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit3,
  Building2
} from 'lucide-react';

const TrainerBookingCard = ({ 
  booking, 
  onView, 
  onEdit, 
  onCancel, 
  showActions = true,
  className = "" 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
      },
    };

    const config = statusConfig[status] || statusConfig.ACTIVE;
    const StatusIcon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <StatusIcon className="h-3 w-3 mr-1" />
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

  const getSessionType = () => {
    if (isUpcoming(booking.startTime)) return 'Upcoming';
    if (isPast(booking.endTime)) return 'Past';
    return 'Ongoing';
  };

  const getSessionTypeColor = () => {
    if (isUpcoming(booking.startTime)) return 'text-blue-600 bg-blue-50';
    if (isPast(booking.endTime)) return 'text-gray-600 bg-gray-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className={`bg-white rounded-lg shadow border hover:shadow-md transition-shadow ${className}`}>
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{booking.description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {getStatusBadge(booking.status)}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor()}`}>
              {getSessionType()}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Schedule Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Start Time</p>
                <p className="text-sm text-gray-600">{formatDate(booking.startTime)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">End Time</p>
                <p className="text-sm text-gray-600">{formatDate(booking.endTime)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Duration</p>
                <p className="text-sm text-gray-600">{getDuration(booking.startTime, booking.endTime)}</p>
              </div>
            </div>
          </div>

          {/* Trainer Information */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Trainer</h4>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {booking.trainer?.name || 'Unknown Trainer'}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.trainer?.email || ''}
                </p>
                {booking.trainer?.phone && (
                  <p className="text-sm text-gray-500">{booking.trainer.phone}</p>
                )}
              </div>
            </div>
            
            {booking.trainer?.specialization && booking.trainer.specialization.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {booking.trainer.specialization.slice(0, 3).map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {spec}
                    </span>
                  ))}
                  {booking.trainer.specialization.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{booking.trainer.specialization.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Booked By Information */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Booked By</h4>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {booking.bookedByUser?.name || 'Unknown User'}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.bookedByUser?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* College Assignment Information */}
          {booking.college && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">College Assignment</h4>
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.college.name}
                  </p>
                  {booking.college.location && (
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {booking.college.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Created/Updated Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <p className="font-medium">Created</p>
                <p>{formatDate(booking.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium">Updated</p>
                <p>{formatDate(booking.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      {showActions && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView && onView(booking.id)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              
              <button
                onClick={() => onEdit && onEdit(booking.id)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>
            
            {booking.status === 'ACTIVE' && (
              <button
                onClick={() => onCancel && onCancel(booking)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerBookingCard;
