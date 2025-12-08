import httpClient from '../utils/httpClient';
import API_ENDPOINTS from '../utils/apiEndpoints';

const coursesApi = {
  // Get all courses with optional query parameters
  getAllCourses: async (params = {}) => {
    const response = await httpClient.get(API_ENDPOINTS.COURSES.GET_ALL, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await httpClient.get(API_ENDPOINTS.COURSES.GET_BY_ID(id));
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await httpClient.post(API_ENDPOINTS.COURSES.CREATE, courseData);
    return response.data;
  },

  // Update existing course
  updateCourse: async (id, courseData) => {
    const response = await httpClient.put(API_ENDPOINTS.COURSES.UPDATE(id), courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await httpClient.delete(API_ENDPOINTS.COURSES.DELETE(id));
    return response.data;
  },

  // Search courses
  searchCourses: async (searchTerm) => {
    const response = await httpClient.get(API_ENDPOINTS.COURSES.GET_ALL, {
      params: { search: searchTerm }
    });
    return response.data;
  },

  // Get courses by status
  getCoursesByStatus: async (status, params = {}) => {
    const response = await httpClient.get(API_ENDPOINTS.COURSES.GET_ALL, {
      params: { ...params, status }
    });
    return response.data;
  }
};

export { coursesApi };
export default coursesApi;