import { authApi } from './apiConfig';

const shortCoursesApi = {
  // Get all short courses
  getShortCourses: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.tags) queryParams.append('tags', params.tags);
    queryParams.append('_t', Date.now()); // Cache buster
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/v1/cms/short-courses?${queryString}` : '/api/v1/cms/short-courses';
    
    return authApi.get(url);
  },

  // Get short course by ID
  getShortCourseById: (id) => {
    return authApi.get(`/api/v1/cms/short-courses/${id}`);
  },

  // Create new short course
  createShortCourse: (data) => {
    return authApi.post('/api/v1/cms/short-courses', data);
  },

  // Update short course
  updateShortCourse: (id, data) => {
    return authApi.put(`/api/v1/cms/short-courses/${id}`, data);
  },

  // Delete short course
  deleteShortCourse: (id) => {
    return authApi.delete(`/api/v1/cms/short-courses/${id}`);
  },

  // Bulk delete short courses
  bulkDeleteShortCourses: (ids) => {
    return authApi.post('/api/v1/cms/short-courses/bulk-delete', { ids });
  }
};

export default shortCoursesApi;