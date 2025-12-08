import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import trainerBookingsApi from '../../services/api/trainerBookingsApi';
import toastUtils from '../../utils/toastUtils';
import { formatToISO, formatForDisplay } from '../../utils/datetimeUtils';

const TrainerAvailabilityChecker = ({ 
  trainerId, 
  trainerName, 
  startTime, 
  endTime, 
  onAvailabilityChange,
  className = "" 
}) => {
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkAvailability = async () => {
    if (!trainerId || !startTime || !endTime) {
      toastUtils.error('Please select trainer and time slot');
      return;
    }

    // Validate trainer ID format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trainerId)) {
      toastUtils.error('Invalid trainer ID format. Please select a valid trainer.');
      console.error('Invalid trainer ID format:', trainerId);
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('upskillway_access_token');
    if (!token) {
      toastUtils.error('Please log in to check trainer availability');
      return;
    }

    try {
      setChecking(true);
      
      // Format the datetime values to ensure proper ISO format
      const formattedStartTime = formatToISO(startTime);
      const formattedEndTime = formatToISO(endTime);
      
      if (!formattedStartTime || !formattedEndTime) {
        throw new Error('Invalid date/time format provided');
      }
      
      console.log('Checking trainer availability with:', {
        trainerId,
        trainerName,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        hasToken: !!token
      });
      
      const response = await trainerBookingsApi.checkTrainerAvailability(
        trainerId, 
        formattedStartTime, 
        formattedEndTime
      );
      
      console.log('Availability check response:', response);
      
      if (response.success) {
        setAvailability(response.data);
        setLastChecked(new Date());
        
        if (onAvailabilityChange) {
          onAvailabilityChange(response.data);
        }
        
        if (response.data.isAvailable) {
          toastUtils.success('Trainer is available for this time slot');
        } else {
          toastUtils.warning(`Trainer is not available: ${response.data.reason}`);
        }
      } else {
        throw new Error(response.message || 'Failed to check availability');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      // Show more specific error message
      let errorMessage = 'Failed to check trainer availability';
      if (error.response?.status === 400) {
        errorMessage = 'Invalid request parameters. Please check your date/time format.';
      } else if (error.response?.status === 404) {
        errorMessage = `Trainer not found. Please check if trainer "${trainerName || trainerId}" exists.`;
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Server is busy. Please wait a moment and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toastUtils.error(errorMessage);
      setAvailability(null);
    } finally {
      setChecking(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return formatForDisplay(timeString);
  };

  const getAvailabilityIcon = () => {
    if (!availability) return <Clock className="h-5 w-5 text-gray-400" />;
    
    if (availability.isAvailable) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getAvailabilityColor = () => {
    if (!availability) return 'bg-gray-50 border-gray-200';
    
    if (availability.isAvailable) {
      return 'bg-green-50 border-green-200';
    } else {
      return 'bg-red-50 border-red-200';
    }
  };

  const getAvailabilityText = () => {
    if (!availability) return 'Not checked';
    
    if (availability.isAvailable) {
      return 'Available';
    } else {
      return 'Not Available';
    }
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${getAvailabilityColor()} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {trainerName || 'Trainer'} Availability
          </span>
        </div>
        
        <button
          onClick={checkAvailability}
          disabled={checking || !trainerId || !startTime || !endTime}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checking ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          {checking ? 'Checking...' : 'Check Availability'}
        </button>
      </div>

      {/* Time Slot Display */}
      {(startTime && endTime) && (
        <div className="mb-3 p-3 bg-white rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Selected Time Slot</span>
          </div>
          <div className="text-sm text-gray-600">
            <div><strong>Start:</strong> {formatTime(startTime)}</div>
            <div><strong>End:</strong> {formatTime(endTime)}</div>
          </div>
        </div>
      )}

      {/* Availability Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getAvailabilityIcon()}
          <span className={`text-sm font-medium ${
            availability?.isAvailable ? 'text-green-700' : 
            availability?.isAvailable === false ? 'text-red-700' : 
            'text-gray-700'
          }`}>
            {getAvailabilityText()}
          </span>
        </div>
        
        {lastChecked && (
          <span className="text-xs text-gray-500">
            Last checked: {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Availability Details */}
      {availability && (
        <div className="mt-3 p-3 bg-white rounded-lg border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                <strong>Trainer:</strong> {availability.trainer?.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                availability.trainer?.status === 'AVAILABLE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {availability.trainer?.status}
              </span>
            </div>
            
            {availability.reason && (
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-700">
                  <strong>Reason:</strong> {availability.reason}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!availability && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Check Availability</p>
              <p>Select a trainer and time slot, then click "Check Availability" to verify if the trainer is available for booking.</p>
              {!trainerId && (
                <p className="mt-2 text-orange-700 font-medium">
                  ⚠️ No trainer selected. Please select a trainer first.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAvailabilityChecker;
