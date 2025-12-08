import axios from 'axios';
import { authUtils } from '../utils/authUtils';
import toast from 'react-hot-toast';

// API Base URLs
const API_BASE_URLS = {
  AUTH: import.meta.env.VITE_AUTH_API_URL || 'https://65.1.251.7:3000',
  PROFILES: import.meta.env.VITE_PROFILES_API_URL || 'https://65.1.251.7:3000',
  CONTENT: import.meta.env.VITE_CONTENT_API_URL || 'https://65.1.251.7:3000',
  MAIN: import.meta.env.VITE_API_URL || 'https://65.1.251.7:3000',
};

// Create axios instances for different services
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Don't add Authorization header for login requests
      const isLoginRequest = config.url?.includes('/login') || config.url?.includes('/forgot-password') || config.url?.includes('/reset-password');
      
      if (!isLoginRequest) {
        // Add auth token to requests (except login/auth endpoints)
        const token = authUtils.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Log request in development
      if (import.meta.env.MODE === 'development') {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          headers: config.headers,
        });
      }

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Log successful response in development
      
      // Detect new lead creation and dispatch event for real-time updates
      if (response.config?.method === 'post' && response.config?.url?.includes('/leads') && !response.config?.url?.includes('/status')) {
        const leadData = response.data?.data || response.data;
        if (leadData && (leadData.id || leadData._id)) {
          console.log('🆕 New lead created detected:', leadData);
          // Dispatch event to notify all components
          window.dispatchEvent(new CustomEvent('newLeadCreated', {
            detail: {
              source: response.config?.url?.includes('/api/v1') ? 'api' : 'website',
              lead: leadData,
              timestamp: new Date().toISOString()
            }
          }));
          // Also dispatch the general leadsUpdated event
          window.dispatchEvent(new CustomEvent('leadsUpdated', {
            detail: {
              source: response.config?.url?.includes('/api/v1') ? 'api' : 'website',
              action: 'created',
              lead: leadData,
              insertedRows: 1
            }
          }));
        }
      }

      // Detect new trainer creation and dispatch event for real-time updates
      if (response.config?.method === 'post' && response.config?.url?.includes('/trainers')) {
        const trainerData = response.data?.data || response.data;
        if (trainerData && (trainerData.id || trainerData._id)) {
          console.log('🆕 New trainer created detected:', trainerData);
          // Dispatch event to notify all components
          window.dispatchEvent(new CustomEvent('trainerCreated', {
            detail: {
              trainer: trainerData,
              timestamp: new Date().toISOString()
            }
          }));
          // Also dispatch the general trainersUpdated event
          window.dispatchEvent(new CustomEvent('trainersUpdated', {
            detail: {
              action: 'created',
              trainer: trainerData,
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

      // Detect trainer updates
      if ((response.config?.method === 'put' || response.config?.method === 'patch') && response.config?.url?.includes('/trainers')) {
        const trainerData = response.data?.data || response.data;
        if (trainerData && (trainerData.id || trainerData._id)) {
          console.log('🔄 Trainer updated detected:', trainerData);
          window.dispatchEvent(new CustomEvent('trainersUpdated', {
            detail: {
              action: 'updated',
              trainer: trainerData,
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

      // Detect college-trainer assignment creation
      if (response.config?.method === 'post' && response.config?.url?.includes('/college-trainers')) {
        const assignmentData = response.data?.data || response.data?.assignment || response.data;
        if (assignmentData && (assignmentData.id || assignmentData._id)) {
          console.log('🆕 College-trainer assignment created detected:', assignmentData);
          window.dispatchEvent(new CustomEvent('assignmentCreated', {
            detail: {
              assignment: assignmentData,
              timestamp: new Date().toISOString()
            }
          }));
          window.dispatchEvent(new CustomEvent('assignmentsUpdated', {
            detail: {
              action: 'created',
              assignment: assignmentData,
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

      // Detect college-trainer assignment updates/deletes
      if ((response.config?.method === 'put' || response.config?.method === 'patch' || response.config?.method === 'delete') && response.config?.url?.includes('/college-trainers')) {
        const assignmentData = response.data?.data || response.data?.assignment || response.data;
        if (assignmentData) {
          console.log('🔄 College-trainer assignment updated/deleted detected:', assignmentData);
          window.dispatchEvent(new CustomEvent('assignmentsUpdated', {
            detail: {
              action: response.config?.method === 'delete' ? 'deleted' : 'updated',
              assignment: assignmentData,
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

      // Detect lead conversion to college (status update with college data)
      if (response.config?.method === 'put' || response.config?.method === 'patch') {
        const url = response.config?.url || '';
        if (url.includes('/leads') && (url.includes('/status') || url.includes('/stage'))) {
          const leadData = response.data?.data || response.data;
          if (leadData && (leadData.college || leadData.collegeId)) {
            console.log('🔄 Lead converted to college detected:', leadData);
            // Dispatch event to notify college list
            window.dispatchEvent(new CustomEvent('leadConverted', {
              detail: {
                lead: leadData,
                college: leadData.college,
                collegeId: leadData.collegeId,
                isNewCollege: leadData.college && !leadData.collegeId,
                timestamp: new Date().toISOString()
              }
            }));
            // Also dispatch collegeCreated event if a new college was created
            if (leadData.college && leadData.college.id) {
              console.log('🏗️ New college created from lead conversion:', leadData.college);
              window.dispatchEvent(new CustomEvent('collegeCreated', {
                detail: {
                  college: leadData.college,
                  source: 'lead_conversion',
                  leadId: leadData.id || leadData._id,
                  timestamp: new Date().toISOString()
                }
              }));
            }
            // Dispatch collegesUpdated event for general college list updates
            window.dispatchEvent(new CustomEvent('collegesUpdated', {
              detail: {
                action: leadData.college && leadData.college.id ? 'created' : 'updated',
                college: leadData.college,
                collegeId: leadData.collegeId,
                source: 'lead_conversion',
                timestamp: new Date().toISOString()
              }
            }));
          }
        }
      }
      
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Log error in development
      if (import.meta.env.MODE === 'development') {
        console.error(`❌ ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, error.response?.data);
      }

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Don't try to refresh token for login requests
        if (originalRequest.url?.includes('/login')) {
          return Promise.reject(error);
        }
        
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const refreshToken = authUtils.getRefreshToken();
          if (refreshToken) {
            const authInstance = createApiInstance(API_BASE_URLS.AUTH);
            const response = await authInstance.post('/api/v1/auth/refresh', {
              refresh_token: refreshToken,
            });
            

            if (response.data?.access_token) {
              authUtils.setToken(response.data.access_token);
              originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
              return instance(originalRequest);
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }

        // If token refresh fails, clear tokens and redirect to login
        authUtils.removeToken();
        authUtils.removeRefreshToken();
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }

      // Handle other errors
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
        
        // Don't show toast for certain status codes that are handled by components
        if (![400, 404, 422].includes(error.response.status)) {
          toast.error(message);
        }
        
        error.message = message;
      } else if (error.request) {
        // Request was made but no response received
        const message = 'Network error. Please check your connection.';
        toast.error(message);
        error.message = message;
      } else {
        // Something else happened
        const message = error.message || 'An unexpected error occurred';
        toast.error(message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create API instances for different services
export const authApi = createApiInstance(API_BASE_URLS.AUTH);
export const profilesApi = createApiInstance(API_BASE_URLS.PROFILES);
export const contentApi = createApiInstance(API_BASE_URLS.CONTENT);
export const mainApi = createApiInstance(API_BASE_URLS.MAIN);

// Export API configurations
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login', // Default user login
    ADMIN_LOGIN: '/api/v1/admin/login', // Admin login
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    HEALTHZ: '/healthz',
  },

  // Profile endpoints
  PROFILES: {
    ME: '/profiles/me',
    BY_ID: (id) => `/profiles/${id}`,
    SEARCH: '/profiles/search',
    UPDATE: '/profiles/update',
  },

  // Content endpoints (CMS routes)
  CONTENT: {
    BLOGS: '/api/v1/cms/blogs',
    BLOG_BY_ID: (id) => `/api/v1/cms/blogs/${id}`,
    VIDEOS: '/api/v1/cms/videos',
    VIDEO_BY_ID: (id) => `/api/v1/cms/videos/${id}`,
    COURSES: '/api/v1/cms/courses',
    COURSE_BY_ID: (id) => `/api/v1/cms/courses/${id}`,
    EBOOKS: '/api/v1/cms/ebooks',
    EBOOK_BY_ID: (id) => `/api/v1/cms/ebooks/${id}`,
    FAQS: '/api/v1/cms/faqs',
    FAQ_BY_ID: (id) => `/api/v1/cms/faqs/${id}`,
    TESTIMONIALS: '/api/v1/cms/testimonials',
    TESTIMONIAL_BY_ID: (id) => `/api/v1/cms/testimonials/${id}`,
  },

  // User management endpoints
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    SEARCH: '/users/search',
  },

  // Leads endpoints
  LEADS: {
    LIST: '/leads',
    BY_ID: (id) => `/leads/${id}`,
    STATS: '/leads/stats',
    EXPORT: '/leads/export',
  },

  // Settings endpoints
  SETTINGS: {
    GENERAL: '/settings/general',
    SYSTEM: '/settings/system',
    NOTIFICATIONS: '/settings/notifications',
  },

  // Upload endpoints
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
    VIDEO: '/upload/video',
  },

  // Excel Upload endpoints
  EXCEL_UPLOAD: {
    UPLOAD: '/api/v1/excel-upload/upload',
    VALIDATE: '/api/v1/excel-upload/validate',
    TEMPLATE: '/api/v1/excel-upload/template',
    CONFIG: '/api/v1/excel-upload/config',
    HISTORY: '/api/v1/excel-upload/history',
    STATS: '/api/v1/excel-upload/stats',
  },
};

// Default request config
export const DEFAULT_REQUEST_CONFIG = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// File upload config
export const UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export default {
  authApi,
  profilesApi,
  contentApi,
  mainApi,
  API_ENDPOINTS,
  API_BASE_URLS,
};