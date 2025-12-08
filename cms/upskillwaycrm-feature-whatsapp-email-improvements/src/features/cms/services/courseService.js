/**
 * Course Service
 * 
 * This service handles all API operations for course management.
 * Features include:
 * - Complete CRUD operations (Create, Read, Update, Delete)
 * - Authentication handling with token management
 * - Multi-source token retrieval (localStorage, sessionStorage, cookies)
 * - Error handling and logging
 * - Support for both authenticated and non-authenticated requests
 * - Course validation and data formatting
 * - Bulk operations support
 */

// API base URL configuration
import { API_BASE_URL as BASE_URL } from '../../../utils/constants';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || BASE_URL;
const COURSE_ENDPOINT = `${API_BASE_URL}/api/v1/cms/courses`;

/**
 * Course Service Class
 * Handles all course-related API operations
 */
class CourseService {
  /**
   * Get authentication token from multiple sources
   * Uses the same token sources as the working blog service
   * @returns {string|null} Authentication token or null if not found
   */
  getAuthToken() {
    // Try multiple sources for the token (same as blogService)
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
        console.log('CourseService: Found auth token from source');
        return token;
      }
    }

    console.warn('CourseService: No auth token found in any source');
    return null;
  }

  /**
   * Get authentication headers (matches blogService pattern)
   * @param {boolean} requireAuth - Whether authentication is required
   * @returns {Object} Request headers object
   */
  getAuthHeaders(requireAuth = true) {
    const token = this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('CourseService: Using authenticated headers');
    } else if (requireAuth) {
      console.error('CourseService: No authentication token available');
      throw new Error('Authentication required. Please log in again.');
    } else {
      console.log('CourseService: Using non-authenticated headers');
    }

    return headers;
  }

  /**
   * Handle API response and extract data
   * @param {Response} response - Fetch API response object
   * @returns {Object} Parsed response data
   * @throws {Error} If response is not successful
   */
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  /**
   * Check if user is authenticated by verifying token existence
   * @returns {boolean} True if user has valid token, false otherwise
   */
  isAuthenticated() {
    const token = this.getAuthToken();
    return !!token;
  }

  /**
   * Get all courses with pagination support
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search query (optional)
   * @param {string} params.status - Filter by status (optional)
   * @returns {Promise<Object>} API response with courses array and pagination info
   */
  async getCourses(params = {}) {
    try {
      const { page = 1, limit = 10, search, status } = params;
      
      // Build query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);

      const url = `${COURSE_ENDPOINT}?${queryParams}`;
      console.log('Fetching courses from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(false), // Public endpoint, no auth required
      });

      const data = await this.handleResponse(response);
      console.log('Courses fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  /**
   * Get a single course by ID
   * @param {string} id - Course ID
   * @returns {Promise<Object>} API response with course data
   */
  async getCourse(id) {
    try {
      console.log('Fetching course with ID:', id);

      const response = await fetch(`${COURSE_ENDPOINT}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(false), // Public endpoint, no auth required
      });

      const data = await this.handleResponse(response);
      console.log('Course fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  /**
   * Create a new course
   * @param {Object} courseData - Course data to create
   * @param {string} courseData.title - Course title
   * @param {string} courseData.slug - URL slug
   * @param {string} courseData.description - Course description
   * @param {string} courseData.syllabus - Course syllabus content
   * @param {string} courseData.videoDemoUrl - Demo video URL (optional)
   * @param {Array<string>} courseData.tags - Array of tags
   * @param {number} courseData.price - Course price
   * @param {string} courseData.status - Publication status
   * @returns {Promise<Object>} API response with created course data
   */
  async createCourse(courseData) {
    try {
      console.log('Creating course:', courseData);

      const response = await fetch(COURSE_ENDPOINT, {
        method: 'POST',
        headers: this.getAuthHeaders(true), // Requires authentication
        body: JSON.stringify(courseData),
      });

      const data = await this.handleResponse(response);
      console.log('Course created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Update an existing course
   * @param {string} id - Course ID to update
   * @param {Object} courseData - Updated course data
   * @returns {Promise<Object>} API response with updated course data
   */
  async updateCourse(id, courseData) {
    try {
      console.log('Updating course:', id, courseData);

      const response = await fetch(`${COURSE_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(true), // Requires authentication
        body: JSON.stringify(courseData),
      });

      const data = await this.handleResponse(response);
      console.log('Course updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Delete a course
   * @param {string} id - Course ID to delete
   * @returns {Promise<Object>} API response confirming deletion
   */
  async deleteCourse(id) {
    try {
      console.log('Deleting course:', id);

      const response = await fetch(`${COURSE_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(true), // Requires authentication
      });

      const data = await this.handleResponse(response);
      console.log('Course deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  /**
   * Bulk delete multiple courses
   * @param {Array<string>} ids - Array of course IDs to delete
   * @returns {Promise<Array>} Array of deletion results
   */
  async bulkDeleteCourses(ids) {
    try {
      console.log('Bulk deleting courses:', ids);

      const deletePromises = ids.map(id => this.deleteCourse(id));
      const results = await Promise.allSettled(deletePromises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      console.log(`Bulk delete completed: ${successful} successful, ${failed} failed`);
      return results;
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  }

  /**
   * Generate URL slug from title
   * @param {string} title - Course title
   * @returns {string} URL-friendly slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Validate course data before submission
   * @param {Object} courseData - Course data to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateCourse(courseData) {
    const errors = [];

    // Required field validation
    if (!courseData.title?.trim()) {
      errors.push('Title is required');
    }

    if (!courseData.description?.trim()) {
      errors.push('Description is required');
    }

    if (!courseData.syllabus?.trim()) {
      errors.push('Syllabus is required');
    }

    // Price validation
    if (courseData.price !== undefined && courseData.price !== null) {
      const price = parseFloat(courseData.price);
      if (isNaN(price) || price < 0) {
        errors.push('Price must be a valid number greater than or equal to 0');
      }
    }

    // URL validation for demo video
    if (courseData.videoDemoUrl && courseData.videoDemoUrl.trim()) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(courseData.videoDemoUrl)) {
        errors.push('Video demo URL must be a valid HTTP/HTTPS URL');
      }
    }

    // Status validation
    const validStatuses = ['draft', 'published', 'archived'];
    if (courseData.status && !validStatuses.includes(courseData.status)) {
      errors.push('Status must be one of: draft, published, archived');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format price for display
   * @param {string|number} price - Course price
   * @returns {string} Formatted price with currency symbol
   */
  formatPrice(price) {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'Free' : `$${numPrice.toFixed(2)}`;
  }

  /**
   * Search courses by title or description
   * @param {string} query - Search query
   * @param {Object} options - Additional search options
   * @returns {Promise<Object>} Search results
   */
  async searchCourses(query, options = {}) {
    return this.getCourses({
      search: query,
      ...options
    });
  }

  /**
   * Get courses by status
   * @param {string} status - Course status to filter by
   * @param {Object} options - Additional filter options
   * @returns {Promise<Object>} Filtered courses
   */
  async getCoursesByStatus(status, options = {}) {
    return this.getCourses({
      status: status,
      ...options
    });
  }
}

// Export singleton instance
const courseService = new CourseService();
export default courseService;