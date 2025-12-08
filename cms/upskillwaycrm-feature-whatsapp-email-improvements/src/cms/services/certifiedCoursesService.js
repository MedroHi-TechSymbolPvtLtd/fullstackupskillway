// Certified Courses API Service
import { API_BASE_URL as BASE_URL } from '../../utils/constants';
import httpClient from '../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class CertifiedCoursesService {
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
        console.log('CertifiedCoursesService: Found auth token from source');
        return token;
      }
    }

    console.warn('CertifiedCoursesService: No auth token found in any source');
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

  // Get all certified courses
  async getCertifiedCourses(params = {}) {
    try {
      console.log('CertifiedCoursesService: Fetching certified courses with params:', params);
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.tags) queryParams.append('tags', params.tags);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/certified-courses${queryString ? `?${queryString}` : ''}`;
      
      const res = await httpClient.get(`/api/v1/cms/certified-courses${queryString ? `?${queryString}` : ''}`, { headers: this.getAuthHeaders(false) });
      const data = res.data;
      console.log('CertifiedCoursesService: Received certified courses:', data);
      
      return {
        data: data.data || [],
        pagination: data.pagination || {},
        success: data.success
      };
    } catch (error) {
      console.error('CertifiedCoursesService: Error fetching certified courses:', error);
      throw error;
    }
  }

  // Get certified course by ID
  async getCertifiedCourseById(id) {
    try {
      console.log('CertifiedCoursesService: Fetching certified course by ID:', id);
      
      const res = await httpClient.get(`/api/v1/cms/certified-courses/${id}`, { headers: this.getAuthHeaders(false) });
      const data = res.data;
      console.log('CertifiedCoursesService: Received certified course:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('CertifiedCoursesService: Error fetching certified course:', error);
      throw error;
    }
  }

  // Create new certified course
  async createCertifiedCourse(courseData) {
    try {
      console.log('CertifiedCoursesService: Creating certified course:', courseData);
      
      const res = await httpClient.post(`/api/v1/cms/certified-courses`, courseData, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('CertifiedCoursesService: Certified course created:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('CertifiedCoursesService: Error creating certified course:', error);
      throw error;
    }
  }

  // Update certified course
  async updateCertifiedCourse(id, courseData) {
    try {
      console.log('CertifiedCoursesService: Updating certified course:', id, courseData);
      
      const res = await httpClient.put(`/api/v1/cms/certified-courses/${id}`, courseData, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('CertifiedCoursesService: Certified course updated:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('CertifiedCoursesService: Error updating certified course:', error);
      throw error;
    }
  }

  // Delete certified course
  async deleteCertifiedCourse(id) {
    try {
      console.log('CertifiedCoursesService: Deleting certified course:', id);
      
      const res = await httpClient.delete(`/api/v1/cms/certified-courses/${id}`, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('CertifiedCoursesService: Certified course deleted:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('CertifiedCoursesService: Error deleting certified course:', error);
      throw error;
    }
  }

  // Bulk delete certified courses
  async bulkDeleteCertifiedCourses(ids) {
    try {
      console.log('CertifiedCoursesService: Bulk deleting certified courses:', ids);
      
      const res = await httpClient.post(`/api/v1/cms/certified-courses/bulk-delete`, { ids }, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('CertifiedCoursesService: Certified courses bulk deleted:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('CertifiedCoursesService: Error bulk deleting certified courses:', error);
      throw error;
    }
  }
}

export default new CertifiedCoursesService();