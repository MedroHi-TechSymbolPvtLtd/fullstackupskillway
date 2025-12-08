import axios from 'axios';

import { API_BASE_URL as BASE_URL } from '../../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1`;

// Create axios instance with auth interceptor
const leadsApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
leadsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('upskillway_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details for debugging
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
leadsApi.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error responses for debugging
    console.log('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('access_token');
      localStorage.removeItem('upskillway_access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const leadsApiService = {
  // Get all leads with pagination and filters
  getAllLeads: async (params = {}) => {
    const response = await leadsApi.get('/leads', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get lead by ID
  getLeadById: async (id) => {
    const response = await leadsApi.get(`/leads/${id}`);
    return response.data;
  },

  // Create new lead
  createLead: async (leadData) => {
    const response = await leadsApi.post('/leads', leadData);
    return response.data;
  },

  // Update existing lead
  updateLead: async (id, leadData) => {
    const response = await leadsApi.put(`/leads/${id}`, leadData);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await leadsApi.delete(`/leads/${id}`);
    return response.data;
  },

  // CRM Lead Workflow APIs
  // Get leads by stage
  getLeadsByStage: async (stage, params = {}) => {
    const response = await leadsApi.get(`/crm/leads/stage/${stage}`, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },


  // Get lead activities
  getLeadActivities: async (id, params = {}) => {
    const response = await leadsApi.get(`/crm/leads/${id}/activities`, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get funnel statistics
  getFunnelStats: async () => {
    const response = await leadsApi.get('/crm/leads/funnel/stats', {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },

  // Update lead status
  updateLeadStatus: async (leadId, statusData) => {
    const response = await leadsApi.patch(`/leads/${leadId}/status`, statusData);
    return response.data;
  },

  // Dashboard endpoints
  // Get leads grouped by dashboard stages
  getLeadsByStages: async () => {
    const response = await leadsApi.get('/dashboard/leads-by-stages', {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },

  // Get converted leads with colleges
  getConvertedLeads: async (params = {}) => {
    const response = await leadsApi.get('/dashboard/converted-leads', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await leadsApi.get('/dashboard/stats', {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },

  // Get dashboard activities
  getDashboardActivities: async (params = {}) => {
    const response = await leadsApi.get('/dashboard/activities', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get lead funnel data
  getLeadFunnel: async () => {
    const response = await leadsApi.get('/dashboard/funnel', {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },

  // Get monthly trends
  getMonthlyTrends: async (params = {}) => {
    const response = await leadsApi.get('/dashboard/trends', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get performance metrics
  getPerformanceMetrics: async () => {
    const response = await leadsApi.get('/dashboard/metrics', {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },
};

export default leadsApiService;