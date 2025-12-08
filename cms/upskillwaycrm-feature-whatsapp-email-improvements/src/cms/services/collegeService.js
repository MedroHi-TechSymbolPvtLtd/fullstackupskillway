// College Training API Service
// Uses training-programs API with trainingType='college'
import { API_BASE_URL as BASE_URL } from '../../utils/constants';
import httpClient from '../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/cms`;

class CollegeService {
  // Get auth token
  getAuthToken() {
    const sources = [
      () => localStorage.getItem('access_token'),
      () => localStorage.getItem('upskillway_access_token'),
      () => {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => 
          cookie.trim().startsWith('upskillway_access_token=')
        );
        return tokenCookie ? tokenCookie.split('=')[1] : null;
      }
    ];

    for (const getToken of sources) {
      const token = getToken();
      if (token) return token;
    }
    return null;
  }

  // Get auth headers
  getAuthHeaders(requireAuth = true) {
    const token = this.getAuthToken();
    
    if (requireAuth && !token) {
      throw new Error('Authentication required');
    }
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Get all college training programs with filters
  async getColleges(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        trainingType: 'college', // Always filter by college training type
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status })
      });

      const res = await httpClient.get(`/api/v1/cms/training-programs?${queryParams.toString()}`, { headers: this.getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Get college training programs error:', error);
      throw error;
    }
  }

  // Get college training program by ID
  async getCollegeById(id) {
    try {
      const res = await httpClient.get(`/api/v1/cms/training-programs/${id}`, { headers: this.getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Get college training program by ID error:', error);
      throw error;
    }
  }

  // Create college training program
  async createCollege(collegeData) {
    try {
      // Ensure trainingType is set to 'college'
      const dataToSend = {
        ...collegeData,
        trainingType: 'college'
      };

      const res = await httpClient.post(`/api/v1/cms/training-programs`, dataToSend, { headers: this.getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Create college training program error:', error);
      throw error;
    }
  }

  // Update college training program
  async updateCollege(id, collegeData) {
    try {
      // Ensure trainingType remains 'college'
      const dataToSend = {
        ...collegeData,
        trainingType: 'college'
      };

      const res = await httpClient.put(`/api/v1/cms/training-programs/${id}`, dataToSend, { headers: this.getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Update college training program error:', error);
      throw error;
    }
  }

  // Delete college training program
  async deleteCollege(id) {
    try {
      const res = await httpClient.delete(`/api/v1/cms/training-programs/${id}`, { headers: this.getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Delete college training program error:', error);
      throw error;
    }
  }
}

export default new CollegeService();
