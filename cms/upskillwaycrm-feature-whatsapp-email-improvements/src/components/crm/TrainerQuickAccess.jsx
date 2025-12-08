import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Eye
} from 'lucide-react';
import trainerBookingsApi from '../../services/api/trainerBookingsApi';
import toastUtils from '../../utils/toastUtils';

const TrainerQuickAccess = ({ className = "" }) => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    busy: 0,
    unavailable: 0
  });

  useEffect(() => {
    fetchTrainerStats();
  }, []);

  const fetchTrainerStats = async () => {
    try {
      setLoading(true);
      
      // Mock trainers data - replace with actual API call
      const mockTrainers = [
        { id: '1', name: 'John Smith', status: 'AVAILABLE', rating: 4.8, totalSessions: 150 },
        { id: '2', name: 'Sarah Johnson', status: 'BUSY', rating: 4.9, totalSessions: 200 },
        { id: '3', name: 'Mike Wilson', status: 'NOT_AVAILABLE', rating: 4.7, totalSessions: 120 },
        { id: '4', name: 'Emily Davis', status: 'AVAILABLE', rating: 4.6, totalSessions: 90 },
        { id: '5', name: 'David Brown', status: 'BUSY', rating: 4.8, totalSessions: 180 }
      ];
      
      setTrainers(mockTrainers);
      
      // Calculate stats
      const calculatedStats = {
        total: mockTrainers.length,
        available: mockTrainers.filter(t => t.status === 'AVAILABLE').length,
        busy: mockTrainers.filter(t => t.status === 'BUSY').length,
        unavailable: mockTrainers.filter(t => t.status === 'NOT_AVAILABLE').length
      };
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching trainer stats:', error);
      toastUtils.error('Failed to load trainer statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'text-green-600 bg-green-50';
      case 'BUSY':
        return 'text-yellow-600 bg-yellow-50';
      case 'NOT_AVAILABLE':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Trainer Management</h3>
        </div>
        <button
          onClick={() => navigate('/dashboard/crm/trainers')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          <div className="text-xs text-gray-500">Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.busy}</div>
          <div className="text-xs text-gray-500">Busy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.unavailable}</div>
          <div className="text-xs text-gray-500">Unavailable</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => navigate('/dashboard/crm/trainers')}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <Eye className="h-4 w-4 mr-2" />
          Manage Trainers
        </button>
        <button
          onClick={() => navigate('/dashboard/crm/trainer-bookings/create')}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Session
        </button>
      </div>

      {/* Recent Trainers */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Trainers</h4>
        <div className="space-y-2">
          {trainers.slice(0, 3).map((trainer) => {
            const StatusIcon = getStatusIcon(trainer.status);
            
            return (
              <div
                key={trainer.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/dashboard/crm/trainers')}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trainer.name}</p>
                    <p className="text-xs text-gray-500">⭐ {trainer.rating} • {trainer.totalSessions} sessions</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {trainer.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Average Rating</span>
          <span className="font-medium text-gray-900">
            ⭐ {(trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Total Sessions</span>
          <span className="font-medium text-gray-900">
            {trainers.reduce((sum, t) => sum + t.totalSessions, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrainerQuickAccess;
