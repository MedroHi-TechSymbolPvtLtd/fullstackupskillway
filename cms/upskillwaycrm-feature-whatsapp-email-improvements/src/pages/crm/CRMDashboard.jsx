import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap,
  Building2,
  TrendingUp,
  Plus,
  MoreVertical,
  User,
  RefreshCw,
  Eye,
  BarChart3
} from 'lucide-react';
import crmService from '../../services/crmService';
import ExcelUploadWidget from '../../components/crm/ExcelUploadWidget';
import LeadStagesDashboard from '../../components/crm/LeadStagesDashboard';
import toastUtils from '../../utils/toastUtils';

const CRMDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    leads: { total: 0, new: 0, qualified: 0, converted: 0 },
    users: { total: 0, active: 0, inactive: 0 }, // Sales persons
    colleges: { total: 0, active: 0, inactive: 0 },
    trainers: { total: 0, available: 0, busy: 0 }
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentColleges, setRecentColleges] = useState([]);
  const [recentTrainers, setRecentTrainers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStagesDashboard, setShowStagesDashboard] = useState(false);

  useEffect(() => {
    fetchCrmData();
  }, []);

  // Debug: Log whenever stats state changes
  useEffect(() => {
    console.log('🔍 CRM Dashboard - Stats state changed:', stats);
    console.log('🔍 CRM Dashboard - Stats breakdown:', {
      leads: stats.leads,
      users: stats.users,
      colleges: stats.colleges,
      trainers: stats.trainers,
      leadsTotal: stats.leads?.total,
      usersTotal: stats.users?.total,
      collegesTotal: stats.colleges?.total,
      trainersTotal: stats.trainers?.total
    });
  }, [stats]);

  const fetchCrmData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching CRM data...');
      
      // Fetch data directly from APIs - use pagination.total from each API response
      // These APIs return pagination.total which is the TRUE total count from the database
      // Note: We don't need limit: 1000 - pagination.total is always correct regardless of limit
      const [statsResponse, allLeadsResponse, recentLeadsResponse, allCollegesResponse, recentCollegesResponse, allTrainersResponse, recentTrainersResponse, allUsersResponse, recentUsersResponse] = await Promise.all([
        crmService.getStats(), // Stats API for reference
        crmService.getLeads({}), // Get leads - API will return pagination.total: 9 (TRUE total)
        crmService.getLeads({ limit: 5 }), // Get recent leads for display
        crmService.getColleges({}).catch(() => ({ success: false, data: [], pagination: { total: 0 } })), // Get colleges - API will return pagination.total: 0
        crmService.getColleges({ limit: 5 }), // Get recent colleges for display
        crmService.getTrainers({}).catch(() => ({ success: false, data: [], pagination: { total: 0 } })), // Get trainers - API will return pagination.total: 0
        crmService.getTrainers({ limit: 5 }), // Get recent trainers for display
        crmService.getUsers({}).catch(() => ({ success: false, data: [], pagination: { total: 0 } })), // Get users - API will return pagination.total: 2
        crmService.getUsers({ limit: 5 }) // Get recent users for display
      ]);
      
      // Summary of pagination totals from each API
      console.log('📊 ========== API Responses Summary ==========');
      console.log('📊 Leads API - pagination.total:', allLeadsResponse.pagination?.total);
      console.log('📊 Users API - pagination.total:', allUsersResponse.pagination?.total);
      console.log('📊 Colleges API - pagination.total:', allCollegesResponse.pagination?.total);
      console.log('📊 Trainers API - pagination.total:', allTrainersResponse.pagination?.total);
      console.log('📊 ========== END API Responses Summary ==========');
      
      // Detailed logging of all responses
      console.log('📊 ========== CRM Dashboard API Responses ==========');
      console.log('📊 CRM Stats response:', JSON.stringify(statsResponse, null, 2));
      console.log('📊 Stats API leads data:', statsResponse.data?.leads);
      console.log('📊 Stats API users data:', statsResponse.data?.users);
      console.log('📊 Stats API colleges data:', statsResponse.data?.colleges);
      console.log('📊 Stats API trainers data:', statsResponse.data?.trainers);
      
      console.log('📊 --- All Leads Response ---');
      console.log('📊 All Leads response FULL:', JSON.stringify(allLeadsResponse, null, 2));
      console.log('📊 All Leads response structure:', {
        success: allLeadsResponse.success,
        hasData: !!allLeadsResponse.data,
        dataType: Array.isArray(allLeadsResponse.data) ? 'array' : typeof allLeadsResponse.data,
        dataLength: Array.isArray(allLeadsResponse.data) ? allLeadsResponse.data.length : 'N/A',
        hasPagination: !!allLeadsResponse.pagination,
        paginationObject: allLeadsResponse.pagination,
        paginationTotal: allLeadsResponse.pagination?.total,
        paginationKeys: allLeadsResponse.pagination ? Object.keys(allLeadsResponse.pagination) : [],
        fullResponse: allLeadsResponse
      });
      
      console.log('📊 --- All Colleges Response ---');
      console.log('📊 All Colleges response:', JSON.stringify(allCollegesResponse, null, 2));
      console.log('📊 Colleges pagination.total:', allCollegesResponse.pagination?.total);
      console.log('📊 Colleges data length:', Array.isArray(allCollegesResponse.data) ? allCollegesResponse.data.length : 'N/A');
      
      console.log('📊 --- All Trainers Response ---');
      console.log('📊 All Trainers response:', JSON.stringify(allTrainersResponse, null, 2));
      console.log('📊 Trainers pagination.total:', allTrainersResponse.pagination?.total);
      console.log('📊 Trainers data length:', Array.isArray(allTrainersResponse.data) ? allTrainersResponse.data.length : 'N/A');
      
      console.log('📊 --- All Users Response ---');
      console.log('📊 All Users response:', JSON.stringify(allUsersResponse, null, 2));
      console.log('📊 Users pagination.total:', allUsersResponse.pagination?.total);
      console.log('📊 Users data length:', Array.isArray(allUsersResponse.data) ? allUsersResponse.data.length : 'N/A');
      console.log('📊 ========== END API Responses ==========');
      
      // Initialize final stats
      let finalStats = {
        leads: { total: 0, new: 0, qualified: 0, converted: 0 },
        users: { total: 0, active: 0, inactive: 0 },
        colleges: { total: 0, active: 0, inactive: 0 },
        trainers: { total: 0, available: 0, busy: 0 }
      };

      // Use individual API responses with pagination.total as the source of truth
      // Each API returns pagination.total which is the TRUE total count
      console.log('📊 ========== Using Individual API Responses with pagination.total ==========');
      console.log('📊 Stats API Response (for reference only):', statsResponse.data);
      
      // LEADS: Use pagination.total directly from API response
      if (allLeadsResponse.success) {
        const leads = Array.isArray(allLeadsResponse.data) ? allLeadsResponse.data : [];
        
        // CRITICAL: Use pagination.total - this is the TRUE total from the API (should be 9)
        // The API response structure: { success: true, data: [...], pagination: { total: 9 } }
        // NEVER use array.length - always use pagination.total if it exists
        let totalLeads = 0;
        if (allLeadsResponse.pagination && allLeadsResponse.pagination.total !== undefined && allLeadsResponse.pagination.total !== null) {
          totalLeads = Number(allLeadsResponse.pagination.total);
        } else {
          // Only use array length as last resort if pagination.total is missing
          totalLeads = leads.length;
          console.warn('⚠️ WARNING: Leads API did not return pagination.total, using array length:', leads.length);
        }
        
        console.log('📊 ========== Leads Calculation ==========');
        console.log('📊 Leads API Response Structure:', {
          success: allLeadsResponse.success,
          hasData: !!allLeadsResponse.data,
          dataLength: leads.length,
          hasPagination: !!allLeadsResponse.pagination,
          paginationObject: allLeadsResponse.pagination,
          paginationTotal: allLeadsResponse.pagination?.total,
          paginationTotalType: typeof allLeadsResponse.pagination?.total,
          finalTotal: totalLeads,
          'allLeadsResponse keys': Object.keys(allLeadsResponse || {})
        });
        console.log('📊 Full allLeadsResponse:', JSON.stringify(allLeadsResponse, null, 2));
        
        // Calculate status counts from the leads we received
        const newCount = leads.filter(lead => {
          const status = (lead.status || '').toUpperCase();
          return status === 'NEW' || status === 'START';
        }).length;
        
        const qualifiedCount = leads.filter(lead => {
          const status = (lead.status || '').toUpperCase();
          return status === 'QUALIFIED' || status === 'IN_PROGRESS' || status === 'IN_CONVERSATION' || status === 'ACTIVE';
        }).length;
        
        const convertedCount = leads.filter(lead => {
          const status = (lead.status || '').toUpperCase();
          return status === 'CONVERTED';
        }).length;
        
        // Use pagination.total for total, and calculate status counts from received data
        // If we have all items, use direct counts; otherwise estimate based on proportions
        const hasAllItems = !allLeadsResponse.pagination || allLeadsResponse.pagination.total <= leads.length;
        
        let finalNewCount = newCount;
        let finalQualifiedCount = qualifiedCount;
        let finalConvertedCount = convertedCount;
        
        if (!hasAllItems && totalLeads > leads.length && leads.length > 0) {
          const newRatio = newCount / leads.length;
          const qualifiedRatio = qualifiedCount / leads.length;
          const convertedRatio = convertedCount / leads.length;
          
          finalNewCount = Math.round(totalLeads * newRatio);
          finalQualifiedCount = Math.round(totalLeads * qualifiedRatio);
          finalConvertedCount = Math.round(totalLeads * convertedRatio);
        }
        
        finalStats.leads = {
          total: totalLeads, // Use pagination.total (9 from API)
          new: finalNewCount,
          qualified: finalQualifiedCount,
          converted: finalConvertedCount
        };
        
        console.log('✅ Leads stats calculated:', finalStats.leads);
        console.log('📊 ========== END Leads Calculation ==========');
      } else {
        console.warn('⚠️ Failed to fetch leads:', allLeadsResponse);
      }
      
      // COLLEGES: Use pagination.total directly from API response
      if (allCollegesResponse.success) {
        const colleges = Array.isArray(allCollegesResponse.data) ? allCollegesResponse.data : [];
        
        // CRITICAL: Use pagination.total - this is the TRUE total from the API (should be 0)
        // NEVER use array.length - always use pagination.total if it exists
        let total = 0;
        if (allCollegesResponse.pagination && allCollegesResponse.pagination.total !== undefined && allCollegesResponse.pagination.total !== null) {
          total = Number(allCollegesResponse.pagination.total);
        } else {
          total = colleges.length;
          console.warn('⚠️ WARNING: Colleges API did not return pagination.total, using array length:', colleges.length);
        }
        
        console.log('📊 Colleges API Response:', {
          dataLength: colleges.length,
          paginationTotal: allCollegesResponse.pagination?.total,
          paginationObject: allCollegesResponse.pagination,
          finalTotal: total
        });
        
        const activeCount = colleges.filter(c => (c.status || '').toUpperCase() === 'ACTIVE').length;
        const inactiveCount = colleges.filter(c => (c.status || '').toUpperCase() === 'INACTIVE').length;
        
        finalStats.colleges = {
          total, // Use pagination.total (0 from API)
          active: activeCount,
          inactive: inactiveCount
        };
        
        console.log('✅ Colleges stats calculated:', finalStats.colleges);
      } else {
        console.warn('⚠️ Failed to fetch colleges:', allCollegesResponse);
      }
      
      // TRAINERS: Use pagination.total directly from API response
      if (allTrainersResponse.success) {
        const trainers = Array.isArray(allTrainersResponse.data) ? allTrainersResponse.data : [];
        
        // CRITICAL: Use pagination.total - this is the TRUE total from the API (should be 0)
        // NEVER use array.length - always use pagination.total if it exists
        let total = 0;
        if (allTrainersResponse.pagination && allTrainersResponse.pagination.total !== undefined && allTrainersResponse.pagination.total !== null) {
          total = Number(allTrainersResponse.pagination.total);
        } else {
          total = trainers.length;
          console.warn('⚠️ WARNING: Trainers API did not return pagination.total, using array length:', trainers.length);
        }
        
        console.log('📊 Trainers API Response:', {
          dataLength: trainers.length,
          paginationTotal: allTrainersResponse.pagination?.total,
          paginationObject: allTrainersResponse.pagination,
          finalTotal: total
        });
        
        if (trainers.length > 0) {
          const availableCount = trainers.filter(t => (t.availability || '').toUpperCase() === 'AVAILABLE').length;
          const busyCount = trainers.filter(t => (t.availability || '').toUpperCase() === 'BUSY').length;
          
          // If we have all items, use direct counts; otherwise estimate based on proportions
          const hasAllItems = !allTrainersResponse.pagination || allTrainersResponse.pagination.total <= trainers.length;
          
          let finalAvailableCount = availableCount;
          let finalBusyCount = busyCount;
          
          if (!hasAllItems && total > trainers.length && trainers.length > 0) {
            const availableRatio = availableCount / trainers.length;
            const busyRatio = busyCount / trainers.length;
            finalAvailableCount = Math.round(total * availableRatio);
            finalBusyCount = Math.round(total * busyRatio);
          }
          
          finalStats.trainers = {
            total,
            available: finalAvailableCount,
            busy: finalBusyCount
          };
          console.log('✅ Trainers stats calculated:', finalStats.trainers);
        } else {
          // If no items but pagination.total exists, use it
          finalStats.trainers = {
            total,
            available: 0,
            busy: 0
          };
          console.log('✅ Using pagination total for trainers (no items in response):', total);
        }
      } else {
        console.warn('⚠️ Failed to fetch trainers:', allTrainersResponse);
      }
      
      // USERS (Sales Persons): Use pagination.total directly from API response
      if (allUsersResponse.success) {
        const users = Array.isArray(allUsersResponse.data) ? allUsersResponse.data : [];
        
        // CRITICAL: Use pagination.total - this is the TRUE total from the API (should be 2)
        // NEVER use array.length - always use pagination.total if it exists
        let total = 0;
        if (allUsersResponse.pagination && allUsersResponse.pagination.total !== undefined && allUsersResponse.pagination.total !== null) {
          total = Number(allUsersResponse.pagination.total);
        } else {
          total = users.length;
          console.warn('⚠️ WARNING: Users API did not return pagination.total, using array length:', users.length);
        }
        
        console.log('📊 Users API Response:', {
          dataLength: users.length,
          paginationTotal: allUsersResponse.pagination?.total,
          paginationObject: allUsersResponse.pagination,
          finalTotal: total
        });
        
        if (users.length > 0) {
          const activeCount = users.filter(u => u.isActive === true || (u.status || '').toLowerCase() === 'active').length;
          const inactiveCount = users.filter(u => u.isActive === false || (u.status || '').toLowerCase() === 'inactive').length;
          
          // If we have all items, use direct counts; otherwise estimate based on proportions
          const hasAllItems = !allUsersResponse.pagination || allUsersResponse.pagination.total <= users.length;
          
          let finalActiveCount = activeCount;
          let finalInactiveCount = inactiveCount;
          
          if (!hasAllItems && total > users.length && users.length > 0) {
            const activeRatio = activeCount / users.length;
            const inactiveRatio = inactiveCount / users.length;
            finalActiveCount = Math.round(total * activeRatio);
            finalInactiveCount = Math.round(total * inactiveRatio);
          }
          
          finalStats.users = {
            total,
            active: finalActiveCount,
            inactive: finalInactiveCount
          };
          console.log('✅ Users stats calculated:', finalStats.users);
        } else {
          // If no items but pagination.total exists, use it
          finalStats.users = {
            total,
            active: 0,
            inactive: 0
          };
          console.log('✅ Using pagination total for users (no items in response):', total);
        }
      } else {
        console.warn('⚠️ Failed to fetch users:', allUsersResponse);
      }
      
      // Set the final stats with comprehensive debugging
      console.log('🔍 BEFORE setStats - Final stats object:', JSON.stringify(finalStats, null, 2));
      console.log('🔍 BEFORE setStats - Breakdown:', {
        leadsTotal: finalStats.leads.total,
        leadsNew: finalStats.leads.new,
        leadsQualified: finalStats.leads.qualified,
        leadsConverted: finalStats.leads.converted,
        usersTotal: finalStats.users.total,
        usersActive: finalStats.users.active,
        usersInactive: finalStats.users.inactive,
        collegesTotal: finalStats.colleges.total,
        collegesActive: finalStats.colleges.active,
        collegesInactive: finalStats.colleges.inactive,
        trainersTotal: finalStats.trainers.total,
        trainersAvailable: finalStats.trainers.available,
        trainersBusy: finalStats.trainers.busy
      });
      
      // Verify all values are numbers (not undefined/null)
      const verifiedStats = {
        leads: {
          total: Number(finalStats.leads.total) || 0,
          new: Number(finalStats.leads.new) || 0,
          qualified: Number(finalStats.leads.qualified) || 0,
          converted: Number(finalStats.leads.converted) || 0
        },
        users: {
          total: Number(finalStats.users.total) || 0,
          active: Number(finalStats.users.active) || 0,
          inactive: Number(finalStats.users.inactive) || 0
        },
        colleges: {
          total: Number(finalStats.colleges.total) || 0,
          active: Number(finalStats.colleges.active) || 0,
          inactive: Number(finalStats.colleges.inactive) || 0
        },
        trainers: {
          total: Number(finalStats.trainers.total) || 0,
          available: Number(finalStats.trainers.available) || 0,
          busy: Number(finalStats.trainers.busy) || 0
        }
      };
      
      console.log('🔍 AFTER verification - Verified stats:', JSON.stringify(verifiedStats, null, 2));
      setStats(verifiedStats);
      console.log('✅ setStats() called with verified stats');
      console.log('📊 Final CRM Stats set (should trigger re-render):', verifiedStats);
      
      // Set recent data for display
      if (recentLeadsResponse.success) {
        setRecentLeads(recentLeadsResponse.data || []);
        console.log('✅ Recent leads set:', recentLeadsResponse.data);
      } else {
        console.warn('⚠️ CRM Leads response failed:', recentLeadsResponse);
      }

      if (recentCollegesResponse.success) {
        setRecentColleges(recentCollegesResponse.data || []);
        console.log('✅ Recent colleges set:', recentCollegesResponse.data);
      } else {
        console.warn('⚠️ CRM Colleges response failed:', recentCollegesResponse);
      }

      if (recentTrainersResponse.success) {
        setRecentTrainers(recentTrainersResponse.data || []);
        console.log('✅ Recent trainers set:', recentTrainersResponse.data);
      } else {
        console.warn('⚠️ CRM Trainers response failed:', recentTrainersResponse);
      }

      if (recentUsersResponse.success) {
        setRecentUsers(recentUsersResponse.data || []);
        console.log('✅ Recent users set:', recentUsersResponse.data);
      } else {
        console.warn('⚠️ CRM Users response failed:', recentUsersResponse);
      }
    } catch (error) {
      console.error('❌ Error fetching CRM data:', error);
      setError('Failed to load CRM data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
      case 'qualified':
      case 'converted':
        return 'text-purple-600 bg-purple-100';
      case 'inactive':
      case 'busy':
      case 'new':
        return 'text-purple-500 bg-purple-50';
      case 'pending':
      case 'draft':
        return 'text-purple-400 bg-purple-25';
      case 'closed':
        return 'text-purple-700 bg-purple-200';
      default:
        return 'text-purple-600 bg-purple-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-purple-700 bg-purple-200';
      case 'medium':
        return 'text-purple-500 bg-purple-100';
      case 'low':
        return 'text-purple-400 bg-purple-50';
      default:
        return 'text-purple-600 bg-purple-100';
    }
  };

  // Listen for Excel upload completion and new lead creation to refresh CRM data
  useEffect(() => {
    const handleLeadsUpdated = (event) => {
      console.log('CRM Dashboard: Leads updated event received:', event.detail);
      const source = event.detail?.source || 'unknown';
      fetchCrmData(); // Refresh the CRM data
      
      if (source === 'excel_upload') {
        toastUtils.success('CRM Dashboard refreshed with new Excel upload data!');
      } else if (source === 'website' || source === 'api') {
        toastUtils.success('New lead detected! Refreshing dashboard...');
      } else {
        toastUtils.success('CRM Dashboard refreshed!');
      }
    };

    window.addEventListener('leadsUpdated', handleLeadsUpdated);
    window.addEventListener('newLeadCreated', handleLeadsUpdated);
    
    return () => {
      window.removeEventListener('leadsUpdated', handleLeadsUpdated);
      window.removeEventListener('newLeadCreated', handleLeadsUpdated);
    };
  }, []);

  // Auto-refresh dashboard every 60 seconds for real-time updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only auto-refresh if page is visible
      if (document.visibilityState === 'visible') {
        console.log('🔄 Auto-refreshing CRM dashboard...');
        fetchCrmData();
      }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Debug: Log complete stats state before rendering
  console.log('🔍 ===== CRM Dashboard RENDER =====');
  console.log('🔍 Complete stats state:', JSON.stringify(stats, null, 2));
  console.log('🔍 Stats breakdown:', {
    'stats.leads': stats.leads,
    'stats.leads.total': stats.leads?.total,
    'stats.users': stats.users,
    'stats.users.total': stats.users?.total,
    'stats.colleges': stats.colleges,
    'stats.colleges.total': stats.colleges?.total,
    'stats.trainers': stats.trainers,
    'stats.trainers.total': stats.trainers?.total,
    'loading': loading,
    'error': error
  });
  console.log('🔍 ===== END RENDER DEBUG =====');

  return (
    <div className="purple-theme crm-dashboard space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-purple-600 mt-2">Overview of leads, colleges, trainers, and sales team</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchCrmData}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setShowStagesDashboard(!showStagesDashboard)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              showStagesDashboard
                ? 'bg-purple-700 text-white'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{showStagesDashboard ? 'Hide' : 'Show'} Stages</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/crm/leads')}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Lead Stages Dashboard */}
      {showStagesDashboard && (
        <div className="mb-6">
          <LeadStagesDashboard />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
            <button 
              onClick={fetchCrmData}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          {(() => {
            console.log('🔍 RENDERING Total Leads Card - stats.leads:', stats.leads, 'total:', stats.leads?.total);
            return null;
          })()}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.leads?.total ?? 0}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span>+{stats.leads.new} new</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Qualified: {stats.leads.qualified}</span>
            <span>Converted: {stats.leads.converted}</span>
          </div>
        </div>

        {/* Total Sales Persons */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          {(() => {
            console.log('🔍 RENDERING Sales Persons Card - stats.users:', stats.users, 'total:', stats.users?.total);
            return null;
          })()}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sales Persons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.users?.total ?? 0}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span>{stats.users.active} active</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Active: {stats.users.active}</span>
            <span>Inactive: {stats.users.inactive}</span>
          </div>
        </div>

        {/* Total Colleges */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          {(() => {
            console.log('🔍 RENDERING Total Colleges Card - stats.colleges:', stats.colleges, 'total:', stats.colleges?.total);
            return null;
          })()}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Colleges</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.colleges?.total ?? 0}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span>{stats.colleges.active} active</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Active: {stats.colleges.active}</span>
            <span>Inactive: {stats.colleges.inactive}</span>
          </div>
        </div>

        {/* Total Trainers */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          {(() => {
            console.log('🔍 RENDERING Total Trainers Card - stats.trainers:', stats.trainers, 'total:', stats.trainers?.total);
            return null;
          })()}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trainers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.trainers?.total ?? 0}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span>{stats.trainers.available} available</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Available: {stats.trainers.available}</span>
            <span>Busy: {stats.trainers.busy}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <button 
              onClick={() => navigate('/dashboard/crm/leads')}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <div className="text-center py-4">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent leads found</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name || lead.company}</p>
                      <p className="text-sm text-gray-500">{lead.email} • {lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Sales Persons */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Team</h3>
            <button 
              onClick={() => navigate('/dashboard/users')}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <div className="text-center py-4">
                <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No sales persons found</p>
              </div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email} • {user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Colleges */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Colleges</h3>
            <button 
              onClick={() => navigate('/dashboard/crm/colleges')}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentColleges.length === 0 ? (
              <div className="text-center py-4">
                <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent colleges found</p>
              </div>
            ) : (
              recentColleges.map((college) => (
                <div key={college.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{college.name}</p>
                      <p className="text-sm text-gray-500">{college.location} • {college.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(college.status)}`}>
                      {college.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Trainers */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Trainers</h3>
            <button 
              onClick={() => navigate('/dashboard/crm/trainers')}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTrainers.length === 0 ? (
              <div className="text-center py-4">
                <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent trainers found</p>
              </div>
            ) : (
              recentTrainers.map((trainer) => (
                <div key={trainer.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{trainer.name}</p>
                      <p className="text-sm text-gray-500">{trainer.specialization?.join(', ')} • {trainer.experience} years</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainer.availability)}`}>
                      {trainer.availability}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Excel Upload Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExcelUploadWidget 
            onUploadComplete={(result) => {
              if (result.success) {
                // Refresh CRM data after successful upload
                fetchCrmData();
              }
            }} 
            compact={true} 
          />
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/dashboard/crm/leads')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Manage Leads</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard/crm/colleges')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Manage Colleges</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard/crm/trainers')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Manage Trainers</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard/users')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Manage Sales Team</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
