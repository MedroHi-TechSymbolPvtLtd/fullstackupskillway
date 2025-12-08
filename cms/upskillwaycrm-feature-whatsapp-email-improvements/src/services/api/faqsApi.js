import httpClient from '../utils/httpClient';
import API_ENDPOINTS from '../utils/apiEndpoints';

export const getFAQs = async (params = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.FAQS.GET_ALL, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch FAQs');
  }
};

export const getFAQ = async (id) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.FAQS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch FAQ');
  }
};

export const createFAQ = async (data) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.FAQS.CREATE, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create FAQ');
  }
};

export const updateFAQ = async (id, data) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.FAQS.UPDATE(id), data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update FAQ');
  }
};

export const deleteFAQ = async (id) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.FAQS.DELETE(id));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete FAQ');
  }
};