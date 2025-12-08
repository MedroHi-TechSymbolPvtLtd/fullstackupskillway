/**
 * API Utility
 * Centralized API call handler with error handling and configuration
 */

import config from '../config/env';

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseURL: config.apiBaseUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Parse response
    const data = await response.json();
    
    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
};

/**
 * API methods
 */
export const api = {
  /**
   * GET request
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'GET',
    });
  },

  /**
   * POST request
   */
  post: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   */
  patch: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};

/**
 * API endpoints
 * Centralized endpoint definitions
 */
export const endpoints = {
  // CMS endpoints
  cms: {
    videos: '/cms/videos',
    courses: '/cms/courses',
    blogs: '/cms/blogs',
    ebooks: '/cms/ebooks',
    studyAbroad: '/cms/study-abroad',
    trainingPrograms: '/cms/training-programs',
  },
  
  // Lead endpoints
  leads: '/leads',
  
  // Demo request endpoints
  demoRequest: '/demo-request',
  
  // Refer endpoints
  refer: {
    partners: '/refer/partners',
  },
};

export default api;
