import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight
} from 'lucide-react';
import leadsApi from '../../services/api/leadsApi';
import toastUtils from '../../utils/toastUtils';

const LeadStagesDashboard = () => {
  const navigate = useNavigate();
  const [stagesData, setStagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStagesData();
  }, []);

  // Listen for leads updates and auto-refresh
  useEffect(() => {
    const handleLeadsUpdated = (event) => {
      console.log('LeadStagesDashboard: Leads updated event received:', event.detail);
      fetchStagesData(); // Refresh stages data
    };

    window.addEventListener('leadsUpdated', handleLeadsUpdated);
    window.addEventListener('newLeadCreated', handleLeadsUpdated);

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Auto-refreshing stages dashboard...');
        fetchStagesData();
      }
    }, 30000);

    return () => {
      window.removeEventListener('leadsUpdated', handleLeadsUpdated);
      window.removeEventListener('newLeadCreated', handleLeadsUpdated);
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchStagesData = async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getLeadsByStages();
      
      if (response.success) {
        setStagesData(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch leads by stages');
      }
    } catch (error) {
      console.error('Error fetching leads by stages:', error);
      toastUtils.error('Failed to load dashboard stages');
      setStagesData([]);
    } finally {
      setLoading(false);
    }
  };

  const stageConfig = {
    START: {
      label: 'Start',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Clock,
      description: 'Initial stage'
    },
    IN_CONVERSATION: {
      label: 'In Conversation',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Users,
      description: 'Active conversation'
    },
    EMAIL_WHATSAPP: {
      label: 'Email/WhatsApp',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: MessageSquare,
      description: 'Contacted via email/WhatsApp'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Clock,
      description: 'Being processed'
    },
    CONVERT: {
      label: 'Convert',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      description: 'Ready to convert'
    },
    DENIED: {
      label: 'Denied',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
      description: 'Declined or rejected'
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Stages Dashboard</h2>
          <p className="text-gray-600 mt-1">Track leads across different stages</p>
        </div>
        <button
          onClick={fetchStagesData}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>

      {/* Stage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(stageConfig).map(([stageKey, config]) => {
          const stageData = stagesData.find(s => s.stage === stageKey) || {
            stage: stageKey,
            count: 0,
            leads: []
          };
          const StageIcon = config.icon;

          return (
            <div
              key={stageKey}
              className={`bg-white rounded-lg shadow border-2 ${config.color.replace('bg-', 'border-')} p-4`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <StageIcon className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{config.label}</h3>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${config.color}`}>
                  {stageData.count}
                </div>
              </div>

              {/* Leads List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stageData.leads && stageData.leads.length > 0 ? (
                  stageData.leads.slice(0, 10).map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/dashboard/crm/leads/${lead.id}`)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {lead.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {lead.organization || lead.email}
                          </p>
                        </div>
                        <Eye className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                      {lead.assignedTo && (
                        <p className="text-xs text-gray-400 mt-1">
                          Assigned: {lead.assignedTo.name}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No leads in this stage</p>
                  </div>
                )}
              </div>

              {/* View All Link */}
              {stageData.count > 10 && (
                <button
                  onClick={() => navigate(`/dashboard/crm/leads?stage=${stageKey}`)}
                  className="w-full mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center"
                >
                  View all {stageData.count} leads
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadStagesDashboard;

