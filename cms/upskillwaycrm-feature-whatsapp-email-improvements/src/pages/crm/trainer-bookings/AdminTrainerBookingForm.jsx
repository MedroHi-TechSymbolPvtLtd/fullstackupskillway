import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  User, 
  Building2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import trainerBookingsApi from '../../../services/api/trainerBookingsApi';
import trainerApi from '../../../services/api/trainerApi';
import collegesApi from '../../../services/api/collegesApi';
import toastUtils from '../../../utils/toastUtils';

const AdminTrainerBookingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    trainerId: '',
    collegeName: '',
    collegeId: '',
    bookedBy: '',
    startTime: '',
    endTime: '',
    title: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [useCollegeName, setUseCollegeName] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch trainers, colleges, and users in parallel
      const [trainersResponse, collegesResponse] = await Promise.all([
        trainerApi.getAllTrainers({ limit: 100 }),
        collegesApi.getAllColleges({ limit: 100 })
      ]);

      if (trainersResponse.success) {
        setTrainers(trainersResponse.data);
      }

      if (collegesResponse.success) {
        setColleges(collegesResponse.data);
      }

    } catch (error) {
      console.error('Error fetching initial data:', error);
      toastUtils.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear related errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCollegeToggle = (useName) => {
    setUseCollegeName(useName);
    setFormData(prev => ({
      ...prev,
      collegeName: useName ? prev.collegeName : '',
      collegeId: useName ? '' : prev.collegeId
    }));
    setErrors(prev => ({
      ...prev,
      collegeName: '',
      collegeId: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.trainerId) {
      newErrors.trainerId = 'Trainer is required';
    }

    if (useCollegeName) {
      if (!formData.collegeName) {
        newErrors.collegeName = 'College name is required';
      }
    } else {
      if (!formData.collegeId) {
        newErrors.collegeId = 'College is required';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);
      
      if (endTime <= startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
      
      if (startTime <= new Date()) {
        newErrors.startTime = 'Start time must be in the future';
      }
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toastUtils.error('Please fix the form errors');
      return;
    }

    try {
      setSubmitting(true);
      
      // Convert datetime-local to ISO string
      const bookingData = {
        trainerId: formData.trainerId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        title: formData.title,
        ...(formData.description && formData.description.trim() && { description: formData.description })
        // Don't include status - backend sets it automatically to ACTIVE
      };

      // Only include bookedBy if it's a valid UUID and not empty
      if (formData.bookedBy && formData.bookedBy.trim() !== '') {
        // Basic UUID validation
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(formData.bookedBy.trim())) {
          bookingData.bookedBy = formData.bookedBy.trim();
        } else {
          console.warn('Invalid UUID format for bookedBy, omitting from request');
        }
      }

      // Add college information based on the selected method
      if (useCollegeName) {
        bookingData.collegeName = formData.collegeName;
      } else {
        bookingData.collegeId = formData.collegeId;
      }

      const response = await trainerBookingsApi.createAdminBooking(bookingData);
      
      if (response.success) {
        toastUtils.success('Trainer booking created successfully!');
        navigate('/dashboard/crm/trainer-bookings');
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toastUtils.error('Failed to create booking: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/crm/trainer-bookings')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Admin Booking</h1>
            <p className="text-gray-600 mt-2">Create trainer booking and assign to college</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Trainer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
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
                  {trainer.name} - {trainer.specialization?.join(', ') || 'No specialization'}
                </option>
              ))}
            </select>
            {errors.trainerId && (
              <p className="mt-1 text-sm text-red-600">{errors.trainerId}</p>
            )}
          </div>

          {/* College Assignment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Building2 className="inline h-4 w-4 mr-1" />
              College Assignment *
            </label>
            
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="collegeMethod"
                  checked={useCollegeName}
                  onChange={() => handleCollegeToggle(true)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Use College Name</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="collegeMethod"
                  checked={!useCollegeName}
                  onChange={() => handleCollegeToggle(false)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Select from List</span>
              </label>
            </div>

            {useCollegeName ? (
              <div>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  placeholder="Enter college name (e.g., 'Harvard University')"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.collegeName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.collegeName && (
                  <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  💡 Tip: You can use partial names. The system will find the best match.
                </p>
              </div>
            ) : (
              <div>
                <select
                  name="collegeId"
                  value={formData.collegeId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.collegeId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a college</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name} - {college.location || 'No location'}
                    </option>
                  ))}
                </select>
                {errors.collegeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.collegeId}</p>
                )}
              </div>
            )}
          </div>

          {/* Booked By (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Assign to User (Optional)
            </label>
            <input
              type="text"
              name="bookedBy"
              value={formData.bookedBy}
              onChange={handleInputChange}
              placeholder="User UUID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              💡 Leave empty to assign the booking to yourself (admin). Must be a valid UUID format.
            </p>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
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
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
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
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Corporate Training Session"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Optional description of the training session..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard/crm/trainer-bookings')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTrainerBookingForm;
