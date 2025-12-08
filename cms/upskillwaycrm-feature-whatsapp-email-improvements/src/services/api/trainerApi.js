import axios from 'axios';

import { API_BASE_URL as BASE_URL } from '../../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1`;

// Create axios instance with auth interceptor
const trainerApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
trainerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('upskillway_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details for debugging
    console.log('Trainer API Request:', {
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
trainerApi.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('Trainer API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error responses for debugging
    console.log('Trainer API Response Error:', {
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
  // Get all trainers with pagination and filters
  getAllTrainers: async (params = {}) => {
    const response = await trainerApi.get('/trainers', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get trainer by ID
  getTrainerById: async (id) => {
    const response = await trainerApi.get(`/trainers/${id}`);
    return response.data;
  },

  // Create new trainer
  createTrainer: async (trainerData) => {
    const response = await trainerApi.post('/trainers', trainerData);
    return response.data;
  },

  // Update existing trainer
  updateTrainer: async (id, trainerData) => {
    const response = await trainerApi.put(`/trainers/${id}`, trainerData);
    return response.data;
  },

  // Delete trainer
  deleteTrainer: async (id) => {
    const response = await trainerApi.delete(`/trainers/${id}`);
    return response.data;
  },

  // Update trainer status
  updateTrainerStatus: async (id, statusData) => {
    const response = await trainerApi.patch(`/trainers/${id}/status`, statusData);
    return response.data;
  },

  // Get trainer statistics
  getTrainerStats: async () => {
    const response = await trainerApi.get('/trainers/stats', {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },

  // Search trainers
  searchTrainers: async (query, params = {}) => {
    const response = await trainerApi.get('/trainers/search', { 
      params: { 
        q: query, 
        ...params,
        _t: Date.now() // Cache buster
      } 
    });
    return response.data;
  },

  // Get trainers by specialization
  getTrainersBySpecialization: async (specialization, params = {}) => {
    const response = await trainerApi.get(`/trainers/specialization/${specialization}`, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get available trainers
  getAvailableTrainers: async (params = {}) => {
    const response = await trainerApi.get('/trainers/available', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Update trainer availability
  updateTrainerAvailability: async (trainerId, availabilityData) => {
    const response = await trainerApi.patch(`/trainers/${trainerId}/availability`, availabilityData);
    return response.data;
  },

  // Update trainer status (for booking management)
  updateTrainerBookingStatus: async (trainerId, statusData) => {
    const response = await trainerApi.patch(`/trainer-bookings/trainer/${trainerId}/status`, statusData);
    return response.data;
  },

  // Set comprehensive trainer availability with slots and recurring patterns
  setTrainerAvailability: async (availabilityData) => {
    const response = await trainerApi.post('/trainer-bookings/availability/set', availabilityData);
    return response.data;
  },
};
