import axios from 'axios';

// Use VITE_API_BASE_URL if provided, otherwise fallback to production API (cms path)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/cms` : 'https://65.1.251.7:3000/api/v1/cms');

// Create axios instance with auth interceptor
const blogsApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
blogsApi.interceptors.request.use(
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
blogsApi.interceptors.response.use(
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
  // Get all blogs with pagination and filters
  getAllBlogs: async (params = {}) => {
    const response = await blogsApi.get('/blogs', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id) => {
    const response = await blogsApi.get(`/blogs/${id}`);
    return response.data;
  },

  // Create new blog
  createBlog: async (blogData) => {
    const response = await blogsApi.post('/blogs', blogData);
    return response.data;
  },

  // Update existing blog
  updateBlog: async (id, blogData) => {
    const response = await blogsApi.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await blogsApi.delete(`/blogs/${id}`);
    return response.data;
  },
};