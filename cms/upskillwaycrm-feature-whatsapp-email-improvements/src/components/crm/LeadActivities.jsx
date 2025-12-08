import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  User, 
  ArrowRight,
  RefreshCw,
  Plus,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import leadsApi from '../../services/api/leadsApi';
import toastUtils from '../../utils/toastUtils';
import LoadingSpinner from '../common/LoadingSpinner';

const LeadActivities = ({ leadId, onActivityAdded }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'NOTE',
    description: '',
    notes: ''
  });

  useEffect(() => {
    if (leadId) {
      fetchActivities();
    }
  }, [leadId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getLeadActivities(leadId);
      
      if (response.success) {
        setActivities(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toastUtils.error(error.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  const activityTypeConfig = {
    CALL: {
      label: 'Call',
      icon: Phone,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600'
    },
    EMAIL: {
      label: 'Email',
      icon: Mail,
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-600'
    },
    MEETING: {
      label: 'Meeting',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-800',
      iconColor: 'text-purple-600'
    },
    DEMO: {
      label: 'Demo',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-800',
      iconColor: 'text-orange-600'
    },
    FOLLOW_UP: {
      label: 'Follow Up',
      icon: RefreshCw,
      color: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    STAGE_CHANGE: {
      label: 'Stage Change',
      icon: ArrowRight,
      color: 'bg-indigo-100 text-indigo-800',
      iconColor: 'text-indigo-600'
    },
    ASSIGNMENT: {
      label: 'Assignment',
      icon: User,
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-600'
    },
    NOTE: {
      label: 'Note',
      icon: FileText,
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-600'
    },
    TRAINING_SCHEDULED: {
      label: 'Training Scheduled',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600'
    },
    TRAINING_COMPLETED: {
      label: 'Training Completed',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-600'
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.description.trim()) {
      toastUtils.error('Please enter a description');
      return;
    }

    try {
      // Note: This would typically be a separate API endpoint for adding activities
      // For now, we'll simulate adding an activity
      const activity = {
        id: Date.now().toString(),
        type: newActivity.type,
        description: newActivity.description,
        notes: newActivity.notes,
        performedBy: 'Current User', // This would come from auth context
        createdAt: new Date().toISOString()
      };

      setActivities(prev => [activity, ...prev]);
      setNewActivity({ type: 'NOTE', description: '', notes: '' });
      setShowAddModal(false);
      
      if (onActivityAdded) {
        onActivityAdded(activity);
      }
      
      toastUtils.success('Activity added successfully');
    } catch (error) {
      console.error('Error adding activity:', error);
      toastUtils.error('Failed to add activity');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
              <p className="text-sm text-gray-500">Track all interactions and updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              title="Refresh activities"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-500 mb-4">Start tracking interactions with this lead.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Activity
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {activities.map((activity, index) => {
                const config = activityTypeConfig[activity.type] || activityTypeConfig.NOTE;
                const ActivityIcon = config.icon;
                
                return (
                  <div key={activity.id} className="relative flex items-start space-x-4 pb-6">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.color} flex items-center justify-center`}>
                      <ActivityIcon className={`h-5 w-5 ${config.iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            by {activity.performedBy}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-900 font-medium">
                          {activity.description}
                        </p>
                        {activity.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Activity</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Type
                  </label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(activityTypeConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the activity..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional details or notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadActivities;
