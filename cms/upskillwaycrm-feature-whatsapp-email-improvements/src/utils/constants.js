// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://65.1.251.7:3000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_ADMIN_LOGIN: '/api/v1/admin/login',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_ME: '/api/v1/auth/me',
  
  // User endpoints
  USERS: '/api/v1/users',
  
  // Content endpoints (CMS routes)
  BLOGS: '/api/v1/cms/blogs',
  VIDEOS: '/api/v1/cms/videos',
  COURSES: '/api/v1/cms/courses',
  EBOOKS: '/api/v1/cms/ebooks',
  FAQS: '/api/v1/cms/faqs',
  TESTIMONIALS: '/api/v1/cms/testimonials',
  
  // Lead endpoints
  LEADS: '/api/v1/leads',
  LEADS_STATS: '/api/v1/leads/stats',
  
  // Health check
  HEALTH: '/health'
};

// Status options
export const STATUS_OPTIONS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SALES: 'sales'
};

// Lead statuses
export const LEAD_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  CLOSED: 'closed'
};

// Lead sources
export const LEAD_SOURCES = {
  WEBSITE: 'website',
  SOCIAL_MEDIA: 'social_media',
  REFERRAL: 'referral',
  EMAIL: 'email',
  PHONE: 'phone',
  OTHER: 'other'
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Toast notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Content types
export const CONTENT_TYPES = {
  BLOG: 'blog',
  VIDEO: 'video',
  COURSE: 'course',
  EBOOK: 'ebook',
  FAQ: 'faq',
  TESTIMONIAL: 'testimonial'
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Theme colors
export const THEME_COLORS = {
  PRIMARY: 'blue',
  SECONDARY: 'gray',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  INFO: 'blue'
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME_PREFERENCE: 'themePreference'
};