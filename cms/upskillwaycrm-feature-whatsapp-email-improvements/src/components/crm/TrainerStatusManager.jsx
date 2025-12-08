import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Save, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw
} from 'lucide-react';
import trainerBookingsApi from '../../services/api/trainerBookingsApi';
import toastUtils from '../../utils/toastUtils';

const TrainerStatusManager = ({ 
  trainerId, 
  trainerName, 
  currentStatus = 'AVAILABLE',
  onStatusUpdate,
  className = "" 
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const statusOptions = [
    { 
      value: 'AVAILABLE', 
      label: 'Available', 
      color: 'text-green-600 bg-green-50',
      icon: CheckCircle,
      description: 'Trainer is available for new bookings'
    },
    { 
      value: 'BUSY', 
      label: 'Busy', 
      color: 'text-yellow-600 bg-yellow-50',
      icon: Clock,
      description: 'Trainer has limited availability'
    },
    { 
      value: 'NOT_AVAILABLE', 
      label: 'Not Available', 
      color: 'text-red-600 bg-red-50',
      icon: XCircle,
      description: 'Trainer is not available for bookings'
    }
  ];

  const handleStatusUpdate = async () => {
    if (!trainerId) {
      toastUtils.error('No trainer selected');
      return;
    }

    try {
      setUpdating(true);
      
      const statusData = {
        status: status,
        notes: notes.trim() || undefined
      };

      const response = await trainerBookingsApi.updateTrainerStatus(trainerId, statusData);
      
      if (response.success) {
        setLastUpdated(new Date());
        
        if (onStatusUpdate) {
          onStatusUpdate(response.data);
        }
        
        toastUtils.success('Trainer status updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update trainer status');
      }
    } catch (error) {
      console.error('Error updating trainer status:', error);
      toastUtils.error('Failed to update trainer status: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (statusValue) => {
    return statusOptions.find(option => option.value === statusValue) || statusOptions[0];
  };

  const currentStatusConfig = getStatusConfig(status);

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Trainer Status Management
            </h3>
            <p className="text-sm text-gray-600">
              {trainerName || 'Trainer'} Status Control
            </p>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Last updated</p>
            <p className="text-xs text-gray-700">{lastUpdated.toLocaleTimeString()}</p>
          </div>
        )}
      </div>

      {/* Current Status Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {trainerName || 'Trainer'}
              </p>
              <p className="text-xs text-gray-600">Current Status</p>
            </div>
          </div>
          
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.color}`}>
            <currentStatusConfig.icon className="h-4 w-4 mr-2" />
            {currentStatusConfig.label}
          </span>
        </div>
      </div>

      {/* Status Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Update Status
          </label>
          <div className="grid grid-cols-1 gap-3">
            {statusOptions.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = status === option.value;
              
              return (
                <label
                  key={option.value}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => setStatus(e.target.value)}
                    className="sr-only"
                  />
                  
                  <div className="flex items-center space-x-3">
                    <OptionIcon className={`h-5 w-5 ${
                      isSelected ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${option.color}`}>
                          {option.value}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the status change (e.g., 'On vacation until next week', 'Limited availability due to personal commitments')"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide context for the status change to help with booking management
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>Status changes will affect new booking availability</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setStatus(currentStatus);
                setNotes('');
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Reset
            </button>
            
            <button
              onClick={handleStatusUpdate}
              disabled={updating || status === currentStatus}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Change Impact */}
      {status !== currentStatus && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Status Change Impact</p>
              <p className="mt-1">
                Changing status to <strong>{getStatusConfig(status).label}</strong> will:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Update trainer availability for new bookings</li>
                <li>Affect availability checking for future time slots</li>
                <li>Notify users about trainer availability changes</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerStatusManager;
