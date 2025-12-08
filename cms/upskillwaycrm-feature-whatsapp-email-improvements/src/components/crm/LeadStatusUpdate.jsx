import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  FileText,
  Save,
  X
} from 'lucide-react';
import leadsApi from '../../services/api/leadsApi';
import crmService from '../../services/crmService';
import toastUtils from '../../utils/toastUtils';

const LeadStatusUpdate = ({ lead, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    stage: lead?.stage || 'START',
    status: lead?.status || 'ACTIVE',
    notes: lead?.notes || '',
    value: lead?.value || 0
  });
  const [loading, setLoading] = useState(false);

  const stageOptions = [
    { value: 'START', label: 'Start', icon: Clock, color: 'bg-blue-100 text-blue-800' },
    { value: 'IN_CONVERSATION', label: 'In Conversation', icon: Users, color: 'bg-purple-100 text-purple-800' },
    { value: 'EMAIL_WHATSAPP', label: 'Email/WhatsApp', icon: MessageSquare, color: 'bg-green-100 text-green-800' },
    { value: 'IN_PROGRESS', label: 'In Progress', icon: Clock, color: 'bg-orange-100 text-orange-800' },
    { value: 'CONVERT', label: 'Convert', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'DENIED', label: 'Denied', icon: AlertCircle, color: 'bg-red-100 text-red-800' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if this is a conversion (CONVERT stage)
      const isConversion = formData.stage === 'CONVERT';
      
      if (isConversion) {
        console.log('🔄 Lead conversion detected - using CONVERT stage for lead', lead.id);
        
        // Check if organization field exists (required for conversion)
        if (!lead.organization || lead.organization.trim() === '') {
          toastUtils.error('Organization field is required for conversion. Please update the lead with an organization name first.');
          setLoading(false);
          return;
        }
        
        // Use the API endpoint with CONVERT stage (not CONVERTED)
        // The backend will automatically create college and change stage to CONVERTED
        const payload = {
          stage: 'CONVERT', // ⚠️ Use CONVERT (not CONVERTED) to trigger conversion
          notes: formData.notes || `Lead converted to college: ${lead.organization}`,
          value: Number(formData.value) || 0
        };
        
        console.log('🔄 Converting lead with payload:', payload);
        
        const response = await leadsApi.updateLeadStatus(lead.id, payload);
        
        if (response.success) {
          // Check if college was created/linked
          const updatedLead = response.data;
          
          if (updatedLead.college) {
            // College was created or linked
            const message = updatedLead.college.id 
              ? `✅ Lead converted successfully! College "${updatedLead.college.name}" ${updatedLead.collegeId ? 'linked' : 'created'}.`
              : '✅ Lead converted successfully!';
            toastUtils.success(message);
          } else if (updatedLead.collegeId) {
            // Linked to existing college
            toastUtils.success('✅ Lead converted and linked to existing college!');
          } else {
            // Conversion happened but no college info in response
            toastUtils.warning('Lead converted, but college information is not available. Please check if organization field was set.');
          }
          
          // Update the lead data with conversion info
          onUpdate(updatedLead);
          onClose();
        } else {
          throw new Error(response.message || 'Failed to convert lead');
        }
      } else {
        // For non-conversion updates, use the regular API
        const payload = {
          stage: formData.stage,
          status: formData.status,
          notes: formData.notes,
          value: Number(formData.value) || 0
        };

        console.log('Sending regular status update payload:', payload);
        
        const response = await leadsApi.updateLeadStatus(lead.id, payload);
        
        if (response.success) {
          toastUtils.success('Lead status updated successfully!');
          onUpdate(response.data);
          onClose();
        } else {
          toastUtils.error(response.message || 'Failed to update lead status');
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      toastUtils.error(error.response?.data?.message || error.message || 'Failed to update lead status');
    } finally {
      setLoading(false);
    }
  };

  const selectedStage = stageOptions.find(stage => stage.value === formData.stage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Update Lead Status</h2>
              <p className="text-sm text-gray-500 mt-1">
                {lead?.name} - {lead?.organization}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Current Stage Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Current Stage</h3>
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${selectedStage?.color} flex items-center justify-center`}>
                  {selectedStage?.icon && React.createElement(selectedStage.icon, { className: "h-5 w-5" })}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{selectedStage?.label}</p>
                  <p className="text-sm text-gray-500">Current stage</p>
                </div>
              </div>
            </div>

            {/* Stage Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Stage
              </label>
              <div className="grid grid-cols-2 gap-3">
                {stageOptions.map((stage) => (
                  <label
                    key={stage.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.stage === stage.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${stage.value === 'CONVERT' ? 'ring-2 ring-green-200' : ''}`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value={stage.value}
                      checked={formData.stage === stage.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${stage.color} flex items-center justify-center mr-3`}>
                      {React.createElement(stage.icon, { className: "h-4 w-4" })}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{stage.label}</span>
                      {stage.value === 'CONVERT' && (
                        <div className="mt-1">
                          <p className="text-xs text-green-600 font-medium">
                            🏫 Will create/link college automatically
                          </p>
                          {!lead?.organization && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Organization field required
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Conversion Warning */}
            {formData.stage === 'CONVERT' && (
              <div className={`border rounded-lg p-4 ${
                lead?.organization 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {lead?.organization ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`text-sm font-medium ${
                      lead?.organization ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      Lead Conversion
                    </h4>
                    {lead?.organization ? (
                      <>
                        <p className="text-sm text-green-700 mt-1">
                          Converting this lead will automatically:
                        </p>
                        <ul className="text-sm text-green-700 mt-2 space-y-1">
                          <li>• Create a new college from organization: <strong>"{lead.organization}"</strong></li>
                          <li>• Or link to an existing college if one already exists with the same name</li>
                          <li>• Set up the college with contact information from this lead</li>
                          <li>• Track the conversion for reporting and analytics</li>
                        </ul>
                      </>
                    ) : (
                      <div className="text-sm text-yellow-700 mt-1">
                        <p className="font-medium mb-2">⚠️ Organization field is required for conversion!</p>
                        <p>Please update the lead with an organization name before converting. The organization name will be used as the college name.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Value
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter lead value"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add notes about this status update..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadStatusUpdate;
