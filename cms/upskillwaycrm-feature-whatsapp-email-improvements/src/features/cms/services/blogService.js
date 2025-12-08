// Blog API Service
import { API_BASE_URL as BASE_URL } from '../../../utils/constants';
import httpClient from '../../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class BlogService {
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

  // Get auth headers (optional authentication)
  getAuthHeaders(requireAuth = true) {
    const token = this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('Using authenticated headers');
    } else if (requireAuth) {
      console.error('No authentication token available');
      throw new Error('Authentication required. Please log in again.');
    } else {
      console.log('Using non-authenticated headers');
    }

    return headers;
  }

  // Get basic headers without authentication
  getBasicHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Create a new blog post
  async createBlog(blogData) {
    try {
      console.log('Creating blog with data:', blogData);
      
      const headers = this.getAuthHeaders(true); // Require auth for create
      console.log('Using headers:', { ...headers, Authorization: 'Bearer [HIDDEN]' });
      
      const res = await httpClient.post('/api/v1/cms/blogs', blogData, { headers });
      const result = res.data;
      return result;
    } catch (error) {
      console.error('Create blog error:', error);
      
      // If it's a network error, provide a more helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Get all blogs with pagination and filters (no auth required)
  async getBlogs(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search })
      });

      console.log('Fetching blogs with params:', params);
      console.log('Query string:', queryParams.toString());

      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/blogs?${queryParams.toString()}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get blogs error:', error);
      throw error;
    }
  }

  // Get blog by ID (no auth required)
  async getBlogById(id) {
    try {
      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/blogs/${id}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get blog by ID error:', error);
      throw error;
    }
  }

  // Update blog
  async updateBlog(id, blogData) {
    try {
      const res = await httpClient.put(`/api/v1/cms/blogs/${id}`, blogData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Update blog error:', error);
      throw error;
    }
  }

  // Delete blog
  async deleteBlog(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/blogs/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Delete blog error:', error);
      throw error;
    }
  }
}

export default new BlogService();