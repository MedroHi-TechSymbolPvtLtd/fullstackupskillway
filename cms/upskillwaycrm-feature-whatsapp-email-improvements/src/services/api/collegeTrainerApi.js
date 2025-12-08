import axios from 'axios';

import { API_BASE_URL as BASE_URL } from '../../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1`;

// Create axios instance with auth interceptor
const collegeTrainerApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
collegeTrainerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('upskillway_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details for debugging
    console.log('College Trainer API Request:', {
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
collegeTrainerApi.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('College Trainer API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error responses for debugging
    console.log('College Trainer API Response Error:', {
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

export default {
  // Get available trainers for assignment
  getAvailableTrainers: async (params = {}) => {
    const response = await collegeTrainerApi.get('/college-trainers/available', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Assign trainer to college
  assignTrainerToCollege: async (collegeId, assignmentData) => {
    const response = await collegeTrainerApi.post(`/college-trainers/college/${collegeId}`, assignmentData);
    return response.data;
  },

  // Unassign trainer from college
  unassignTrainerFromCollege: async (collegeId, unassignmentData = {}) => {
    const response = await collegeTrainerApi.delete(`/college-trainers/college/${collegeId}`, {
      data: unassignmentData
    });
    return response.data;
  },

  // Get college with assigned trainer details
  getCollegeWithTrainer: async (collegeId) => {
    const response = await collegeTrainerApi.get(`/college-trainers/college/${collegeId}`);
    return response.data;
  },

  // Get all college trainer assignments
  getCollegeTrainerAssignments: async (params = {}) => {
    const response = await collegeTrainerApi.get('/college-trainers/assignments', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get trainer's assigned colleges
  getTrainerAssignedColleges: async (trainerId, params = {}) => {
    const response = await collegeTrainerApi.get(`/college-trainers/trainer/${trainerId}/colleges`, { params });
    return response.data;
  },

  // Get college's trainer assignment history
  getCollegeTrainerHistory: async (collegeId, params = {}) => {
    const response = await collegeTrainerApi.get(`/college-trainers/college/${collegeId}/history`, { params });
    return response.data;
  },

  // Get trainer assignment statistics
  getTrainerAssignmentStats: async () => {
    const response = await collegeTrainerApi.get('/college-trainers/stats');
    return response.data;
  },
};
