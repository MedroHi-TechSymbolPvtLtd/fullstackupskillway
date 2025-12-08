import { contentApi } from './apiConfig';

const certifiedCoursesApi = {
  // Get all certified courses
  getCertifiedCourses: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.tags) queryParams.append('tags', params.tags);
    queryParams.append('_t', Date.now()); // Cache buster
    
    const queryString = queryParams.toString();
    const url = queryString ? `/certified-courses?${queryString}` : '/certified-courses';
    
    return contentApi.get(url);
  },

  // Get certified course by ID
  getCertifiedCourseById: (id) => {
    return contentApi.get(`/certified-courses/${id}`);
  },

  // Create new certified course
  createCertifiedCourse: (data) => {
    return contentApi.post('/certified-courses', data);
  },

  // Update certified course
  updateCertifiedCourse: (id, data) => {
    return contentApi.put(`/certified-courses/${id}`, data);
  },

  // Delete certified course
  deleteCertifiedCourse: (id) => {
    return contentApi.delete(`/certified-courses/${id}`);
  },

  // Bulk delete certified courses
  bulkDeleteCertifiedCourses: (ids) => {
    return contentApi.post('/certified-courses/bulk-delete', { ids });
  }
};

export default certifiedCoursesApi;