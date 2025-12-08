import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Settings,
  Eye,
  Edit3,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  List,
  Users
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import TrainerAvailabilityChecker from '../../../components/crm/TrainerAvailabilityChecker';
import TrainerCalendar from '../../../components/crm/TrainerCalendar';
import TrainerStatusManager from '../../../components/crm/TrainerStatusManager';
import TrainerList from './TrainerList';
import TrainerView from './TrainerView';
import TrainerForm from './TrainerForm';
import trainerBookingsApi from '../../../services/api/trainerBookingsApi';
import trainerApi from '../../../services/api/trainerApi';
import toastUtils from '../../../utils/toastUtils';

const TrainerManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // list, view, create, edit, overview, calendar, status, availability
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [availabilityData, setAvailabilityData] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [currentTrainerId, setCurrentTrainerId] = useState(null);
  
  // Availability check form
  const [availabilityForm, setAvailabilityForm] = useState({
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchTrainers();
    
    // Determine active tab based on URL
    const currentPath = window.location.pathname;
    if (currentPath.includes('/create')) {
      setActiveTab('create');
    } else if (currentPath.includes('/edit')) {
      setActiveTab('edit');
      setCurrentTrainerId(id);
    } else if (id && !currentPath.includes('/edit')) {
      setActiveTab('view');
      setCurrentTrainerId(id);
    } else {
      setActiveTab('list');
    }
  }, [id]);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await trainerApi.getAllTrainers();
      
      console.log('Trainers API response:', response);
      
      if (response.success) {
        const trainersData = response.data || [];
        console.log('Fetched trainers:', trainersData);
        setTrainers(trainersData);
        
        if (trainersData.length === 0) {
          toastUtils.warning('No trainers found. Please create some trainers first.');
        }
      } else {
        throw new Error(response.message || 'Failed to fetch trainers');
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toastUtils.error(`Failed to fetch trainers: ${error.message}`);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerSelect = (trainer) => {
    setSelectedTrainer(trainer);
    setActiveTab('overview');
  };

  const checkAvailability = async () => {
    if (!selectedTrainer || !availabilityForm.startTime || !availabilityForm.endTime) {
      toastUtils.error('Please select a trainer and time range');
      return;
    }

    console.log('Selected trainer for availability check:', {
      id: selectedTrainer.id,
      name: selectedTrainer.name,
      email: selectedTrainer.email,
      status: selectedTrainer.status,
      startTime: availabilityForm.startTime,
      endTime: availabilityForm.endTime
    });

    try {
      setCheckingAvailability(true);
      const response = await trainerBookingsApi.checkTrainerAvailability(
        selectedTrainer.id,
        availabilityForm.startTime,
        availabilityForm.endTime
      );
      
      if (response.success) {
        setAvailabilityData(response.data);
        toastUtils.success('Availability checked successfully');
      } else {
        throw new Error(response.message || 'Failed to check availability');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      console.error('Selected trainer data:', selectedTrainer);
      toastUtils.error(`Failed to check availability: ${error.message}`);
    } finally {
      setCheckingAvailability(false);
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

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || trainer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // CRUD Navigation Functions
  const handleCreateTrainer = () => {
    setActiveTab('create');
    setCurrentTrainerId(null);
  };

  const handleViewTrainer = (trainerId) => {
    setActiveTab('view');
    setCurrentTrainerId(trainerId);
  };

  const handleEditTrainer = (trainerId) => {
    setActiveTab('edit');
    setCurrentTrainerId(trainerId);
  };

  const handleBackToList = () => {
    setActiveTab('list');
    setCurrentTrainerId(null);
    fetchTrainers(); // Refresh the list
  };

  // Render different views based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <TrainerList />;
      case 'view':
        return <TrainerView />;
      case 'create':
        return <TrainerForm />;
      case 'edit':
        return <TrainerForm />;
      default:
        return <TrainerList />;
    }
  };

  // Render overview content when overview tab is active
  const renderOverviewContent = () => {
    if (!selectedTrainer) {
      return (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Trainer</h3>
          <p className="text-gray-500">Choose a trainer from the list to view their details and manage their availability.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Trainer Header */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedTrainer.name}</h2>
                <p className="text-gray-600">{selectedTrainer.email}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTrainer.status)}`}>
                    {React.createElement(getStatusIcon(selectedTrainer.status), { className: "h-3 w-3 mr-1" })}
                    {selectedTrainer.status}
                  </span>
                  <span className="text-xs text-gray-500">⭐ {selectedTrainer.rating}</span>
                  <span className="text-xs text-gray-500">{selectedTrainer.totalSessions} sessions</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/dashboard/crm/trainer-bookings/create?trainerId=${selectedTrainer.id}`)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Book Session
              </button>
              <button
                onClick={() => navigate(`/dashboard/crm/trainer-bookings?trainerId=${selectedTrainer.id}`)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-900">{selectedTrainer.totalSessions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Rating</p>
                <p className="text-2xl font-bold text-green-900">{selectedTrainer.rating}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Experience</p>
                <p className="text-2xl font-bold text-purple-900">{selectedTrainer.experience} years</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Feedback Score</p>
                <p className="text-2xl font-bold text-orange-900">{selectedTrainer.feedbackScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTrainer.specialization.map((spec, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                <Settings className="h-3 w-3 mr-1" />
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Training Modes */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Modes</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTrainer.trainingMode.map((mode, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {mode}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Management</h1>
          <p className="text-gray-600 mt-2">
            {activeTab === 'list' && 'Manage trainer profiles and information'}
            {activeTab === 'view' && 'View trainer details'}
            {activeTab === 'create' && 'Create new trainer'}
            {activeTab === 'edit' && 'Edit trainer information'}
            {activeTab === 'overview' && 'Manage trainer availability, status, and schedules'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {activeTab === 'list' && (
            <>
              <button
                onClick={handleCreateTrainer}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Trainer
              </button>
              <button
                onClick={() => navigate('/dashboard/crm/trainer-bookings/create')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                New Booking
              </button>
            </>
          )}
          {(activeTab === 'view' || activeTab === 'create' || activeTab === 'edit') && (
            <button
              onClick={handleBackToList}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <List className="h-4 w-4 mr-2" />
              Back to List
            </button>
          )}
          {activeTab === 'overview' && (
            <>
              <button
                onClick={fetchTrainers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => navigate('/dashboard/crm/trainer-bookings/create')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Trainer List
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Overview & Availability
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trainer List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Trainers</h3>
                <span className="text-sm text-gray-500">{filteredTrainers.length} trainers</span>
              </div>

              {/* Filters */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trainers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="BUSY">Busy</option>
                    <option value="NOT_AVAILABLE">Not Available</option>
                  </select>
                </div>
              </div>

              {/* Trainer List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTrainers.map((trainer) => {
                  const StatusIcon = getStatusIcon(trainer.status);
                  
                  return (
                    <div
                      key={trainer.id}
                      onClick={() => handleTrainerSelect(trainer)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTrainer?.id === trainer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {trainer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{trainer.name}</p>
                            <p className="text-xs text-gray-600">{trainer.email}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {trainer.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span>⭐ {trainer.rating}</span>
                          <span>•</span>
                          <span>{trainer.experience} years</span>
                          <span>•</span>
                          <span>{trainer.totalSessions} sessions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="truncate">{trainer.specialization.slice(0, 2).join(', ')}</span>
                          {trainer.specialization.length > 2 && (
                            <span className="text-gray-400">+{trainer.specialization.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderOverviewContent()}
          </div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default TrainerManagement;
