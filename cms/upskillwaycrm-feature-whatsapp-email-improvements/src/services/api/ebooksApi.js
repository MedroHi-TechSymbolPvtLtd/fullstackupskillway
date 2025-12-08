import axios from 'axios';

import { API_BASE_URL as BASE_URL } from '../../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

// Create axios instance with auth interceptor
const ebooksApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
ebooksApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('upskillway_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
ebooksApi.interceptors.response.use(
  (response) => response,
  (error) => {
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
  // Get all ebooks with pagination and filters
  getAllEbooks: async (params = {}) => {
    const response = await ebooksApi.get('/ebooks', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get ebook by ID
  getEbookById: async (id) => {
    const response = await ebooksApi.get(`/ebooks/${id}`);
    return response.data;
  },

  // Create new ebook
  createEbook: async (ebookData) => {
    const response = await ebooksApi.post('/ebooks', ebookData);
    return response.data;
  },

  // Update existing ebook
  updateEbook: async (id, ebookData) => {
    const response = await ebooksApi.put(`/ebooks/${id}`, ebookData);
    return response.data;
  },

  // Delete ebook
  deleteEbook: async (id) => {
    const response = await ebooksApi.delete(`/ebooks/${id}`);
    return response.data;
  },
};