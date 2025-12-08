import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  Edit3,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import trainerBookingsApi from '../../services/api/trainerBookingsApi';
import toastUtils from '../../utils/toastUtils';

const TrainerCalendar = ({ 
  trainerId, 
  trainerName, 
  onBookingClick,
  onDateChange,
  className = "" 
}) => {
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (trainerId) {
      fetchCalendarData();
    }
  }, [trainerId, currentMonth]);

  const fetchCalendarData = async () => {
    if (!trainerId) return;

    try {
      setLoading(true);
      
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      const response = await trainerBookingsApi.getTrainerCalendar(trainerId, params);
      
      if (response.success) {
        setCalendarData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch calendar data');
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toastUtils.error('Failed to load trainer calendar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingsForDate = (date) => {
    if (!calendarData?.bookings) return [];
    
    const targetDate = new Date(date);
    return calendarData.bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate.toDateString() === targetDate.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const getAvailabilityStatus = () => {
    if (!calendarData) return 'unknown';
    return calendarData.availability || 'unknown';
  };

  const getAvailabilityColor = () => {
    const status = getAvailabilityStatus();
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'busy':
        return 'text-yellow-600 bg-yellow-50';
      case 'unavailable':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {trainerName || 'Trainer'} Calendar
              </h3>
              <p className="text-sm text-gray-600">
                {currentMonth.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={fetchCalendarData}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Trainer Status */}
        {calendarData && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                <strong>Trainer:</strong> {calendarData.trainer?.name}
              </span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor()}`}>
              {getAvailabilityStatus().toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((date, index) => {
            if (!date) {
              return <div key={index} className="h-20"></div>;
            }

            const bookings = getBookingsForDate(date);
            const isCurrentDay = isToday(date);
            const isSelectedDay = isSelected(date);

            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`h-20 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 ${
                  isCurrentDay ? 'bg-blue-50 border-blue-300' : ''
                } ${isSelectedDay ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </span>
                  {bookings.length > 0 && (
                    <span className="text-xs text-blue-600 font-medium">
                      {bookings.length}
                    </span>
                  )}
                </div>
                
                {/* Bookings Preview */}
                <div className="space-y-1">
                  {bookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                      title={`${booking.title} - ${formatTime(booking.startTime)}`}
                    >
                      {formatTime(booking.startTime)}
                    </div>
                  ))}
                  {bookings.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{bookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h4>
          
          {getBookingsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No bookings scheduled</p>
            </div>
          ) : (
            <div className="space-y-2">
              {getBookingsForDate(selectedDate).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => onBookingClick && onBookingClick(booking)}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{booking.title}</p>
                    <p className="text-xs text-gray-600">{booking.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-gray-800">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Data State */}
      {!calendarData && (
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Calendar Data</h3>
          <p className="text-gray-500">Select a trainer to view their calendar</p>
        </div>
      )}
    </div>
  );
};

export default TrainerCalendar;
