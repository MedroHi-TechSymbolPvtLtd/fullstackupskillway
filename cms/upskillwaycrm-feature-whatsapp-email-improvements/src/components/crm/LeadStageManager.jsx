import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  ArrowRight,
  MessageSquare,
  Phone,
  Calendar,
  Star
} from 'lucide-react';
import leadsApi from '../../services/api/leadsApi';
import toastUtils from '../../utils/toastUtils';

const LeadStageManager = ({ lead, onStageUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStage, setSelectedStage] = useState(lead?.stage || 'START');
  const [selectedPriority, setSelectedPriority] = useState(lead?.priority || 'MEDIUM');
  const [notes, setNotes] = useState('');
  const [showStageModal, setShowStageModal] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0); // Add debouncing

  // Update local state when lead prop changes
  useEffect(() => {
    if (lead) {
      setSelectedStage(lead.stage || 'START');
      setSelectedPriority(lead.priority || 'MEDIUM');
    }
  }, [lead]);

  const stageConfig = {
    START: {
      label: 'Start',
      color: 'bg-blue-100 text-blue-800',
      icon: Clock,
      description: 'Initial stage - processing started'
    },
    IN_CONVERSATION: {
      label: 'In Conversation',
      color: 'bg-purple-100 text-purple-800',
      icon: MessageSquare,
      description: 'Lead is in active conversation'
    },
    EMAIL_WHATSAPP: {
      label: 'Email/WhatsApp',
      color: 'bg-green-100 text-green-800',
      icon: Phone,
      description: 'Lead contacted via email or WhatsApp'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      color: 'bg-orange-100 text-orange-800',
      icon: Clock,
      description: 'Lead is actively being processed'
    },
    CONVERT: {
      label: 'Convert',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      description: 'Successfully converted to customer'
    },
    DENIED: {
      label: 'Denied',
      color: 'bg-red-100 text-red-800',
      icon: XCircle,
      description: 'Lead declined or rejected'
    }
  };

  const priorityConfig = {
    LOW: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
    MEDIUM: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    HIGH: { label: 'High', color: 'bg-orange-100 text-orange-800' },
    URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-800' }
  };

  const stageFlow = [
    'START',
    'IN_CONVERSATION',
    'EMAIL_WHATSAPP',
    'IN_PROGRESS',
    'CONVERT'
  ];

  const handleStageUpdate = async () => {
    if (!lead) {
      console.error('No lead data available for stage update');
      return;
    }

    // Debounce rapid updates (prevent multiple calls within 2 seconds)
    const now = Date.now();
    if (now - lastUpdateTime < 2000) {
      toastUtils.error('Please wait before making another update');
      return;
    }

    try {
      setIsUpdating(true);
      setLastUpdateTime(now);
      
      // Prepare the payload for the status API
      const statusData = {
        stage: selectedStage,
        status: lead.status || 'ACTIVE', // Use current status or default to ACTIVE
        notes: notes.trim(),
        value: Number(lead.value) || 0 // Convert to number
      };

      console.log('Updating lead status:', {
        leadId: lead.id,
        statusData,
        apiUrl: `/leads/${lead.id}/status`
      });

      const response = await leadsApi.updateLeadStatus(lead.id, statusData);
      
      console.log('Stage update response:', response);
      
      if (response.success) {
        toastUtils.success('Lead stage updated successfully');
        setNotes('');
        setShowStageModal(false);
        if (onStageUpdate) {
          onStageUpdate(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to update lead stage');
      }
    } catch (error) {
      console.error('Error updating lead stage:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update lead stage';
      
      toastUtils.error(`Stage update failed: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentStageIndex = () => {
    return stageFlow.indexOf(lead?.stage || 'START');
  };

  const getNextStage = () => {
    const currentIndex = getCurrentStageIndex();
    return currentIndex < stageFlow.length - 1 ? stageFlow[currentIndex + 1] : null;
  };

  const getPreviousStage = () => {
    const currentIndex = getCurrentStageIndex();
    return currentIndex > 0 ? stageFlow[currentIndex - 1] : null;
  };

  const quickStageUpdate = async (newStage) => {
    if (!lead) {
      console.error('No lead data available for quick stage update');
      return;
    }

    // Check if this is a conversion and organization is required
    if (newStage === 'CONVERT') {
      if (!lead.organization || lead.organization.trim() === '') {
        toastUtils.error('Organization field is required for conversion. Please update the lead with an organization name first.');
        return;
      }
    }

    // Debounce rapid updates (prevent multiple calls within 2 seconds)
    const now = Date.now();
    if (now - lastUpdateTime < 2000) {
      toastUtils.error('Please wait before making another update');
      return;
    }

    try {
      setIsUpdating(true);
      setLastUpdateTime(now);
      
      // Prepare the payload for the status API
      const statusData = {
        stage: newStage,
        status: lead.status || 'ACTIVE',
        notes: newStage === 'CONVERT' 
          ? `Lead converted to college: ${lead.organization || lead.name}`
          : `Stage updated to ${stageConfig[newStage]?.label}`,
        value: Number(lead.value) || 0 // Convert to number
      };

      console.log('Quick stage update:', {
        leadId: lead.id,
        newStage,
        statusData,
        apiUrl: `/leads/${lead.id}/status`
      });

      const response = await leadsApi.updateLeadStatus(lead.id, statusData);
      
      console.log('Quick stage update response:', response);
      
      if (response.success) {
        const updatedLead = response.data;
        
        // Show conversion-specific message
        if (newStage === 'CONVERT' && updatedLead.college) {
          toastUtils.success(`✅ Lead converted! College "${updatedLead.college.name}" ${updatedLead.collegeId ? 'linked' : 'created'}.`);
        } else {
          toastUtils.success('Lead stage updated successfully');
        }
        
        if (onStageUpdate) {
          onStageUpdate(updatedLead);
        }
      } else {
        throw new Error(response.message || 'Failed to update lead stage');
      }
    } catch (error) {
      console.error('Error updating lead stage:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update lead stage';
      
      toastUtils.error(`Stage update failed: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!lead) return null;

  const currentStageConfig = stageConfig[lead.stage] || stageConfig.START;
  const CurrentStageIcon = currentStageConfig.icon || Clock;
  const nextStage = getNextStage();
  const previousStage = getPreviousStage();

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CurrentStageIcon className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lead Stage</h3>
              <p className="text-sm text-gray-500">Manage lead workflow and progression</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Current Stage Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStageConfig.color}`}>
              {currentStageConfig.label}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[lead.priority]?.color || priorityConfig.MEDIUM.color}`}>
              {priorityConfig[lead.priority]?.label || 'Medium'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {currentStageConfig.description}
          </div>
        </div>

        {/* Stage Flow Visualization */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {stageFlow.map((stage, index) => {
              const config = stageConfig[stage];
              const StageIcon = config.icon;
              const isActive = stage === lead.stage;
              const isCompleted = getCurrentStageIndex() > index;
              
              return (
                <div key={stage} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    <StageIcon className="h-4 w-4" />
                    <span>{config.label}</span>
                  </div>
                  {index < stageFlow.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3 mb-4">
          {previousStage && (
            <button
              onClick={() => quickStageUpdate(previousStage)}
              disabled={isUpdating}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Previous Stage
            </button>
          )}
          
          {nextStage && (
            <button
              onClick={() => quickStageUpdate(nextStage)}
              disabled={isUpdating || (nextStage === 'CONVERT' && (!lead.organization || lead.organization.trim() === ''))}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title={nextStage === 'CONVERT' && (!lead.organization || lead.organization.trim() === '') 
                ? 'Organization field required for conversion' 
                : `Move to ${stageConfig[nextStage]?.label}`}
            >
              Next Stage
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
          
           <button
             onClick={() => setShowStageModal(true)}
             disabled={isUpdating}
             className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
           >
             <Star className="h-4 w-4 mr-2" />
             Custom Update
           </button>
         </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stage
                </label>
                <div className="text-sm text-gray-900">
                  {currentStageConfig.label} - {currentStageConfig.description}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="text-sm text-gray-900">
                  {priorityConfig[lead.priority]?.label || 'Medium'}
                </div>
              </div>
            </div>
            
            {lead.notes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Notes
                </label>
                <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {lead.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stage Update Modal */}
      {showStageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Lead Stage</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage
                  </label>
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(stageConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this stage update..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowStageModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStageUpdate}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Stage'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadStageManager;
