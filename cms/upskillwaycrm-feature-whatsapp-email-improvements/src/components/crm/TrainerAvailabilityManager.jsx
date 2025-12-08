import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Save, 
  RefreshCw,
  Loader2,
  Settings,
  BarChart3,
  Users,
  Activity,
  Plus,
  Trash2,
  Repeat,
  Globe,
  FileText
} from 'lucide-react';
import trainerApi from '../../services/api/trainerApi';
import toastUtils from '../../utils/toastUtils';
import { formatToISO, formatForDisplay } from '../../utils/datetimeUtils';

const TrainerAvailabilityManager = ({ 
  trainerId, 
  trainerName, 
  currentAvailability = 'AVAILABLE',
  currentStatus = 'AVAILABLE',
  onAvailabilityUpdate,
  className = "" 
}) => {
  const [availability, setAvailability] = useState(currentAvailability);
  const [status, setStatus] = useState(currentStatus);
  const [nextSlot, setNextSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // New comprehensive availability state
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [recurringPattern, setRecurringPattern] = useState({
    isRecurring: false,
    frequency: 'WEEKLY',
    daysOfWeek: [],
    endDate: ''
  });
  const [timezone, setTimezone] = useState('UTC');
  const [generalNotes, setGeneralNotes] = useState('');
  const [activeTab, setActiveTab] = useState('simple'); // 'simple' or 'advanced'

  // Valid values as per API specification
  const availabilityOptions = [
    { 
      value: 'AVAILABLE', 
      label: 'Available', 
      color: 'text-green-600 bg-green-50',
      icon: CheckCircle,
      description: 'Trainer is ready for bookings'
    },
    { 
      value: 'NOT_AVAILABLE', 
      label: 'Not Available', 
      color: 'text-red-600 bg-red-50',
      icon: XCircle,
      description: 'Trainer is on leave/unreachable'
    },
    { 
      value: 'BOOKED', 
      label: 'Booked', 
      color: 'text-blue-600 bg-blue-50',
      icon: Clock,
      description: 'Trainer has active bookings (automatically set)'
    },
    { 
      value: 'INACTIVE', 
      label: 'Inactive', 
      color: 'text-gray-600 bg-gray-50',
      icon: AlertCircle,
      description: 'Trainer is inactive'
    }
  ];

  const statusOptions = [
    { 
      value: 'AVAILABLE', 
      label: 'Available', 
      color: 'text-green-600 bg-green-50',
      icon: CheckCircle,
      description: 'Trainer is ready for bookings'
    },
    { 
      value: 'NOT_AVAILABLE', 
      label: 'Not Available', 
      color: 'text-red-600 bg-red-50',
      icon: XCircle,
      description: 'Trainer is on leave/unreachable'
    },
    { 
      value: 'BOOKED', 
      label: 'Booked', 
      color: 'text-blue-600 bg-blue-50',
      icon: Clock,
      description: 'Trainer has active bookings (automatically set)'
    },
    { 
      value: 'INACTIVE', 
      label: 'Inactive', 
      color: 'text-gray-600 bg-gray-50',
      icon: AlertCircle,
      description: 'Trainer is inactive'
    }
  ];

  // Fetch trainer statistics
  const fetchTrainerStats = async () => {
    if (!trainerId) return;
    
    try {
      setLoadingStats(true);
      const response = await trainerApi.getTrainerStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching trainer stats:', error);
      // Use mock data if API fails
      setStats({
        totalTrainers: 12,
        availableTrainers: 8,
        bookedTrainers: 3,
        inactiveTrainers: 1,
        totalBookings: 45,
        activeBookings: 12,
        completedBookings: 30,
        cancelledBookings: 3
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTrainerStats();
  }, [trainerId]);

  // Update trainer availability (simple mode)
  const handleAvailabilityUpdate = async () => {
    if (!trainerId) {
      toastUtils.error('No trainer selected');
      return;
    }

    try {
      setUpdating(true);
      
      const availabilityData = {
        availability: availability,
        nextSlot: nextSlot ? new Date(nextSlot).toISOString() : undefined
      };

      console.log('Updating trainer availability:', {
        trainerId,
        availabilityData,
        apiUrl: `/trainers/${trainerId}/availability`
      });

      const response = await trainerApi.updateTrainerAvailability(trainerId, availabilityData);
      
      if (response.success) {
        setLastUpdated(new Date());
        
        if (onAvailabilityUpdate) {
          onAvailabilityUpdate(response.data);
        }
        
        toastUtils.success('Trainer availability updated successfully');
        fetchTrainerStats(); // Refresh stats
      } else {
        throw new Error(response.message || 'Failed to update trainer availability');
      }
    } catch (error) {
      console.error('Error updating trainer availability:', error);
      toastUtils.error('Failed to update trainer availability: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Set comprehensive trainer availability (advanced mode)
  const handleComprehensiveAvailabilityUpdate = async () => {
    if (!trainerId) {
      toastUtils.error('No trainer selected');
      return;
    }

    if (availabilitySlots.length === 0) {
      toastUtils.error('Please add at least one availability slot');
      return;
    }

    try {
      setUpdating(true);
      
      const availabilityData = {
        trainerId: trainerId,
        availabilitySlots: availabilitySlots.map(slot => ({
          startTime: formatToISO(slot.startTime),
          endTime: formatToISO(slot.endTime),
          isAvailable: slot.isAvailable,
          notes: slot.notes || ''
        })),
        recurringPattern: recurringPattern.isRecurring ? {
          isRecurring: true,
          frequency: recurringPattern.frequency,
          daysOfWeek: recurringPattern.daysOfWeek,
          endDate: recurringPattern.endDate ? new Date(recurringPattern.endDate).toISOString() : undefined
        } : undefined,
        timezone: timezone,
        notes: generalNotes
      };

      console.log('Setting comprehensive trainer availability:', {
        trainerId,
        availabilityData,
        apiUrl: '/trainer-bookings/availability/set'
      });

      const response = await trainerApi.setTrainerAvailability(availabilityData);
      
      if (response.success) {
        setLastUpdated(new Date());
        
        if (onAvailabilityUpdate) {
          onAvailabilityUpdate(response.data);
        }
        
        toastUtils.success('Comprehensive trainer availability set successfully');
        fetchTrainerStats(); // Refresh stats
      } else {
        throw new Error(response.message || 'Failed to set trainer availability');
      }
    } catch (error) {
      console.error('Error setting trainer availability:', error);
      toastUtils.error('Failed to set trainer availability: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Update trainer status
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

      console.log('Updating trainer status:', {
        trainerId,
        statusData,
        apiUrl: `/trainer-bookings/trainer/${trainerId}/status`
      });

      const response = await trainerApi.updateTrainerBookingStatus(trainerId, statusData);
      
      if (response.success) {
        setLastUpdated(new Date());
        
        if (onAvailabilityUpdate) {
          onAvailabilityUpdate(response.data);
        }
        
        toastUtils.success('Trainer status updated successfully');
        fetchTrainerStats(); // Refresh stats
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

  const getAvailabilityConfig = (availabilityValue) => {
    return availabilityOptions.find(option => option.value === availabilityValue) || availabilityOptions[0];
  };

  const getStatusConfig = (statusValue) => {
    return statusOptions.find(option => option.value === statusValue) || statusOptions[0];
  };

  // Helper functions for comprehensive availability
  const addAvailabilitySlot = () => {
    const newSlot = {
      id: Date.now(),
      startTime: '',
      endTime: '',
      isAvailable: true,
      notes: ''
    };
    setAvailabilitySlots([...availabilitySlots, newSlot]);
  };

  const removeAvailabilitySlot = (slotId) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== slotId));
  };

  const updateAvailabilitySlot = (slotId, field, value) => {
    setAvailabilitySlots(availabilitySlots.map(slot => 
      slot.id === slotId ? { ...slot, [field]: value } : slot
    ));
  };

  const toggleDayOfWeek = (day) => {
    const updatedDays = recurringPattern.daysOfWeek.includes(day)
      ? recurringPattern.daysOfWeek.filter(d => d !== day)
      : [...recurringPattern.daysOfWeek, day];
    
    setRecurringPattern({
      ...recurringPattern,
      daysOfWeek: updatedDays
    });
  };

  const currentAvailabilityConfig = getAvailabilityConfig(availability);
  const currentStatusConfig = getStatusConfig(status);

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Trainer Availability Management
            </h3>
            <p className="text-sm text-gray-600">
              {trainerName || 'Trainer'} Availability & Status Control
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

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('simple')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'simple'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Simple Availability
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'advanced'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Advanced Scheduling
            </button>
          </nav>
        </div>
      </div>

      {/* Trainer Statistics */}
      {stats && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Trainer Statistics</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{stats.availableTrainers || 0}</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{stats.bookedTrainers || 0}</div>
              <div className="text-xs text-gray-600">Booked</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">{stats.inactiveTrainers || 0}</div>
              <div className="text-xs text-gray-600">Inactive</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{stats.totalBookings || 0}</div>
              <div className="text-xs text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>
      )}

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
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentAvailabilityConfig.color}`}>
              <currentAvailabilityConfig.icon className="h-4 w-4 mr-2" />
              {currentAvailabilityConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Simple Availability Management */}
      {activeTab === 'simple' && (
      <div className="space-y-6">
        {/* Availability Section */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Update Availability
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Availability Status
              </label>
              <div className="grid grid-cols-1 gap-3">
                {availabilityOptions.map((option) => {
                  const OptionIcon = option.icon;
                  const isSelected = availability === option.value;
                  
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
                        name="availability"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => setAvailability(e.target.value)}
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

            {/* Next Available Slot */}
            {availability === 'NOT_AVAILABLE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Available Slot (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={nextSlot}
                  onChange={(e) => setNextSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Specify when the trainer will be available again
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Management Section */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Update Booking Status
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Booking Status
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>Changes will affect booking availability and management</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setAvailability(currentAvailability);
                setStatus(currentStatus);
                setNextSlot('');
                setNotes('');
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Reset
            </button>
            
            <button
              onClick={handleAvailabilityUpdate}
              disabled={updating || availability === currentAvailability}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {updating ? 'Updating...' : 'Update Availability'}
            </button>
            
            <button
              onClick={handleStatusUpdate}
              disabled={updating || status === currentStatus}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Activity className="h-4 w-4 mr-2" />
              )}
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Advanced Scheduling Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {/* Availability Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Availability Slots
              </h4>
              <button
                onClick={addAvailabilitySlot}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Slot
              </button>
            </div>

            <div className="space-y-4">
              {availabilitySlots.map((slot, index) => (
                <div key={slot.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Slot {index + 1}</span>
                    <button
                      onClick={() => removeAvailabilitySlot(slot.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={slot.startTime}
                        onChange={(e) => updateAvailabilitySlot(slot.id, 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={slot.endTime}
                        onChange={(e) => updateAvailabilitySlot(slot.id, 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available
                      </label>
                      <select
                        value={slot.isAvailable}
                        onChange={(e) => updateAvailabilitySlot(slot.id, 'isAvailable', e.target.value === 'true')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={slot.notes}
                        onChange={(e) => updateAvailabilitySlot(slot.id, 'notes', e.target.value)}
                        placeholder="Optional notes for this slot"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {availabilitySlots.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No availability slots added yet</p>
                  <p className="text-sm">Click "Add Slot" to create your first availability slot</p>
                </div>
              )}
            </div>
          </div>

          {/* Recurring Pattern */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Repeat className="h-4 w-4 mr-2" />
              Recurring Pattern
            </h4>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={recurringPattern.isRecurring}
                  onChange={(e) => setRecurringPattern({
                    ...recurringPattern,
                    isRecurring: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isRecurring" className="ml-2 text-sm font-medium text-gray-700">
                  Enable recurring pattern
                </label>
              </div>

              {recurringPattern.isRecurring && (
                <div className="space-y-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={recurringPattern.frequency}
                      onChange={(e) => setRecurringPattern({
                        ...recurringPattern,
                        frequency: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>

                  {recurringPattern.frequency === 'WEEKLY' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days of Week
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleDayOfWeek(day)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              recurringPattern.daysOfWeek.includes(day)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={recurringPattern.endDate}
                      onChange={(e) => setRecurringPattern({
                        ...recurringPattern,
                        endDate: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timezone and General Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="UTC+5:30">UTC+5:30 (IST)</option>
                <option value="UTC-5">UTC-5 (EST)</option>
                <option value="UTC-8">UTC-8 (PST)</option>
                <option value="UTC+1">UTC+1 (CET)</option>
                <option value="UTC+9">UTC+9 (JST)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                General Notes
              </label>
              <textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Add any general notes about availability..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Advanced Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              <span>Advanced scheduling will override simple availability settings</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setAvailabilitySlots([]);
                  setRecurringPattern({
                    isRecurring: false,
                    frequency: 'WEEKLY',
                    daysOfWeek: [],
                    endDate: ''
                  });
                  setTimezone('UTC');
                  setGeneralNotes('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Reset All
              </button>
              
              <button
                onClick={handleComprehensiveAvailabilityUpdate}
                disabled={updating || availabilitySlots.length === 0}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {updating ? 'Setting...' : 'Set Comprehensive Availability'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Impact - Only for Simple Mode */}
      {activeTab === 'simple' && (availability !== currentAvailability || status !== currentStatus) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Status Change Impact</p>
              <p className="mt-1">
                Changing availability/status will:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Update trainer availability for new bookings</li>
                <li>Affect availability checking for future time slots</li>
                <li>Notify users about trainer availability changes</li>
                <li>Update booking management system</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Mode Impact Warning */}
      {activeTab === 'advanced' && availabilitySlots.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Comprehensive Availability Impact</p>
              <p className="mt-1">
                Setting comprehensive availability will:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Override simple availability settings</li>
                <li>Create detailed time slots for booking management</li>
                <li>Enable recurring patterns for consistent scheduling</li>
                <li>Provide precise availability control for complex scenarios</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAvailabilityManager;
