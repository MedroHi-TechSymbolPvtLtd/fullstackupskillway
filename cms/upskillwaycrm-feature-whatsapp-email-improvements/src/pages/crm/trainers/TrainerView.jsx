import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Globe,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  FileText,
  Loader2,
  Settings
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import TrainerAvailabilityManager from '../../../components/crm/TrainerAvailabilityManager';
import trainerApi from '../../../services/api/trainerApi';
import toastUtils from '../../../utils/toastUtils';

const TrainerView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleAvailabilityUpdate = (updatedTrainer) => {
    setTrainer(prev => ({ ...prev, ...updatedTrainer }));
    toastUtils.success('Trainer availability updated successfully');
  };

  useEffect(() => {
    if (id) {
      fetchTrainer();
    }
  }, [id]);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const response = await trainerApi.getTrainerById(id);
      
      if (response.success) {
        setTrainer(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch trainer');
      }
    } catch (error) {
      console.error('Error fetching trainer:', error);
      toastUtils.error(`Failed to fetch trainer: ${error.message}`);
      navigate('/dashboard/crm/trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await trainerApi.updateTrainerStatus(id, { status: newStatus });
      
      if (response.success) {
        setTrainer(prev => ({ ...prev, status: newStatus }));
        toastUtils.success('Trainer status updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update trainer status');
      }
    } catch (error) {
      console.error('Error updating trainer status:', error);
      toastUtils.error(`Failed to update trainer status: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'BUSY':
        return 'bg-yellow-100 text-yellow-800';
      case 'NOT_AVAILABLE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return CheckCircle;
      case 'BUSY':
        return Clock;
      case 'NOT_AVAILABLE':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const formatSpecializations = (specializations) => {
    if (!specializations || specializations.length === 0) return ['None'];
    return specializations;
  };

  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return ['None'];
    return languages;
  };

  const formatTrainingModes = (modes) => {
    if (!modes || modes.length === 0) return ['None'];
    return modes;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!trainer) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Trainer not found</h3>
        <p className="text-gray-600 mb-4">The trainer you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/crm/trainers')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Trainers
        </button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(trainer.status);

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
            <h1 className="text-2xl font-bold text-gray-900">{trainer.name}</h1>
            <p className="text-gray-600 mt-1">Trainer Profile Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/dashboard/crm/trainers/${trainer.id}/edit`)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Trainer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{trainer.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={`mailto:${trainer.email}`} className="text-blue-600 hover:text-blue-800">
                    {trainer.email}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={`tel:${trainer.phone}`} className="text-blue-600 hover:text-blue-800">
                    {trainer.phone}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{trainer.location}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{trainer.experience} years</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{trainer.rating || 'N/A'}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                <span className="text-gray-900">${trainer.hourlyRate || 'N/A'}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <span className="text-gray-900">{trainer.availability || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Skills & Specializations */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Skills & Specializations</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {formatSpecializations(trainer.specialization).map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Training Modes</label>
                <div className="flex flex-wrap gap-2">
                  {formatTrainingModes(trainer.trainingMode).map((mode, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {mode}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {formatLanguages(trainer.languages).map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bio</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {trainer.bio || 'No bio available.'}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          {(trainer.linkedinUrl || trainer.portfolioUrl || trainer.timezone || trainer.certifications?.length > 0) && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
              
              <div className="space-y-4">
                {trainer.linkedinUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <a
                      href={trainer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {trainer.linkedinUrl}
                    </a>
                  </div>
                )}
                
                {trainer.portfolioUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                    <a
                      href={trainer.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {trainer.portfolioUrl}
                    </a>
                  </div>
                )}
                
                {trainer.timezone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <span className="text-gray-900">{trainer.timezone}</span>
                  </div>
                )}
                
                {trainer.certifications && trainer.certifications.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Certifications</label>
                    <div className="space-y-2">
                      {trainer.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center">
                          <Award className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trainer.status)}`}>
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {trainer.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Update Status</label>
                <select
                  value={trainer.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updatingStatus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="NOT_AVAILABLE">Not Available</option>
                </select>
                {updatingStatus && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="font-semibold text-gray-900">{trainer.totalSessions || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-semibold text-gray-900">{trainer.rating || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Experience</span>
                <span className="font-semibold text-gray-900">{trainer.experience} years</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hourly Rate</span>
                <span className="font-semibold text-gray-900">${trainer.hourlyRate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/dashboard/crm/trainer-bookings/create?trainerId=${trainer.id}`)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Session
              </button>
              
              <button
                onClick={() => navigate(`/dashboard/crm/trainer-bookings?trainerId=${trainer.id}`)}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Bookings
              </button>
              
              <button
                onClick={() => navigate(`/dashboard/crm/trainers/${trainer.id}/edit`)}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Availability Management */}
      <TrainerAvailabilityManager
        trainerId={trainer.id}
        trainerName={trainer.name}
        currentAvailability={trainer.availability || 'AVAILABLE'}
        currentStatus={trainer.status || 'AVAILABLE'}
        onAvailabilityUpdate={handleAvailabilityUpdate}
      />
    </div>
  );
};

export default TrainerView;