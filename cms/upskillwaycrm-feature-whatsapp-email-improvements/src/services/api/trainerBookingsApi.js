import axios from 'axios';
import { formatToISO } from '../../utils/datetimeUtils';

import { API_BASE_URL as BASE_URL } from '../../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1`;

// Create axios instance with auth interceptor
const trainerBookingsApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
trainerBookingsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('upskillway_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No authentication token found for trainer booking API request');
    }
    
    // Log request details for debugging
    console.log('Trainer Booking API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
      hasToken: !!token
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
trainerBookingsApi.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('Trainer Booking API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log error responses for debugging
    console.log('Trainer Booking API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 429 (Too Many Requests) with retry logic
    if (error.response?.status === 429) {
      const retryAfter = error.response?.data?.retryAfter || 5; // Default 5 seconds
      console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
      
      // Wait and retry once
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      
      try {
        const retryResponse = await trainerBookingsApi.request(error.config);
        return retryResponse;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        // If retry fails, show user-friendly message
        error.message = 'Server is busy. Please try again in a few moments.';
      }
    }
    
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('access_token');
      localStorage.removeItem('upskillway_access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Get all trainer bookings with pagination and filters
  getAllBookings: async (params = {}) => {
    const response = await trainerBookingsApi.get('/trainer-bookings', { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get trainer booking by ID
  getBookingById: async (id) => {
    const response = await trainerBookingsApi.get(`/trainer-bookings/${id}`, {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },

  // Create new trainer booking
  createBooking: async (bookingData) => {
    const formattedBookingData = {
      ...bookingData,
      startTime: formatToISO(bookingData.startTime),
      endTime: formatToISO(bookingData.endTime)
    };

    console.log('Creating trainer booking with formatted times:', formattedBookingData);

    const response = await trainerBookingsApi.post('/trainer-bookings', formattedBookingData);
    return response.data;
  },

  // Create admin trainer booking (with college assignment)
  createAdminBooking: async (bookingData) => {
    const formattedBookingData = {
      ...bookingData,
      startTime: formatToISO(bookingData.startTime),
      endTime: formatToISO(bookingData.endTime)
    };

    console.log('Creating admin trainer booking with formatted times:', formattedBookingData);

    const response = await trainerBookingsApi.post('/trainer-bookings/admin', formattedBookingData);
    return response.data;
  },

  // Update existing trainer booking
  updateBooking: async (id, bookingData) => {
    const formattedBookingData = {
      ...bookingData,
      ...(bookingData.startTime && { startTime: formatToISO(bookingData.startTime) }),
      ...(bookingData.endTime && { endTime: formatToISO(bookingData.endTime) })
    };

    console.log('Updating trainer booking with formatted times:', formattedBookingData);

    const response = await trainerBookingsApi.put(`/trainer-bookings/${id}`, formattedBookingData);
    return response.data;
  },

  // Cancel trainer booking
  cancelBooking: async (id) => {
    const response = await trainerBookingsApi.patch(`/trainer-bookings/${id}/cancel`);
    return response.data;
  },

  // Get bookings by trainer ID
  getBookingsByTrainer: async (trainerId, params = {}) => {
    const response = await trainerBookingsApi.get(`/trainer-bookings/trainer/${trainerId}`, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get bookings by user ID (booked by)
  getBookingsByUser: async (userId, params = {}) => {
    const response = await trainerBookingsApi.get(`/trainer-bookings/user/${userId}`, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get booking statistics
  getBookingStats: async () => {
    const response = await trainerBookingsApi.get('/trainer-bookings/stats', {
      params: { _t: Date.now() } // Cache buster
    });
    return response.data;
  },

  // Check trainer availability for specific time slot
  checkTrainerAvailability: async (trainerId, startTime, endTime) => {
    const formattedStartTime = formatToISO(startTime);
    const formattedEndTime = formatToISO(endTime);

    console.log('Checking trainer availability with formatted times:', {
      trainerId,
      startTime: formattedStartTime,
      endTime: formattedEndTime
    });

    const response = await trainerBookingsApi.get('/trainer-bookings/availability', {
      params: {
        trainerId,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Get trainer calendar with bookings
  getTrainerCalendar: async (trainerId, params = {}) => {
    const response = await trainerBookingsApi.get(`/trainer-bookings/trainer/${trainerId}/calendar`, { 
      params: {
        ...params,
        _t: Date.now() // Cache buster
      }
    });
    return response.data;
  },

  // Update trainer status
  updateTrainerStatus: async (trainerId, statusData) => {
    const response = await trainerBookingsApi.patch(`/trainer-bookings/trainer/${trainerId}/status`, statusData);
    return response.data;
  },
};
