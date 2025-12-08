import axios from 'axios';

// Use VITE_API_BASE_URL if provided, otherwise fallback to production API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://65.1.251.7:3000/api/v1';

const usersApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
usersApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('upskillway_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
usersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('upskillway_access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAllUsers: async (params = {}) => {
    // Add cache busting parameter to force fresh data
    const response = await usersApi.get('/users', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} API response
   */
  getUserById: async (id) => {
    // Add cache busting parameter to force fresh data
    const response = await usersApi.get(`/users/${id}`, {
      params: { _t: Date.now() }
    });
    return response.data;
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise} API response
   */
  createUser: async (userData) => {
    const response = await usersApi.post('/users', userData);
    return response.data;
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response
   */
  updateUser: async (id, userData) => {
    const response = await usersApi.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Activate user
   * @param {string} id - User ID
   * @returns {Promise} API response
   */
  activateUser: async (id) => {
    const response = await usersApi.patch(`/users/${id}/activate`);
    return response.data;
  },

  /**
   * Deactivate user
   * @param {string} id - User ID
   * @returns {Promise} API response
   */
  deactivateUser: async (id) => {
    const response = await usersApi.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise} API response
   */
  deleteUser: async (id) => {
    const response = await usersApi.delete(`/users/${id}`);
    return response.data;
  },
};