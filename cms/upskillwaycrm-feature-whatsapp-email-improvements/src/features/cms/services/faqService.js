// FAQ API Service
import { API_BASE_URL as BASE_URL } from '../../../utils/constants';
import httpClient from '../../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class FaqService {
  // Verify if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    return !!token;
  }

  // Get auth token from multiple sources
  getAuthToken() {
    console.log('FaqService: Attempting to retrieve auth token...');
    
    // Check localStorage directly
    const directToken = localStorage.getItem('access_token');
    const authUtilsToken = localStorage.getItem('upskillway_access_token');
    
    console.log('FaqService: Token check results:', {
      directToken: directToken ? `${directToken.substring(0, 20)}...` : 'Not found',
      authUtilsToken: authUtilsToken ? `${authUtilsToken.substring(0, 20)}...` : 'Not found'
    });

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

    for (let i = 0; i < sources.length; i++) {
      const token = sources[i]();
      if (token) {
        console.log(`FaqService: Found auth token from source ${i + 1}:`, `${token.substring(0, 20)}...`);
        return token;
      }
    }

    console.error('FaqService: No auth token found in any source');
    return null;
  }

  // Get auth headers (optional authentication)
  getAuthHeaders(requireAuth = true) {
    const token = this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('FaqService: Using authenticated headers');
    } else if (requireAuth) {
      console.error('FaqService: No authentication token available');
      throw new Error('Authentication required. Please log in again.');
    } else {
      console.log('FaqService: Using non-authenticated headers');
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
      console.log('FaqService: Creating FAQ with data:', faqData);
      
      const headers = this.getAuthHeaders(true); // Require auth for create
      console.log('FaqService: Using headers:', { ...headers, Authorization: 'Bearer [HIDDEN]' });
      
      const response = await fetch(`${API_BASE_URL}/faqs`, {
        method: 'POST',
        headers,
        body: JSON.stringify(faqData)
      });

      console.log('FaqService: Create FAQ response status:', response.status);
      
      const result = await response.json();
      console.log('FaqService: Create FAQ response data:', result);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(result.message || `Failed to create FAQ (${response.status})`);
      }

      return result;
    } catch (error) {
      console.error('FaqService: Create FAQ error:', error);
      
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

      console.log('FaqService: Fetching FAQs with params:', params);
      console.log('FaqService: Query string:', queryParams.toString());

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
      console.error('FaqService: Get FAQs error:', error);
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
      console.error('FaqService: Get FAQ by ID error:', error);
      throw error;
    }
  }

  // Update FAQ
  async updateFaq(id, faqData) {
    try {
      const res = await httpClient.put(`/api/v1/cms/faqs/${id}`, faqData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('FaqService: Update FAQ error:', error);
      throw error;
    }
  }

  // Delete FAQ
  async deleteFaq(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/faqs/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('FaqService: Delete FAQ error:', error);
      throw error;
    }
  }
}

export default new FaqService();