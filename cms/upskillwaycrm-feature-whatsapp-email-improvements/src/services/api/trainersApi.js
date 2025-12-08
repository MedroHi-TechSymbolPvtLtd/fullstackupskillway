import { authApi } from './apiConfig';

const trainersApi = {
  // Get all trainers with pagination and search
  getAllTrainers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add search and filter params
      if (params.search) queryParams.append('search', params.search);
      if (params.specialization) queryParams.append('specialization', params.specialization);
      if (params.availability) queryParams.append('availability', params.availability);
      if (params.trainingMode) queryParams.append('trainingMode', params.trainingMode);
      if (params.minExperience) queryParams.append('minExperience', params.minExperience);
      if (params.maxHourlyRate) queryParams.append('maxHourlyRate', params.maxHourlyRate);
      queryParams.append('_t', Date.now()); // Cache buster
      
      const queryString = queryParams.toString();
      const url = queryString ? `/api/v1/trainers?${queryString}` : '/api/v1/trainers';
      
      const response = await authApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainers:', error);
      throw error;
    }
  },

  // Get trainer by ID
  getTrainerById: async (id) => {
    try {
      const response = await authApi.get(`/api/v1/trainers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer:', error);
      throw error;
    }
  },

  // Create new trainer
  createTrainer: async (trainerData) => {
    try {
      const response = await authApi.post('/api/v1/trainers', trainerData);
      return response.data;
    } catch (error) {
      console.error('Error creating trainer:', error);
      throw error;
    }
  },

  // Update trainer
  updateTrainer: async (id, trainerData) => {
    try {
      const response = await authApi.put(`/api/v1/trainers/${id}`, trainerData);
      return response.data;
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  },

  // Delete trainer
  deleteTrainer: async (id) => {
    try {
      const response = await authApi.delete(`/api/v1/trainers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  },

  // Search trainers
  searchTrainers: async (searchParams) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.search) queryParams.append('search', searchParams.search);
      if (searchParams.specialization) queryParams.append('specialization', searchParams.specialization);
      if (searchParams.availability) queryParams.append('availability', searchParams.availability);
      if (searchParams.trainingMode) queryParams.append('trainingMode', searchParams.trainingMode);
      if (searchParams.minExperience) queryParams.append('minExperience', searchParams.minExperience);
      if (searchParams.maxHourlyRate) queryParams.append('maxHourlyRate', searchParams.maxHourlyRate);
      if (searchParams.page) queryParams.append('page', searchParams.page);
      if (searchParams.limit) queryParams.append('limit', searchParams.limit);
      queryParams.append('_t', Date.now()); // Cache buster
      
      const queryString = queryParams.toString();
      const url = queryString ? `/api/v1/trainers?${queryString}` : '/api/v1/trainers';
      
      const response = await authApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error searching trainers:', error);
      throw error;
    }
  },

  // Get trainer statistics
  getTrainerStats: async () => {
    try {
      const response = await authApi.get('/api/v1/trainers/stats', {
        params: { _t: Date.now() } // Cache buster
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer stats:', error);
      throw error;
    }
  },

  // Get available specializations
  getSpecializations: async () => {
    try {
      const response = await authApi.get('/api/v1/trainers/specializations', {
        params: { _t: Date.now() } // Cache buster
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw error;
    }
  },

  // Get training modes
  getTrainingModes: async () => {
    try {
      const response = await authApi.get('/api/v1/trainers/training-modes', {
        params: { _t: Date.now() } // Cache buster
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching training modes:', error);
      throw error;
    }
  }
};

export default trainersApi;
