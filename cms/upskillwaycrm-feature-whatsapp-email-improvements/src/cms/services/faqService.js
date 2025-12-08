// FAQ API Service
import { API_BASE_URL as BASE_URL } from '../../utils/constants';
import httpClient from '../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class FaqService {
  // Verify if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    return !!token;
  }

  // Get auth token from multiple sources
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

  // Get auth headers for authenticated requests
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

  // Get basic headers without authentication
  getBasicHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Create a new FAQ
  async createFaq(faqData) {
    try {
      console.log('Creating FAQ with data:', faqData);
      
      const headers = this.getAuthHeaders(true); // Require auth for create
      console.log('Using headers:', { ...headers, Authorization: 'Bearer [HIDDEN]' });
      
      const res = await httpClient.post('/api/v1/cms/faqs', faqData, { headers });
      return res.data;
    } catch (error) {
      console.error('Create FAQ error:', error);
      
      // If it's a network error, provide a more helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Get all FAQs with pagination and filters (no auth required)
  async getFaqs(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.category && { category: params.category }),
        ...(params.search && { search: params.search })
      });

      console.log('Fetching FAQs with params:', params);
      console.log('Query string:', queryParams.toString());

      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/faqs?${queryParams.toString()}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get FAQs error:', error);
      throw error;
    }
  }

  // Get FAQ by ID (no auth required)
  async getFaqById(id) {
    try {
      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/faqs/${id}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get FAQ by ID error:', error);
      throw error;
    }
  }

  // Update FAQ
  async updateFaq(id, faqData) {
    try {
      const res = await httpClient.put(`/api/v1/cms/faqs/${id}`, faqData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Update FAQ error:', error);
      throw error;
    }
  }

  // Delete FAQ
  async deleteFaq(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/faqs/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Delete FAQ error:', error);
      throw error;
    }
  }
}

export default new FaqService();