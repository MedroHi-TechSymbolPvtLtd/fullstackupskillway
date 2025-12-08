/**
 * Course Service
 * 
 * This service handles all course-related API operations.
 * It provides methods for CRUD operations on courses and integrates with the backend API.
 * 
 * Features:
 * - Get all courses with pagination and filtering
 * - Get single course by ID
 * - Create new course
 * - Update existing course
 * - Delete course
 * - Proper error handling and logging
 * - Token-based authentication
 * 
 * API Endpoints:
 * - GET /api/v1/cms/courses - List courses
 * - GET /api/v1/cms/courses/:id - Get course by ID
 * - POST /api/v1/cms/courses - Create course
 * - PUT /api/v1/cms/courses/:id - Update course
 * - DELETE /api/v1/cms/courses/:id - Delete course
 * 
 * @class CourseService
 * @example
 * // Get all courses
 * const courses = await courseService.getCourses({ page: 1, limit: 10 });
 * 
 * // Create a new course
 * const newCourse = await courseService.createCourse({
 *   title: "Web Development Bootcamp",
 *   description: "Learn full-stack development",
 *   price: 299.99
 * });
 */

import { API_BASE_URL as BASE_URL } from '../../utils/constants';
import httpClient from '../../services/utils/httpClient';

// API base URL (env override then constants fallback)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

/**
 * Course Service Class
 * Contains all course-related API methods with proper authentication
 */
class CourseService {
  /**
   * Verify if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = this.getAuthToken();
    return !!token;
  }
  /**
   * Get auth token from multiple sources (matching blog service pattern)
   * @returns {string|null} Authentication token
   */
  getAuthToken() {
    // Try multiple sources for the token
    const sources = [
      () => localStorage.getItem('access_token'), // Direct access_token
      () => localStorage.getItem('upskillway_access_token'), // AuthUtils token
      () => {
        // Try to get from cookies
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => 
          cookie.trim().startsWith('upskillway_access_token=')
        );
        return tokenCookie ? tokenCookie.split('=')[1] : null;
      }
    ];

    for (const getToken of sources) {
      const token = getToken();
      if (token) {
        console.log('Found auth token from source');
        return token;
      }
    }

    console.warn('No auth token found in any source');
    return null;
  }

  /**
   * Get auth headers for authenticated requests
   * @param {boolean} requireAuth - Whether authentication is required
   * @returns {Object} Headers object with authentication
   */
  getAuthHeaders(requireAuth = false) {
    const token = this.getAuthToken();
    
    if (requireAuth && !token) {
      throw new Error('Authentication required but no token found');
    }
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Get basic headers without authentication
   * @returns {Object} Basic headers object
   */
  getBasicHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }
  /**
   * Get all courses with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search term (optional)
   * @param {string} params.status - Status filter (optional)
   * @returns {Promise<Object>} API response with courses data and pagination
   */
  async getCourses(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search })
      });

      console.log('Fetching courses with params:', params);
      console.log('Query string:', queryParams.toString());

      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/courses?${queryParams.toString()}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  }

  /**
   * Get course by ID (no auth required)
   * @param {string} id - Course ID
   * @returns {Promise<Object>} API response with course data
   */
  async getCourseById(id) {
    try {
      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/courses/${id}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get course by ID error:', error);
      throw error;
    }
  }

  /**
   * Create a new course
   * @param {Object} courseData - Course data object
   * @returns {Promise<Object>} API response with created course data
   */
  async createCourse(courseData) {
    try {
      console.log('Creating course with data:', courseData);
      
      const headers = this.getAuthHeaders(true); // Require auth for create
      console.log('Using headers:', { ...headers, Authorization: 'Bearer [HIDDEN]' });
      
      const res = await httpClient.post(`/api/v1/cms/courses`, courseData, { headers });
      return res.data;
    } catch (error) {
      console.error('Create course error:', error);
      
      // If it's a network error, provide a more helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  /**
   * Update course
   * @param {string} id - Course ID to update
   * @param {Object} courseData - Updated course data
   * @returns {Promise<Object>} API response with updated course data
   */
  async updateCourse(id, courseData) {
    try {
      const res = await httpClient.put(`/api/v1/cms/courses/${id}`, courseData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  }

  /**
   * Delete course
   * @param {string} id - Course ID to delete
   * @returns {Promise<Object>} API response confirming deletion
   */
  async deleteCourse(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/courses/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  }
}

export default new CourseService();