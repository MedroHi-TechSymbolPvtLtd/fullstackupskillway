const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/admin/login',
    USER_LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
  },

  // User endpoints
  USERS: {
    BASE: '/api/v1/users',
    GET_ALL: '/api/v1/users',
    GET_BY_ID: (id) => `/api/v1/users/${id}`,
    CREATE: '/api/v1/users',
    UPDATE: (id) => `/api/v1/users/${id}`,
    DELETE: (id) => `/api/v1/users/${id}`,
    ACTIVATE: (id) => `/api/v1/users/${id}/activate`,
    DEACTIVATE: (id) => `/api/v1/users/${id}/deactivate`,
  },

  // Blog endpoints (CMS routes)
  BLOGS: {
    BASE: '/api/v1/cms/blogs',
    GET_ALL: '/api/v1/cms/blogs',
    GET_BY_ID: (id) => `/api/v1/cms/blogs/${id}`,
    CREATE: '/api/v1/cms/blogs',
    UPDATE: (id) => `/api/v1/cms/blogs/${id}`,
    DELETE: (id) => `/api/v1/cms/blogs/${id}`,
  },

  // Video endpoints (CMS routes)
  VIDEOS: {
    BASE: '/api/v1/cms/videos',
    GET_ALL: '/api/v1/cms/videos',
    GET_BY_ID: (id) => `/api/v1/cms/videos/${id}`,
    CREATE: '/api/v1/cms/videos',
    UPDATE: (id) => `/api/v1/cms/videos/${id}`,
    DELETE: (id) => `/api/v1/cms/videos/${id}`,
  },

  // Course endpoints (CMS routes)
  COURSES: {
    BASE: '/api/v1/cms/courses',
    GET_ALL: '/api/v1/cms/courses',
    GET_BY_ID: (id) => `/api/v1/cms/courses/${id}`,
    CREATE: '/api/v1/cms/courses',
    UPDATE: (id) => `/api/v1/cms/courses/${id}`,
    DELETE: (id) => `/api/v1/cms/courses/${id}`,
  },

  // Ebook endpoints (CMS routes)
  EBOOKS: {
    BASE: '/api/v1/cms/ebooks',
    GET_ALL: '/api/v1/cms/ebooks',
    GET_BY_ID: (id) => `/api/v1/cms/ebooks/${id}`,
    CREATE: '/api/v1/cms/ebooks',
    UPDATE: (id) => `/api/v1/cms/ebooks/${id}`,
    DELETE: (id) => `/api/v1/cms/ebooks/${id}`,
  },

  // FAQ endpoints (CMS routes)
  FAQS: {
    BASE: '/api/v1/cms/faqs',
    GET_ALL: '/api/v1/cms/faqs',
    GET_BY_ID: (id) => `/api/v1/cms/faqs/${id}`,
    CREATE: '/api/v1/cms/faqs',
    UPDATE: (id) => `/api/v1/cms/faqs/${id}`,
    DELETE: (id) => `/api/v1/cms/faqs/${id}`,
  },

  // Testimonial endpoints (CMS routes)
  TESTIMONIALS: {
    BASE: '/api/v1/cms/testimonials',
    GET_ALL: '/api/v1/cms/testimonials',
    GET_BY_ID: (id) => `/api/v1/cms/testimonials/${id}`,
    CREATE: '/api/v1/cms/testimonials',
    UPDATE: (id) => `/api/v1/cms/testimonials/${id}`,
    DELETE: (id) => `/api/v1/cms/testimonials/${id}`,
  },

  // Lead endpoints
  LEADS: {
    BASE: '/api/v1/leads',
    GET_ALL: '/api/v1/leads',
    GET_BY_ID: (id) => `/api/v1/leads/${id}`,
    CREATE: '/api/v1/leads',
    UPDATE: (id) => `/api/v1/leads/${id}`,
    DELETE: (id) => `/api/v1/leads/${id}`,
    STATS: '/api/v1/leads/stats',
  },

  // Health check
  HEALTH: '/health',
};

export default API_ENDPOINTS;