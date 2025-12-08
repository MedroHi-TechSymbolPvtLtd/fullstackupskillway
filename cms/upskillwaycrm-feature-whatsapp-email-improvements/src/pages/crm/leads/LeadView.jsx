import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  User,
  FileText,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import leadsApi from '../../../services/api/leadsApi';
import toastUtils from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import LeadStageManager from '../../../components/crm/LeadStageManager';
import LeadActivities from '../../../components/crm/LeadActivities';

const LeadView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isLoading: false
  });

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getLeadById(id);
      
      if (response.success) {
        setLead(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch lead');
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
      toastUtils.crud.fetchError('Lead', error.message);
      navigate('/dashboard/crm/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStageUpdate = async (updatedLead) => {
    try {
      console.log('LeadView: Converting lead to college:', updatedLead);
      
      // If stage is CONVERT, trigger conversion
      if (updatedLead.stage === 'CONVERT') {
        const payload = {
          stage: 'CONVERT',
          notes: `Lead converted to college: ${updatedLead.organization || updatedLead.name}`
        };
        
        const response = await leadsApi.updateLeadStatus(updatedLead.id, payload);
        
        if (response.success) {
          const convertedLead = response.data;
          setLead(convertedLead);
          
          if (convertedLead.college) {
            toastUtils.success(`✅ Lead converted! College "${convertedLead.college.name}" ${convertedLead.collegeId ? 'linked' : 'created'}.`);
          } else {
            toastUtils.success('✅ Lead converted successfully!');
          }
        } else {
          throw new Error(response.message || 'Failed to convert lead');
        }
      } else {
        // Regular stage update
        setLead(updatedLead);
        toastUtils.success('Lead stage updated successfully');
      }
    } catch (error) {
      console.error('Error updating lead stage:', error);
      toastUtils.error(error.response?.data?.message || error.message || 'Failed to update lead stage');
    }
  };

  const handleActivityAdded = (activity) => {
    // Activity was added successfully, the LeadActivities component will handle the UI update
    console.log('Activity added:', activity);
  };

  const handleEdit = () => {
    navigate(`/dashboard/crm/leads/${id}/edit`);
  };

  const handleDelete = () => {
    if (!lead) return;

    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      isLoading: false
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      
      const response = await leadsApi.deleteLead(id);
      
      if (response.success) {
        toastUtils.crud.deleted('Lead');
        navigate('/dashboard/crm/leads');
      } else {
        throw new Error(response.message || 'Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toastUtils.crud.deleteError('Lead', error.message);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, isLoading: false });
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      website: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Website' },
      referral: { bg: 'bg-green-100', text: 'text-green-800', label: 'Referral' },
      social: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Social Media' },
      email: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Email' },
      phone: { bg: 'bg-red-100', text: 'text-red-800', label: 'Phone' }
    };

    const config = sourceConfig[source] || sourceConfig.website;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Lead not found</h3>
        <p className="text-gray-500 mb-4">The lead you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/crm/leads')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/crm/leads')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {getSourceBadge(lead.source)}
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                Created {formatDate(lead.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLead}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            title="Refresh Lead Data"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Stage Manager */}
          <LeadStageManager lead={lead} onStageUpdate={handleStageUpdate} />

          {/* Debug Section - remove in production */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info</h3>
            <div className="text-xs text-yellow-700">
              <p><strong>Lead ID:</strong> {lead?.id}</p>
              <p><strong>Current Stage:</strong> {lead?.stage}</p>
              <p><strong>Current Priority:</strong> {lead?.priority}</p>
              <p><strong>Last Updated:</strong> {lead?.updatedAt}</p>
              <p><strong>Notes:</strong> {lead?.notes || 'None'}</p>
            </div>
          </div>

          {/* Lead Information */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <div className="flex items-center text-gray-900">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {lead.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Organization
                </label>
                <div className="flex items-center text-gray-900">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  {lead.organization}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                <div className="flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`mailto:${lead.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`tel:${lead.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {lead.phone}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Source
                </label>
                <div>{getSourceBadge(lead.source)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created Date
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDate(lead.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Requirement */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirement</h2>
            <div className="prose max-w-none">
              <div className="flex items-start">
                <FileText className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                <p className="text-gray-700 whitespace-pre-wrap">{lead.requirement}</p>
              </div>
            </div>
          </div>

          {/* Lead Activities */}
          <LeadActivities leadId={lead.id} onActivityAdded={handleActivityAdded} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {/* Convert to College Button - Only show if not already converted */}
              {lead.stage !== 'CONVERTED' && lead.stage !== 'CONVERT' && (
                <button
                  onClick={() => {
                    if (!lead.organization || lead.organization.trim() === '') {
                      toastUtils.error('Organization field is required for conversion. Please edit the lead and add an organization name first.');
                      handleEdit();
                    } else {
                      // Trigger conversion by updating stage to CONVERT
                      handleStageUpdate({
                        ...lead,
                        stage: 'CONVERT'
                      });
                    }
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Convert to College
                </button>
              )}
              
              {/* Show conversion status if already converted */}
              {lead.stage === 'CONVERTED' && lead.collegeId && (
                <div className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-50 text-green-800 rounded-lg border border-green-200">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="font-medium">Converted to College</span>
                </div>
              )}
              
              <a
                href={`mailto:${lead.email}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </a>
              
              <a
                href={`tel:${lead.phone}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Lead
              </a>

              <button
                onClick={handleEdit}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Lead
              </button>
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Lead ID
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {lead.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Source
                </label>
                <div>{getSourceBadge(lead.source)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created
                </label>
                <div className="flex items-center text-sm text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDate(lead.createdAt)}
                </div>
              </div>

              {lead.lastContactAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Contact
                  </label>
                  <div className="flex items-center text-sm text-gray-900">
                    <RefreshCw className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(lead.lastContactAt)}
                  </div>
                </div>
              )}

              {lead.nextFollowUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Next Follow-up
                  </label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(lead.nextFollowUp)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={lead?.name || ''}
        itemType="Lead"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default LeadView;
