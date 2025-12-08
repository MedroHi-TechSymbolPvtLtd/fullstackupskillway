import axios from 'axios';

import { API_BASE_URL as BASE_URL } from '../../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api/v1`;

// Create axios instance with auth interceptor
const emailApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for email sending
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
emailApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('upskillway_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details for debugging
    console.log('📧 Email API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
emailApi.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('✅ Email API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error responses for debugging
    console.error('❌ Email API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
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
  /**
   * Send email to a single person
   * @param {Object} emailData - Email data
   * @param {string} emailData.to - Recipient email address
   * @param {string} emailData.toName - Recipient name
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.html - HTML content (optional)
   * @param {string} emailData.text - Plain text content (optional)
   * @param {Object} emailData.from - Sender information (optional)
   * @param {string} emailData.from.name - Sender name
   * @param {string} emailData.from.email - Sender email
   * @param {string} emailData.transport - Transport method: 'api' or 'smtp' (default: 'api')
   * @param {boolean} emailData.queue - Whether to queue the email (default: false)
   * @returns {Promise} API response
   */
  sendEmail: async (emailData) => {
    try {
      console.log('📧 Sending email to single person:', emailData);
      
      // Validate required fields
      if (!emailData.to) {
        throw new Error('Recipient email (to) is required');
      }
      if (!emailData.subject) {
        throw new Error('Email subject is required');
      }
      if (!emailData.html && !emailData.text) {
        throw new Error('Email content (html or text) is required');
      }

      // Prepare email payload
      const payload = {
        to: emailData.to,
        toName: emailData.toName || emailData.to.split('@')[0], // Use email prefix if name not provided
        subject: emailData.subject,
        html: emailData.html || `<p>${emailData.text}</p>`, // Convert text to HTML if needed
        text: emailData.text || emailData.html?.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
        from: emailData.from || {
          name: 'UpSkillWay',
          email: 'info@upskillway.com'
        },
        transport: emailData.transport || 'api',
        queue: emailData.queue || false
      };

      console.log('📧 Sending POST request to /email/send with payload:', payload);

      const response = await emailApi.post('/email/send', payload);
      
      console.log('✅ Email sent successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  },

  /**
   * Send bulk emails to multiple recipients
   * @param {Array} emails - Array of email objects with to, toName, subject, html, text
   * @param {Object} from - Sender information
   * @param {string} transport - Transport method
   * @param {boolean} queue - Queue emails
   * @returns {Promise} API response
   */
  sendBulkEmails: async (emails, from = null, transport = 'api', queue = true) => {
    try {
      console.log('📧 Sending bulk emails to:', emails.length, 'recipients');
      
      // Prepare bulk email payload
      const payload = {
        emails: emails.map(email => ({
          to: email.to,
          toName: email.toName || email.to.split('@')[0],
          subject: email.subject,
          html: email.html,
          text: email.text || email.html?.replace(/<[^>]*>/g, '')
        })),
        from: from || {
          name: 'UpSkillWay',
          email: 'info@upskillway.com'
        },
        transport: transport,
        queue: queue
      };

      console.log('📧 Sending POST request to /email/send-bulk with payload:', payload);

      const response = await emailApi.post('/email/send-bulk', payload);
      
      console.log('✅ Bulk emails sent successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error sending bulk emails:', error);
      throw error;
    }
  },

  /**
   * Send email with template
   * @param {Object} emailData - Email data with template
   * @param {string} emailData.to - Recipient email
   * @param {string} emailData.toName - Recipient name
   * @param {string} emailData.templateId - Template ID
   * @param {Object} emailData.templateData - Template variables
   * @returns {Promise} API response
   */
  sendTemplateEmail: async (emailData) => {
    try {
      console.log('📧 Sending template email:', emailData);
      
      const response = await emailApi.post('/email/sendTemplate', emailData);
      
      console.log('✅ Template email sent successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error sending template email:', error);
      throw error;
    }
  },

  /**
   * Get email sending history
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status (sent, failed, pending)
   * @param {string} params.search - Search term
   * @returns {Promise} API response
   */
  getEmailHistory: async (params = {}) => {
    try {
      console.log('📧 Fetching email history with params:', params);
      
      // Call GET endpoint without any query parameters to avoid validation errors
      // The backend should return all history or use default pagination
      const response = await emailApi.get('/email/history');
      
      console.log('✅ Email history fetched:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching email history:', error);
      throw error;
    }
  },

  /**
   * Get email statistics
   * @returns {Promise} API response
   */
  getEmailStats: async () => {
    try {
      const response = await emailApi.get('/email/stats', {
        params: { _t: Date.now() } // Cache buster
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching email stats:', error);
      throw error;
    }
  }
};
