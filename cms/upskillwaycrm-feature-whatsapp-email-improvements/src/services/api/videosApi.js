import httpClient from '../utils/httpClient';
import API_ENDPOINTS from '../utils/apiEndpoints';

const videosApi = {
  // Get all videos with optional query parameters
  getAllVideos: async (params = {}) => {
    const response = await httpClient.get(API_ENDPOINTS.VIDEOS.GET_ALL, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get video by ID
  getVideoById: async (id) => {
    const response = await httpClient.get(API_ENDPOINTS.VIDEOS.GET_BY_ID(id));
    return response.data;
  },

  // Create new video
  createVideo: async (videoData) => {
    const response = await httpClient.post(API_ENDPOINTS.VIDEOS.CREATE, videoData);
    return response.data;
  },

  // Update existing video
  updateVideo: async (id, videoData) => {
    const response = await httpClient.put(API_ENDPOINTS.VIDEOS.UPDATE(id), videoData);
    return response.data;
  },

  // Delete video
  deleteVideo: async (id) => {
    const response = await httpClient.delete(API_ENDPOINTS.VIDEOS.DELETE(id));
    return response.data;
  },

  // Search videos
  searchVideos: async (searchTerm) => {
    const response = await httpClient.get(API_ENDPOINTS.VIDEOS.GET_ALL, {
      params: { search: searchTerm }
    });
    return response.data;
  },

  // Get videos by status
  getVideosByStatus: async (status, params = {}) => {
    const response = await httpClient.get(API_ENDPOINTS.VIDEOS.GET_ALL, {
      params: { ...params, status }
    });
    return response.data;
  }
};

export default videosApi;