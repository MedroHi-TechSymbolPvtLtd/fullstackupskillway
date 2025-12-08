// Refer and Earn API Service
import { API_BASE_URL as BASE_URL } from '../../utils/constants';
import httpClient from '../../services/utils/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1/refer`;

class ReferService {
  // Get auth token from multiple sources
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
      if (token) {
        return token;
      }
    }

    return null;
  }

  // Get auth headers
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

  // Create a new partner
  async createPartner(partnerData) {
    try {
      console.log('Creating partner with data:', partnerData);
      
      const headers = this.getAuthHeaders(true);
      
      const res = await httpClient.post('/api/v1/refer/partners', partnerData, { headers });
      return res.data;
    } catch (error) {
      console.error('Create partner error:', error);
      throw error;
    }
  }

  // Get all partners
  async getPartners(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.isActive !== undefined && { isActive: params.isActive }),
        ...(params.search && { search: params.search }),
        _t: Date.now() // Cache buster
      });

      const headers = this.getAuthHeaders(false);

      const res = await httpClient.get(`/api/v1/refer/partners?${queryParams.toString()}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get partners error:', error);
      throw error;
    }
  }

  // Get partner by ID
  async getPartnerById(id) {
    try {
      const headers = this.getAuthHeaders(false);

      const res = await httpClient.get(`/api/v1/refer/partners/${id}`, { headers });
      return res.data;
    } catch (error) {
      console.error('Get partner by ID error:', error);
      throw error;
    }
  }

  // Update partner
  async updatePartner(id, partnerData) {
    try {
      const res = await httpClient.put(`/api/v1/refer/partners/${id}`, partnerData, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Update partner error:', error);
      throw error;
    }
  }

  // Delete partner
  async deletePartner(id) {
    try {
      const res = await httpClient.delete(`/api/v1/refer/partners/${id}`, { headers: this.getAuthHeaders(true) });
      return res.data;
    } catch (error) {
      console.error('Delete partner error:', error);
      throw error;
    }
  }
}

export default new ReferService();
