import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import TrainerAvailabilityChecker from '../../../components/crm/TrainerAvailabilityChecker';
import trainerBookingsApi from '../../../services/api/trainerBookingsApi';
import trainerApi from '../../../services/api/trainerApi';
import toastUtils from '../../../utils/toastUtils';

const TrainerBookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  
  const [formData, setFormData] = useState({
    trainerId: '',
    bookedBy: '',
    startTime: '',
    endTime: '',
    title: '',
    description: '',
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchBooking();
    }
    fetchTrainers();
    fetchUsers();
  }, [id, isEdit]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await trainerBookingsApi.getBookingById(id);
      
      if (response.success) {
        const booking = response.data;
        setFormData({
          trainerId: booking.trainerId || '',
          bookedBy: booking.bookedBy || '',
          startTime: booking.startTime ? new Date(booking.startTime).toISOString().slice(0, 16) : '',
          endTime: booking.endTime ? new Date(booking.endTime).toISOString().slice(0, 16) : '',
          title: booking.title || '',
          description: booking.description || '',
          status: booking.status || 'ACTIVE'
        });
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

  const fetchTrainers = async () => {
    try {
      const response = await trainerApi.getAllTrainers({ limit: 100 });
      if (response.success) {
        setTrainers(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch trainers');
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toastUtils.error('Failed to load trainers: ' + error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      // This would typically come from a users API
      // For now, we'll use mock data
      const mockUsers = [
        { id: 'd51d065f-2817-4c49-a23c-26c50d8d7b82', name: 'Gaurav Sharma', email: 'gaurav@example.com' },
        { id: 'user-2', name: 'Admin User', email: 'admin@upskillway.com' },
        { id: 'user-3', name: 'Sales Manager', email: 'sales@upskillway.com' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Handle trainer selection
    if (name === 'trainerId') {
      const trainer = trainers.find(t => t.id === value);
      setSelectedTrainer(trainer);
      setAvailability(null); // Reset availability when trainer changes
    }
  };

  const handleAvailabilityChange = (availabilityData) => {
    setAvailability(availabilityData);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.trainerId) {
      newErrors.trainerId = 'Please select a trainer';
    }

    // bookedBy is optional - no validation needed

    if (!formData.startTime) {
      newErrors.startTime = 'Please select start time';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Please select end time';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const now = new Date();
      
      if (start <= now) {
        newErrors.startTime = 'Start time must be in the future';
      }
      
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title';
    }

    // description is optional - no validation needed

    // Check availability if trainer and times are selected
    if (formData.trainerId && formData.startTime && formData.endTime) {
      if (!availability) {
        newErrors.availability = 'Please check trainer availability before booking';
      } else if (!availability.isAvailable) {
        newErrors.availability = `Trainer is not available: ${availability.reason}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toastUtils.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSaving(true);
      
      // Convert datetime-local to ISO string
      const submitData = {
        trainerId: formData.trainerId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        title: formData.title,
        ...(formData.description && formData.description.trim() && { description: formData.description }),
        ...(formData.bookedBy && formData.bookedBy.trim() && { bookedBy: formData.bookedBy })
      };

      let response;
      if (isEdit) {
        // For edit, include status if provided
        if (formData.status) {
          submitData.status = formData.status;
        }
        response = await trainerBookingsApi.updateBooking(id, submitData);
      } else {
        // For create, don't include status - backend sets it automatically to ACTIVE
        response = await trainerBookingsApi.createBooking(submitData);
      }

      if (response.success) {
        toastUtils.success(`Booking ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/dashboard/crm/trainer-bookings');
      } else {
        throw new Error(response.message || `Failed to ${isEdit ? 'update' : 'create'} booking`);
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      toastUtils.error(`Failed to ${isEdit ? 'update' : 'create'} booking: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
  };

  if (loading) {
    return <LoadingSpinner />;
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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Booking' : 'Create New Booking'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update trainer booking details' : 'Schedule a new training session'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trainer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Trainer *
              </label>
              <select
                name="trainerId"
                value={formData.trainerId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.trainerId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name} ({trainer.email})
                  </option>
                ))}
              </select>
              {errors.trainerId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.trainerId}
                </p>
              )}
            </div>

            {/* Booked By (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Booked By (Optional)
              </label>
              <select
                name="bookedBy"
                value={formData.bookedBy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select user (optional)</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Leave empty if booking for yourself
              </p>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.startTime}
                </p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                End Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.endTime}
                </p>
              )}
            </div>

            {/* Status (only for edit) */}
            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Training Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., JavaScript Advanced Training"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description (Optional) */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the training session content and objectives (optional)..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Trainer Availability Checker */}
        {formData.trainerId && formData.startTime && formData.endTime && (
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability Check</h2>
            <TrainerAvailabilityChecker
              trainerId={formData.trainerId}
              trainerName={selectedTrainer?.name}
              startTime={formData.startTime}
              endTime={formData.endTime}
              onAvailabilityChange={handleAvailabilityChange}
            />
            {errors.availability && (
              <p className="mt-3 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.availability}
              </p>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/crm/trainer-bookings')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : (isEdit ? 'Update Booking' : 'Create Booking')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerBookingForm;
