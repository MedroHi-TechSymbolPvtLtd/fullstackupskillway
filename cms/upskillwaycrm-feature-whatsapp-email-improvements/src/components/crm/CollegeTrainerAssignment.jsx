import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  UserPlus, 
  UserMinus, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  RefreshCw,
  BarChart3,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Save,
  X
} from 'lucide-react';
import collegeTrainerApi from '../../services/api/collegeTrainerApi';
import collegesApi from '../../services/api/collegesApi';
import toastUtils from '../../utils/toastUtils';

const CollegeTrainerAssignment = ({ className = "" }) => {
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments', 'available', 'stats'
  
  // Available trainers state
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [trainerFilters, setTrainerFilters] = useState({
    specialization: '',
    location: '',
    experience: '',
    page: 1,
    limit: 10
  });
  
  // Colleges state
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  
  // Assignments state
  const [assignments, setAssignments] = useState([]);
  const [assignmentFilters, setAssignmentFilters] = useState({
    collegeId: '',
    trainerId: '',
    status: '',
    page: 1,
    limit: 10
  });
  
  // Assignment form state
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedTrainerForAssignment, setSelectedTrainerForAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    trainerId: '',
    collegeId: '',
    startDate: '',
    endDate: '',
    schedule: '', // e.g., "Monday, Wednesday, Friday 10:00 AM - 12:00 PM"
    notes: ''
  });
  
  // Statistics state
  const [stats, setStats] = useState(null);
  
  // Pagination states
  const [trainerPagination, setTrainerPagination] = useState({});
  const [, setAssignmentPagination] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Listen for assignment creation/update events to refresh assignments in real-time
  useEffect(() => {
    const handleAssignmentCreated = (event) => {
      console.log('CollegeTrainerAssignment: Assignment created event received:', event.detail);
      fetchAssignments();
      fetchStats();
      toastUtils.success('New assignment created! Refreshing list...');
    };

    const handleAssignmentsUpdated = (event) => {
      console.log('CollegeTrainerAssignment: Assignments updated event received:', event.detail);
      fetchAssignments();
      fetchStats();
    };

    window.addEventListener('assignmentCreated', handleAssignmentCreated);
    window.addEventListener('assignmentsUpdated', handleAssignmentsUpdated);

    return () => {
      window.removeEventListener('assignmentCreated', handleAssignmentCreated);
      window.removeEventListener('assignmentsUpdated', handleAssignmentsUpdated);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh assignments every 30 seconds for real-time updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (activeTab === 'assignments' && document.visibilityState === 'visible') {
        console.log('🔄 Auto-refreshing assignments...');
        fetchAssignments();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAvailableTrainers(),
        fetchAssignments(),
        fetchStats(),
        fetchColleges()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toastUtils.error('Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      setCollegesLoading(true);
      const response = await collegesApi.getAllColleges({ limit: 100 });
      if (response.success) {
        setColleges(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toastUtils.error('Failed to fetch colleges');
    } finally {
      setCollegesLoading(false);
    }
  };

  const fetchAvailableTrainers = async () => {
    try {
      const response = await collegeTrainerApi.getAvailableTrainers(trainerFilters);
      if (response.success) {
        setAvailableTrainers(response.data || []);
        setTrainerPagination(response.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching available trainers:', error);
      toastUtils.error('Failed to fetch available trainers');
    }
  };

  const fetchAssignments = async () => {
    try {
      console.log('🔄 Fetching college trainer assignments with filters:', assignmentFilters);
      const response = await collegeTrainerApi.getCollegeTrainerAssignments(assignmentFilters);
      console.log('📦 Assignments API Response:', response);
      
      // Handle different response structures
      if (response.success) {
        const assignmentsData = response.data || response.assignments || [];
        console.log(`✅ Found ${assignmentsData.length} assignments:`, assignmentsData);
        setAssignments(assignmentsData);
        setAssignmentPagination(response.pagination || {});
      } else if (response.data) {
        // Some APIs return data directly
        const assignmentsData = Array.isArray(response.data) ? response.data : [];
        console.log(`✅ Found ${assignmentsData.length} assignments (direct data):`, assignmentsData);
        setAssignments(assignmentsData);
      } else if (Array.isArray(response)) {
        // Some APIs return array directly
        console.log(`✅ Found ${response.length} assignments (array response):`, response);
        setAssignments(response);
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        setAssignments([]);
      }
    } catch (error) {
      console.error('❌ Error fetching assignments:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Check if it's a backend issue (404, 500, etc.) or frontend issue
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          toastUtils.error('Assignments endpoint not found. Please check backend API.');
        } else if (status === 500) {
          toastUtils.error('Backend server error. Please check backend logs.');
        } else {
          toastUtils.error(`Failed to fetch assignments: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        toastUtils.error('Network error. Please check if backend is running.');
      } else {
        toastUtils.error(`Failed to fetch assignments: ${error.message}`);
      }
      setAssignments([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await collegeTrainerApi.getTrainerAssignmentStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toastUtils.error('Failed to fetch statistics');
    }
  };

  const handleAssignTrainer = async () => {
    if (!assignmentForm.collegeId || !assignmentForm.trainerId) {
      toastUtils.error('Please select a college and trainer');
      return;
    }

    if (!assignmentForm.startDate) {
      toastUtils.error('Please select a start date');
      return;
    }

    try {
      setAssigning(true);
      
      // Format dates to ISO string
      const assignmentData = {
        trainerId: assignmentForm.trainerId,
        startDate: assignmentForm.startDate ? new Date(assignmentForm.startDate).toISOString() : undefined,
        endDate: assignmentForm.endDate ? new Date(assignmentForm.endDate).toISOString() : undefined,
        schedule: assignmentForm.schedule || undefined,
        notes: assignmentForm.notes || undefined
      };

      const response = await collegeTrainerApi.assignTrainerToCollege(
        assignmentForm.collegeId, 
        assignmentData
      );
      
      if (response.success) {
        const assignmentData = response.data || response.assignment;
        console.log('✅ Trainer assigned successfully:', assignmentData);
        
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('assignmentCreated', {
          detail: {
            assignment: assignmentData,
            collegeId: assignmentForm.collegeId,
            trainerId: assignmentForm.trainerId,
            timestamp: new Date().toISOString()
          }
        }));
        
        window.dispatchEvent(new CustomEvent('assignmentsUpdated', {
          detail: {
            action: 'created',
            assignment: assignmentData,
            timestamp: new Date().toISOString()
          }
        }));

        toastUtils.success('Trainer assigned to college successfully');
        setShowAssignmentForm(false);
        setAssignmentForm({ 
          trainerId: '', 
          collegeId: '',
          startDate: '',
          endDate: '',
          schedule: '',
          notes: '' 
        });
        setSelectedCollege(null);
        setSelectedTrainerForAssignment(null);
        fetchInitialData(); // Refresh all data
      } else {
        throw new Error(response.message || 'Failed to assign trainer');
      }
    } catch (error) {
      console.error('Error assigning trainer:', error);
      
      // Extract the proper error message from the response
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign trainer';
      toastUtils.error(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignTrainer = async (collegeId, trainerName) => {
    if (!window.confirm(`Are you sure you want to unassign ${trainerName} from this college?`)) {
      return;
    }

    try {
      setAssigning(true);
      const response = await collegeTrainerApi.unassignTrainerFromCollege(collegeId);
      
      if (response.success) {
        toastUtils.success('Trainer unassigned successfully');
        fetchInitialData(); // Refresh all data
      } else {
        throw new Error(response.message || 'Failed to unassign trainer');
      }
    } catch (error) {
      console.error('Error unassigning trainer:', error);
      
      // Extract the proper error message from the response
      const errorMessage = error.response?.data?.message || error.message || 'Failed to unassign trainer';
      toastUtils.error(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTrainerStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800';
      case 'NOT_AVAILABLE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading assignment data...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              College-Trainer Assignment Management
            </h3>
            <p className="text-sm text-gray-600">
              Assign available trainers to colleges and manage assignments
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchInitialData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Current Assignments
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="h-4 w-4 inline mr-2" />
              Available Trainers
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Statistics
            </button>
          </nav>
        </div>
      </div>

      {/* Current Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Assignments List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900">
                Current Assignments ({assignments.length})
              </h4>
              <button
                onClick={fetchAssignments}
                className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                title="Refresh assignments"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading assignments...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-600 mb-4">
                  {assignmentFilters.collegeId || assignmentFilters.trainerId || assignmentFilters.status
                    ? 'Try adjusting your filters'
                    : 'Get started by assigning a trainer to a college'}
                </p>
                {!assignmentFilters.collegeId && !assignmentFilters.trainerId && !assignmentFilters.status && (
                  <button
                    onClick={() => {
                      setActiveTab('available');
                      setShowAssignmentForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign First Trainer
                  </button>
                )}
              </div>
            ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          {assignment.college?.name}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {assignment.college?.city}, {assignment.college?.state}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {/* Timing Information */}
                        {(assignment.startDate || assignment.schedule) && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            {assignment.startDate && (
                              <p className="text-xs text-gray-600">
                                <strong>Start:</strong> {new Date(assignment.startDate).toLocaleDateString()}
                                {assignment.endDate && (
                                  <> | <strong>End:</strong> {new Date(assignment.endDate).toLocaleDateString()}</>
                                )}
                                {!assignment.endDate && <span className="text-blue-600 ml-1">(Ongoing)</span>}
                              </p>
                            )}
                            {assignment.schedule && (
                              <p className="text-xs text-gray-600 mt-1">
                                <strong>Schedule:</strong> {assignment.schedule}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {assignment.trainer?.name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {assignment.trainer?.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {assignment.trainer?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            ⭐ {assignment.trainer?.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            {assignment.trainer?.experience} years
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnassignTrainer(assignment.collegeId, assignment.trainer?.name)}
                        disabled={assigning}
                        className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Unassign
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      )}

      {/* Available Trainers Tab */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                placeholder="e.g., Python, React"
                value={trainerFilters.specialization}
                onChange={(e) => setTrainerFilters({...trainerFilters, specialization: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Mumbai, Delhi"
                value={trainerFilters.location}
                onChange={(e) => setTrainerFilters({...trainerFilters, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Experience
              </label>
              <input
                type="number"
                placeholder="Years"
                value={trainerFilters.experience}
                onChange={(e) => setTrainerFilters({...trainerFilters, experience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAvailableTrainers}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </button>
            </div>
          </div>

          {/* Available Trainers List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900">
                Available Trainers ({availableTrainers.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTrainers.map((trainer) => (
                <div key={trainer.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {trainer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          {trainer.name}
                        </h5>
                        <p className="text-xs text-gray-600">{trainer.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTrainerStatusColor(trainer.status)}`}>
                            {trainer.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            ⭐ {trainer.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCollege({ id: 'college-id', name: 'Select College' });
                        setAssignmentForm({ ...assignmentForm, trainerId: trainer.id });
                        setShowAssignmentForm(true);
                      }}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{trainer.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {trainer.experience} years experience
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {trainer.specialization?.slice(0, 3).map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {spec}
                        </span>
                      ))}
                      {trainer.specialization?.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{trainer.specialization.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {availableTrainers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No available trainers found</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Colleges</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalColleges}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">With Trainers</p>
                  <p className="text-2xl font-bold text-green-900">{stats.collegesWithTrainers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Available Trainers</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.availableTrainers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">Assignment Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.assignmentRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Assignment Status Breakdown</h5>
              <div className="space-y-2">
                {stats.assignmentsByStatus?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{item.status}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Trainer Utilization</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="text-sm font-medium text-green-600">{stats.availableTrainers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Booked</span>
                  <span className="text-sm font-medium text-blue-600">{stats.bookedTrainers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Utilization Rate</span>
                  <span className="text-sm font-medium text-purple-600">{stats.trainerUtilization}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Assign Trainer</h4>
              <button
                onClick={() => setShowAssignmentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Trainer Info (if selected from available trainers) */}
              {selectedTrainerForAssignment && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Selected Trainer:</p>
                  <p className="text-sm text-gray-600">{selectedTrainerForAssignment.name}</p>
                  <p className="text-xs text-gray-500">{selectedTrainerForAssignment.email}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College *
                </label>
                <select
                  value={assignmentForm.collegeId}
                  onChange={(e) => {
                    const collegeId = e.target.value;
                    const college = colleges.find(c => c.id === collegeId || c._id === collegeId);
                    setAssignmentForm({...assignmentForm, collegeId});
                    setSelectedCollege(college || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={collegesLoading}
                >
                  <option value="">Select a college</option>
                  {colleges.map((college) => (
                    <option key={college.id || college._id} value={college.id || college._id}>
                      {college.name} {college.city ? `- ${college.city}` : ''}
                    </option>
                  ))}
                </select>
                {collegesLoading && (
                  <p className="mt-1 text-xs text-gray-500">Loading colleges...</p>
                )}
              </div>

              {!selectedTrainerForAssignment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trainer ID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter trainer ID"
                    value={assignmentForm.trainerId}
                    onChange={(e) => setAssignmentForm({...assignmentForm, trainerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={assignmentForm.startDate}
                  onChange={(e) => setAssignmentForm({...assignmentForm, startDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={assignmentForm.endDate}
                  onChange={(e) => setAssignmentForm({...assignmentForm, endDate: e.target.value})}
                  min={assignmentForm.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty for ongoing assignment</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Monday, Wednesday, Friday 10:00 AM - 12:00 PM"
                  value={assignmentForm.schedule}
                  onChange={(e) => setAssignmentForm({...assignmentForm, schedule: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Describe the training schedule</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes about this assignment..."
                  value={assignmentForm.notes}
                  onChange={(e) => setAssignmentForm({...assignmentForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignmentForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTrainer}
                disabled={assigning || !assignmentForm.collegeId || !assignmentForm.trainerId || !assignmentForm.startDate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {assigning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {assigning ? 'Assigning...' : 'Assign Trainer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeTrainerAssignment;
