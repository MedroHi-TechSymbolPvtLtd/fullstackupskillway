import { API_BASE_URL as BASE_URL } from '../../utils/constants';
import httpClient from '../../services/utils/httpClient';

// Short Courses API Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class ShortCoursesService {
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
        console.log('ShortCoursesService: Found auth token from source');
        return token;
      }
    }

    console.warn('ShortCoursesService: No auth token found in any source');
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

  // Get all short courses
  async getShortCourses(params = {}) {
    try {
      console.log('ShortCoursesService: Fetching short courses with params:', params);
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.tags) queryParams.append('tags', params.tags);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/short-courses${queryString ? `?${queryString}` : ''}`;
      
      const res = await httpClient.get(`/api/v1/cms/short-courses${queryString ? `?${queryString}` : ''}`, { headers: this.getAuthHeaders(false) });
      const data = res.data;
      console.log('ShortCoursesService: Received short courses:', data);
      
      return {
        data: data.data || [],
        pagination: data.pagination || {},
        success: data.success
      };
    } catch (error) {
      console.error('ShortCoursesService: Error fetching short courses:', error);
      throw error;
    }
  }

  // Get short course by ID
  async getShortCourseById(id) {
    try {
      console.log('ShortCoursesService: Fetching short course by ID:', id);
      
      const res = await httpClient.get(`/api/v1/cms/short-courses/${id}`, { headers: this.getAuthHeaders(false) });
      const data = res.data;
      console.log('ShortCoursesService: Received short course:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('ShortCoursesService: Error fetching short course:', error);
      throw error;
    }
  }

  // Create new short course
  async createShortCourse(courseData) {
    try {
      console.log('ShortCoursesService: Creating short course:', courseData);
      
      const res = await httpClient.post(`/api/v1/cms/short-courses`, courseData, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('ShortCoursesService: Short course created:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('ShortCoursesService: Error creating short course:', error);
      throw error;
    }
  }

  // Update short course
  async updateShortCourse(id, courseData) {
    try {
      console.log('ShortCoursesService: Updating short course:', id, courseData);
      
      const res = await httpClient.put(`/api/v1/cms/short-courses/${id}`, courseData, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('ShortCoursesService: Short course updated:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('ShortCoursesService: Error updating short course:', error);
      throw error;
    }
  }

  // Delete short course
  async deleteShortCourse(id) {
    try {
      console.log('ShortCoursesService: Deleting short course:', id);
      
      const res = await httpClient.delete(`/api/v1/cms/short-courses/${id}`, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('ShortCoursesService: Short course deleted:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('ShortCoursesService: Error deleting short course:', error);
      throw error;
    }
  }

  // Bulk delete short courses
  async bulkDeleteShortCourses(ids) {
    try {
      console.log('ShortCoursesService: Bulk deleting short courses:', ids);
      
      const response = await fetch(`${API_BASE_URL}/short-courses/bulk-delete`, {
        method: 'POST',
        headers: this.getAuthHeaders(true),
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('ShortCoursesService: Short courses bulk deleted:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('ShortCoursesService: Error bulk deleting short courses:', error);
      throw error;
    }
  }
}

export default new ShortCoursesService();