// Testimonial API Service
import { API_BASE_URL as BASE_URL } from '../../../utils/constants';
import httpClient from '../../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class TestimonialService {
  // Verify if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    return !!token;
  }

  // Get auth token from multiple sources
  getAuthToken() {
    console.log('TestimonialService: Attempting to retrieve auth token...');
    
    // Check localStorage directly
    const directToken = localStorage.getItem('access_token');
    const authUtilsToken = localStorage.getItem('upskillway_access_token');
    
    console.log('TestimonialService: Token check results:', {
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
        console.log(`TestimonialService: Found auth token from source ${i + 1}:`, `${token.substring(0, 20)}...`);
        return token;
      }
    }

    console.error('TestimonialService: No auth token found in any source');
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
      console.log('TestimonialService: Using authenticated headers');
    } else if (requireAuth) {
      console.error('TestimonialService: No authentication token available');
      throw new Error('Authentication required. Please log in again.');
    } else {
      console.log('TestimonialService: Using non-authenticated headers');
    }

    return headers;
  }

  // Get basic headers without authentication
  getBasicHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Create a new testimonial
  async createTestimonial(testimonialData) {
    try {
      console.log('TestimonialService: Creating testimonial with data:', testimonialData);
      
      const headers = this.getAuthHeaders(true); // Require auth for create
      console.log('TestimonialService: Using headers:', { ...headers, Authorization: 'Bearer [HIDDEN]' });
      
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testimonialData)
      });

      console.log('TestimonialService: Create testimonial response status:', response.status);
      
      const result = await response.json();
      console.log('TestimonialService: Create testimonial response data:', result);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(result.message || `Failed to create testimonial (${response.status})`);
      }

      return result;
    } catch (error) {
      console.error('TestimonialService: Create testimonial error:', error);
      
      // If it's a network error, provide a more helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Get all testimonials with pagination and filters (no auth required)
  async getTestimonials(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search })
      });

      console.log('TestimonialService: Fetching testimonials with params:', params);
      console.log('TestimonialService: Query string:', queryParams.toString());

      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/testimonials?${queryParams.toString()}`, { headers });
      return res.data;
    } catch (error) {
      console.error('TestimonialService: Get testimonials error:', error);
      throw error;
    }
  }

  // Get testimonial by ID (no auth required)
  async getTestimonialById(id) {
    try {
      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/testimonials/${id}`, { headers });
      return res.data;
    } catch (error) {
      console.error('TestimonialService: Get testimonial by ID error:', error);
      throw error;
    }
  }

  // Update testimonial
  async updateTestimonial(id, testimonialData) {
    try {
      const res = await httpClient.put(`/api/v1/cms/testimonials/${id}`, testimonialData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('TestimonialService: Update testimonial error:', error);
      throw error;
    }
  }

  // Delete testimonial
  async deleteTestimonial(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/testimonials/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('TestimonialService: Delete testimonial error:', error);
      throw error;
    }
  }
}

export default new TestimonialService();