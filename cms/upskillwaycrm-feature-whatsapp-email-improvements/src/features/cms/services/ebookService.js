/**
 * Ebook Service
 * 
 * This service handles all API operations for ebook management.
 * Features include:
 * - Complete CRUD operations (Create, Read, Update, Delete)
 * - Authentication handling with token management
 * - Multi-source token retrieval (localStorage, sessionStorage, cookies)
 * - Error handling and logging
 * - Support for both authenticated and non-authenticated requests
 */

// API base URL configuration - matches blogService exactly
import { API_BASE_URL as BASE_URL } from '../../../utils/constants';
import httpClient from '../../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

/**
 * Ebook Service Class
 * Handles all ebook-related API operations
 */
class EbookService {
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
        console.log('EbookService: Found auth token from source');
        return token;
      }
    }

    console.warn('EbookService: No auth token found in any source');
    return null;
  }

  /**
   * Get authentication headers (matches blogService pattern exactly)
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
      console.log('EbookService: Using authenticated headers');
    } else if (requireAuth) {
      console.error('EbookService: No authentication token available');
      throw new Error('Authentication required. Please log in again.');
    } else {
      console.log('EbookService: Using non-authenticated headers');
    }

    return headers;
  }

  /**
   * Get basic headers without authentication (matches blogService)
   * @returns {Object} Basic request headers
   */
  getBasicHeaders() {
    return {
      'Content-Type': 'application/json'
    };
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
   * Get all ebooks with pagination support (matches blogService pattern exactly)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search query (optional)
   * @param {string} params.status - Filter by status (optional)
   * @returns {Promise<Object>} API response with ebooks array and pagination info
   */
  async getEbooks(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search })
      });

      console.log('Fetching ebooks with params:', params);
      console.log('Query string:', queryParams.toString());

      // Try with authentication first, fallback to no auth (matches blogService)
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/ebooks?${queryParams.toString()}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get ebooks error:', error);
      throw error;
    }
  }

  /**
   * Get a single ebook by ID (matches blogService pattern)
   * @param {string} id - Ebook ID
   * @returns {Promise<Object>} API response with ebook data
   */
  async getEbookById(id) {
    try {
      // Try with authentication first, fallback to no auth (matches blogService)
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/ebooks/${id}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get ebook by ID error:', error);
      throw error;
    }
  }

  /**
   * Create a new ebook (matches blogService pattern exactly)
   * @param {Object} ebookData - Ebook data to create
   * @param {string} ebookData.title - Ebook title
   * @param {string} ebookData.slug - URL slug
   * @param {string} ebookData.description - Ebook description
   * @param {string} ebookData.coverImageUrl - Cover image URL
   * @param {string} ebookData.pdfUrl - PDF file URL
   * @param {string} ebookData.videoUrl - Video URL (optional)
   * @param {Array<string>} ebookData.tags - Array of tags
   * @param {string} ebookData.status - Publication status
   * @returns {Promise<Object>} API response with created ebook data
   */
  async createEbook(ebookData) {
    try {
      console.log('Creating ebook with data:', ebookData);
      
      const headers = this.getAuthHeaders(true); // Require auth for create
      console.log('Using headers:', { ...headers, Authorization: 'Bearer [HIDDEN]' });
      
      const res = await httpClient.post('/api/v1/cms/ebooks', ebookData, { headers });
      return res.data;
    } catch (error) {
      console.error('Create ebook error:', error);
      
      // If it's a network error, provide a more helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  /**
   * Update an existing ebook (matches blogService pattern)
   * @param {string} id - Ebook ID to update
   * @param {Object} ebookData - Updated ebook data
   * @returns {Promise<Object>} API response with updated ebook data
   */
  async updateEbook(id, ebookData) {
    try {
      const res = await httpClient.put(`/api/v1/cms/ebooks/${id}`, ebookData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Update ebook error:', error);
      throw error;
    }
  }

  /**
   * Delete an ebook (matches blogService pattern)
   * @param {string} id - Ebook ID to delete
   * @returns {Promise<Object>} API response confirming deletion
   */
  async deleteEbook(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/ebooks/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Delete ebook error:', error);
      throw error;
    }
  }

  /**
   * Bulk delete multiple ebooks
   * @param {Array<string>} ids - Array of ebook IDs to delete
   * @returns {Promise<Array>} Array of deletion results
   */
  async bulkDeleteEbooks(ids) {
    try {
      console.log('Bulk deleting ebooks:', ids);

      const deletePromises = ids.map(id => this.deleteEbook(id));
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
   * @param {string} title - Ebook title
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
   * Validate ebook data before submission
   * @param {Object} ebookData - Ebook data to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateEbook(ebookData) {
    const errors = [];

    // Required field validation
    if (!ebookData.title?.trim()) {
      errors.push('Title is required');
    }

    if (!ebookData.description?.trim()) {
      errors.push('Description is required');
    }

    if (!ebookData.coverImageUrl?.trim()) {
      errors.push('Cover image URL is required');
    }

    if (!ebookData.pdfUrl?.trim()) {
      errors.push('PDF URL is required');
    }

    // URL validation
    const urlPattern = /^https?:\/\/.+/;
    
    if (ebookData.coverImageUrl && !urlPattern.test(ebookData.coverImageUrl)) {
      errors.push('Cover image URL must be a valid HTTP/HTTPS URL');
    }

    if (ebookData.pdfUrl && !urlPattern.test(ebookData.pdfUrl)) {
      errors.push('PDF URL must be a valid HTTP/HTTPS URL');
    }

    if (ebookData.videoUrl && ebookData.videoUrl.trim() && !urlPattern.test(ebookData.videoUrl)) {
      errors.push('Video URL must be a valid HTTP/HTTPS URL');
    }

    // Status validation
    const validStatuses = ['draft', 'published', 'archived'];
    if (ebookData.status && !validStatuses.includes(ebookData.status)) {
      errors.push('Status must be one of: draft, published, archived');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
const ebookService = new EbookService();
export default ebookService;