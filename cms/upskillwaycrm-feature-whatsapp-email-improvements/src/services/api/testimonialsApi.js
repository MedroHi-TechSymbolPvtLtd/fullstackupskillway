import httpClient from '../utils/httpClient';
import API_ENDPOINTS from '../utils/apiEndpoints';

export const getTestimonials = async (params = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TESTIMONIALS.GET_ALL, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonials');
  }
};

export const getTestimonial = async (id) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TESTIMONIALS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonial');
  }
};

export const createTestimonial = async (data) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.TESTIMONIALS.CREATE, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create testimonial');
  }
};

export const updateTestimonial = async (id, data) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.TESTIMONIALS.UPDATE(id), data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update testimonial');
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.TESTIMONIALS.DELETE(id));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete testimonial');
  }
};