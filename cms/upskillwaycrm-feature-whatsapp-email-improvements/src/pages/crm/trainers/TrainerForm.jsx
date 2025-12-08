import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import trainerApi from '../../../services/api/trainerApi';
import toastUtils from '../../../utils/toastUtils';

const TrainerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    specialization: [],
    experience: '',
    rating: '',
    trainingMode: [],
    languages: [],
    bio: '',
    status: 'AVAILABLE',
    hourlyRate: '',
    availability: 'FULL_TIME',
    timezone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    certifications: [],
    skills: []
  });

  const [errors, setErrors] = useState({});

  // Available options
  const specializationOptions = [
    'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'Django', 'Spring Boot',
    'Data Science', 'Machine Learning', 'AI', 'Web Development', 'Mobile Development',
    'DevOps', 'Cloud Computing', 'Database Design', 'UI/UX Design', 'Project Management'
  ];

  const trainingModeOptions = ['ONLINE', 'OFFLINE', 'HYBRID'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese', 'Japanese'];
  const statusOptions = ['AVAILABLE', 'BOOKED', 'NOT_AVAILABLE', 'INACTIVE'];
  const availabilityOptions = ['FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT'];

  useEffect(() => {
    if (isEdit) {
      fetchTrainer();
    }
  }, [id, isEdit]);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const response = await trainerApi.getTrainerById(id);
      
      if (response.success) {
        const trainer = response.data;
        setFormData({
          name: trainer.name || '',
          email: trainer.email || '',
          phone: trainer.phone || '',
          location: trainer.location || '',
          specialization: trainer.specialization || [],
          experience: trainer.experience || '',
          rating: trainer.rating || '',
          trainingMode: trainer.trainingMode || [],
          languages: trainer.languages || [],
          bio: trainer.bio || '',
          status: trainer.status || 'AVAILABLE',
          hourlyRate: trainer.hourlyRate || '',
          availability: trainer.availability || 'FULL_TIME',
          timezone: trainer.timezone || '',
          linkedinUrl: trainer.linkedinUrl || '',
          portfolioUrl: trainer.portfolioUrl || '',
          certifications: trainer.certifications || [],
          skills: trainer.skills || []
        });
      } else {
        throw new Error(response.message || 'Failed to fetch trainer');
      }
    } catch (error) {
      console.error('Error fetching trainer:', error);
      toastUtils.crud.fetchError('Trainer', error.message);
      navigate('/dashboard/crm/trainers');
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter trainer name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter phone number';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please enter location';
    }

    if (formData.specialization.length === 0) {
      newErrors.specialization = 'Please select at least one specialization';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please enter years of experience';
    }

    if (formData.trainingMode.length === 0) {
      newErrors.trainingMode = 'Please select at least one training mode';
    }

    if (formData.languages.length === 0) {
      newErrors.languages = 'Please select at least one language';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Please enter trainer bio';
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
      
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        experience: parseInt(formData.experience) || 0,
        rating: parseFloat(formData.rating) || 0,
        hourlyRate: parseFloat(formData.hourlyRate) || 0
      };

      let response;
      if (isEdit) {
        response = await trainerApi.updateTrainer(id, submitData);
      } else {
        response = await trainerApi.createTrainer(submitData);
      }

      if (response.success) {
        toastUtils.success(`Trainer ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/dashboard/crm/trainers');
      } else {
        throw new Error(response.message || `Failed to ${isEdit ? 'update' : 'create'} trainer`);
      }
    } catch (error) {
      console.error('Error saving trainer:', error);
      toastUtils.error(`Failed to ${isEdit ? 'update' : 'create'} trainer: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const MultiSelectField = ({ name, label, options, value, error, icon: Icon }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="h-4 w-4 inline mr-1" />}
        {label} *
      </label>
      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
        {options.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  handleMultiSelectChange(name, [...value, option]);
                } else {
                  handleMultiSelectChange(name, value.filter(item => item !== option));
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/crm/trainers')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Trainer' : 'Create New Trainer'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update trainer information' : 'Add a new trainer to the system'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter trainer's full name"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter city, country"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="h-4 w-4 inline mr-1" />
                Years of Experience *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Enter years of experience"
                min="0"
                max="50"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.experience ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.experience}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4 inline mr-1" />
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="Enter rating (0-5)"
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-green-600">$</span> Hourly Rate
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                placeholder="Enter hourly rate"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
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
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availabilityOptions.map((availability) => (
                  <option key={availability} value={availability}>{availability}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Specializations and Skills */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Skills & Specializations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MultiSelectField
              name="specialization"
              label="Specializations"
              options={specializationOptions}
              value={formData.specialization}
              error={errors.specialization}
              icon={Award}
            />

            <MultiSelectField
              name="trainingMode"
              label="Training Modes"
              options={trainingModeOptions}
              value={formData.trainingMode}
              error={errors.trainingMode}
              icon={Globe}
            />

            <MultiSelectField
              name="languages"
              label="Languages"
              options={languageOptions}
              value={formData.languages}
              error={errors.languages}
              icon={Globe}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
          
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about the trainer's background, experience, and teaching style..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bio ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.bio}
                </p>
              )}
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://portfolio.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                placeholder="e.g., UTC+5:30, EST, PST"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/crm/trainers')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : (isEdit ? 'Update Trainer' : 'Create Trainer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerForm;