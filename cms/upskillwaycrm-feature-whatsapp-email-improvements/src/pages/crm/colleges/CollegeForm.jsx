import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Mail, Phone, MapPin, Globe, DollarSign, Users, Award, Calendar } from 'lucide-react';
import collegesApi from '../../../services/api/collegesApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toastUtils from '../../../utils/toastUtils';

const CollegeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    state: '',
    type: 'ENGINEERING',
    ranking: '',
    enrollment: '',
    establishedYear: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    
    totalRevenue: '',
    status: 'ACTIVE',
    assignedToId: ''
  });

  const [errors, setErrors] = useState({});

  const collegeTypes = [
    { value: 'ENGINEERING', label: 'Engineering' },
    { value: 'MEDICAL', label: 'Medical' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'ARTS', label: 'Arts' },
    { value: 'SCIENCE', label: 'Science' },
    { value: 'LAW', label: 'Law' },
    { value: 'OTHER', label: 'Other' }
  ];

  const collegeStatuses = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PARTNER', label: 'Partner' }
  ];

  const fetchCollege = useCallback(async () => {
    try {
      setLoading(true);
      const response = await collegesApi.getCollegeById(id);
      
      if (response.success) {
        const college = response.data;
        setFormData({
          name: college.name || '',
          location: college.location || '',
          city: college.city || '',
          state: college.state || '',
          type: college.type || 'ENGINEERING',
          ranking: college.ranking || '',
          enrollment: college.enrollment || '',
          establishedYear: college.establishedYear || '',
          contactPerson: college.contactPerson || '',
          contactEmail: college.contactEmail || '',
          contactPhone: college.contactPhone || '',
          totalRevenue: college.totalRevenue || '',
          status: college.status || 'ACTIVE',
          assignedToId: college.assignedToId || ''
        });
      } else {
        throw new Error(response.message || 'Failed to fetch college');
      }
    } catch (error) {
      console.error('Error fetching college:', error);
      toastUtils.crud.fetchError('College', error.message);
      navigate('/dashboard/crm/colleges');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) {
      fetchCollege();
    }
  }, [id, isEdit, fetchCollege]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'College name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.type) {
      newErrors.type = 'College type is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Numeric validations
    if (formData.ranking && (isNaN(Number(formData.ranking)) || Number(formData.ranking) < 1)) {
      newErrors.ranking = 'Ranking must be a positive number';
    }

    if (formData.enrollment && (isNaN(Number(formData.enrollment)) || Number(formData.enrollment) < 0)) {
      newErrors.enrollment = 'Enrollment must be a non-negative number';
    }

    if (formData.establishedYear && (isNaN(Number(formData.establishedYear)) || Number(formData.establishedYear) < 1800 || Number(formData.establishedYear) > new Date().getFullYear())) {
      newErrors.establishedYear = 'Please enter a valid year';
    }

    if (formData.totalRevenue && (isNaN(Number(formData.totalRevenue)) || Number(formData.totalRevenue) < 0)) {
      newErrors.totalRevenue = 'Total revenue must be a non-negative number';
    }

    // AssignedToId validation (if provided, should be a valid UUID format)
    if (formData.assignedToId && formData.assignedToId.trim()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(formData.assignedToId.trim())) {
        newErrors.assignedToId = 'Please enter a valid user ID';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submission started, isEdit:', isEdit, 'id:', id);

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed');
    console.log('Form data before processing:', formData);

    try {
      setSaving(true);

      // Prepare data for submission with safe type conversion
      const submitData = {
        name: formData.name?.trim() || '',
        location: formData.location?.trim() || '',
        city: formData.city?.trim() || '',
        state: formData.state?.trim() || '',
        type: formData.type || 'ENGINEERING',
        status: formData.status || 'ACTIVE',
        contactPerson: formData.contactPerson?.trim() || '',
        contactEmail: formData.contactEmail?.trim() || '',
        contactPhone: formData.contactPhone?.trim() || '',
        ranking: formData.ranking && String(formData.ranking).trim() ? parseInt(formData.ranking) : undefined,
        enrollment: formData.enrollment && String(formData.enrollment).trim() ? parseInt(formData.enrollment) : undefined,
        establishedYear: formData.establishedYear && String(formData.establishedYear).trim() ? parseInt(formData.establishedYear) : undefined,
        totalRevenue: formData.totalRevenue && String(formData.totalRevenue).trim() ? parseFloat(formData.totalRevenue) : 0,
        assignedToId: formData.assignedToId && String(formData.assignedToId).trim() ? formData.assignedToId : undefined,
      };

      // Remove undefined values to avoid sending them to API
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      console.log('Submitting data:', submitData);

      let response;
      if (isEdit) {
        console.log('Calling updateCollege API with id:', id);
        response = await collegesApi.updateCollege(id, submitData);
      } else {
        console.log('Calling createCollege API');
        response = await collegesApi.createCollege(submitData);
      }

      console.log('API response:', response);

      if (response.success) {
        console.log('Update successful!');
        if (isEdit) {
          toastUtils.crud.updated('College');
        } else {
          toastUtils.crud.created('College');
        }
        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/dashboard/crm/colleges');
        }, 1000);
      } else {
        console.log('Update failed:', response.message);
        throw new Error(response.message || `Failed to ${isEdit ? 'update' : 'create'} college`);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} college:`, error);
      if (isEdit) {
        toastUtils.crud.updateError('College', error.message);
      } else {
        toastUtils.crud.createError('College', error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard/crm/colleges')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit College' : 'Create New College'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update college information' : 'Add a new college to the system'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-orange-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter college name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {collegeTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.status ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {collegeStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ranking
                  </label>
                  <input
                    type="number"
                    name="ranking"
                    value={formData.ranking}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.ranking ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="1"
                    min="1"
                  />
                  {errors.ranking && <p className="mt-1 text-sm text-red-600">{errors.ranking}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.establishedYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="1861"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                  {errors.establishedYear && <p className="mt-1 text-sm text-red-600">{errors.establishedYear}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment
                </label>
                <input
                  type="number"
                  name="enrollment"
                  value={formData.enrollment}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.enrollment ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="5000"
                  min="0"
                />
                {errors.enrollment && <p className="mt-1 text-sm text-red-600">{errors.enrollment}</p>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-orange-600" />
              Location Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Cambridge, MA"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Cambridge"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Massachusetts"
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-orange-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="contact@mit.edu"
                />
                {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+1-617-253-1000"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-orange-600" />
              Financial Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Revenue
                </label>
                <input
                  type="number"
                  name="totalRevenue"
                  value={formData.totalRevenue}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.totalRevenue ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="5000000"
                  min="0"
                  step="0.01"
                />
                {errors.totalRevenue && <p className="mt-1 text-sm text-red-600">{errors.totalRevenue}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To ID
                </label>
                <input
                  type="text"
                  name="assignedToId"
                  value={formData.assignedToId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="550e8400-e29b-41d4-a716-446655440000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard/crm/colleges')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Update College' : 'Create College'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;
