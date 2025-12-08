import { API_BASE_URL as BASE_URL } from '../../utils/constants';
import httpClient from '../../services/utils/httpClient';

// Study Abroad API Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class StudyAbroadService {
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
        console.log('StudyAbroadService: Found auth token from source');
        return token;
      }
    }

    console.warn('StudyAbroadService: No auth token found in any source');
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

  // Get all study abroad records
  async getStudyAbroadRecords(params = {}) {
    try {
      console.log('StudyAbroadService: Fetching study abroad records with params:', params);
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.city) queryParams.append('city', params.city);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/study-abroad${queryString ? `?${queryString}` : ''}`;
      
      const res = await httpClient.get(`/api/v1/cms/study-abroad${queryString ? `?${queryString}` : ''}`, { headers: this.getAuthHeaders(false) });
      const data = res.data;
      console.log('StudyAbroadService: Received study abroad records:', data);
      
      return {
        data: data.data || [],
        pagination: data.pagination || {},
        success: data.success
      };
    } catch (error) {
      console.error('StudyAbroadService: Error fetching study abroad records:', error);
      throw error;
    }
  }

  // Get study abroad record by ID
  async getStudyAbroadById(id) {
    try {
      console.log('StudyAbroadService: Fetching study abroad record by ID:', id);
      
      const res = await httpClient.get(`/api/v1/cms/study-abroad/${id}`, { headers: this.getAuthHeaders(false) });
      const data = res.data;
      console.log('StudyAbroadService: Received study abroad record:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('StudyAbroadService: Error fetching study abroad record:', error);
      throw error;
    }
  }

  // Create new study abroad record
  async createStudyAbroad(studyAbroadData) {
    try {
      console.log('StudyAbroadService: Creating study abroad record:', studyAbroadData);
      
      const res = await httpClient.post(`/api/v1/cms/study-abroad`, studyAbroadData, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('StudyAbroadService: Study abroad record created:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('StudyAbroadService: Error creating study abroad record:', error);
      throw error;
    }
  }

  // Update study abroad record
  async updateStudyAbroad(id, studyAbroadData) {
    try {
      console.log('StudyAbroadService: Updating study abroad record:', id, studyAbroadData);
      
      const res = await httpClient.put(`/api/v1/cms/study-abroad/${id}`, studyAbroadData, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('StudyAbroadService: Study abroad record updated:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('StudyAbroadService: Error updating study abroad record:', error);
      throw error;
    }
  }

  // Delete study abroad record
  async deleteStudyAbroad(id) {
    try {
      console.log('StudyAbroadService: Deleting study abroad record:', id);
      
      const res = await httpClient.delete(`/api/v1/cms/study-abroad/${id}`, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('StudyAbroadService: Study abroad record deleted:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('StudyAbroadService: Error deleting study abroad record:', error);
      throw error;
    }
  }

  // Bulk delete study abroad records
  async bulkDeleteStudyAbroad(ids) {
    try {
      console.log('StudyAbroadService: Bulk deleting study abroad records:', ids);
      
      const res = await httpClient.post(`/api/v1/cms/study-abroad/bulk-delete`, { ids }, { headers: this.getAuthHeaders(true) });
      const data = res.data;
      console.log('StudyAbroadService: Study abroad records bulk deleted:', data);
      
      return {
        data: data.data,
        success: data.success
      };
    } catch (error) {
      console.error('StudyAbroadService: Error bulk deleting study abroad records:', error);
      throw error;
    }
  }
}

export default new StudyAbroadService();