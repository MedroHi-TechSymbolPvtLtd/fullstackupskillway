// Video API Service
import { API_BASE_URL as BASE_URL } from '../../../utils/constants';
import httpClient from '../../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class VideoService {
  // Verify if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    return !!token;
  }

  // Get auth token from multiple sources
  getAuthToken() {
    console.log('VideoService: Attempting to retrieve auth token...');
    
    // Check localStorage directly
    const directToken = localStorage.getItem('access_token');
    const authUtilsToken = localStorage.getItem('upskillway_access_token');
    
    console.log('VideoService: Token check results:', {
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
        console.log(`VideoService: Found auth token from source ${i + 1}:`, `${token.substring(0, 20)}...`);
        return token;
      }
    }

    console.error('VideoService: No auth token found in any source');
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
      console.log('VideoService: Using authenticated headers');
    } else if (requireAuth) {
      console.error('VideoService: No authentication token available');
      throw new Error('Authentication required. Please log in again.');
    } else {
      console.log('VideoService: Using non-authenticated headers');
    }

    return headers;
  }

  // Get basic headers without authentication
  getBasicHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // Create a new video
  async createVideo(videoData) {
    try {
      console.log('VideoService: Creating video with data:', videoData);
      
      const headers = this.getAuthHeaders(true); // Require auth for create
      console.log('VideoService: Using headers:', { ...headers, Authorization: 'Bearer [HIDDEN]' });
      
      const response = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(videoData)
      });

      console.log('VideoService: Create video response status:', response.status);
      
      const result = await response.json();
      console.log('VideoService: Create video response data:', result);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(result.message || `Failed to create video (${response.status})`);
      }

      return result;
    } catch (error) {
      console.error('VideoService: Create video error:', error);
      
      // If it's a network error, provide a more helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Get all videos with pagination and filters (no auth required)
  async getVideos(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search })
      });

      console.log('VideoService: Fetching videos with params:', params);
      console.log('VideoService: Query string:', queryParams.toString());

      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/videos?${queryParams.toString()}`, { headers });
      return res.data;
    } catch (error) {
      console.error('VideoService: Get videos error:', error);
      throw error;
    }
  }

  // Get video by ID (no auth required)
  async getVideoById(id) {
    try {
      // Try with authentication first, fallback to no auth
      let headers;
      try {
        headers = this.getAuthHeaders(false); // Don't require auth
      } catch (error) {
        headers = this.getBasicHeaders();
      }

      const res = await httpClient.get(`/api/v1/cms/videos/${id}`, { headers });
      return res.data;
    } catch (error) {
      console.error('VideoService: Get video by ID error:', error);
      throw error;
    }
  }

  // Update video
  async updateVideo(id, videoData) {
    try {
      const res = await httpClient.put(`/api/v1/cms/videos/${id}`, videoData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('VideoService: Update video error:', error);
      throw error;
    }
  }

  // Delete video
  async deleteVideo(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/videos/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('VideoService: Delete video error:', error);
      throw error;
    }
  }
}

export default new VideoService();