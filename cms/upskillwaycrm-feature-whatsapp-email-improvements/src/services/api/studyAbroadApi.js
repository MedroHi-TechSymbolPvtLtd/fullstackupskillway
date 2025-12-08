import { contentApi } from './apiConfig';

const studyAbroadApi = {
  // Get all study abroad records
  getStudyAbroadRecords: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.city) queryParams.append('city', params.city);
    queryParams.append('_t', Date.now()); // Cache buster
    
    const queryString = queryParams.toString();
    const url = queryString ? `/study-abroad?${queryString}` : '/study-abroad';
    
    return contentApi.get(url);
  },

  // Get study abroad record by ID
  getStudyAbroadById: (id) => {
    return contentApi.get(`/study-abroad/${id}`);
  },

  // Create new study abroad record
  createStudyAbroad: (data) => {
    return contentApi.post('/study-abroad', data);
  },

  // Update study abroad record
  updateStudyAbroad: (id, data) => {
    return contentApi.put(`/study-abroad/${id}`, data);
  },

  // Delete study abroad record
  deleteStudyAbroad: (id) => {
    return contentApi.delete(`/study-abroad/${id}`);
  },

  // Bulk delete study abroad records
  bulkDeleteStudyAbroad: (ids) => {
    return contentApi.post('/study-abroad/bulk-delete', { ids });
  }
};

export default studyAbroadApi;