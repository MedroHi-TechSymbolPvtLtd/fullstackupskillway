import { authApi } from './apiConfig';

class WhatsAppService {
  constructor() {
    this.baseURL = '/api/v1/whatsapp';
  }

  // Send Single WhatsApp Message
  async sendSingleMessage(messageData) {
    try {
      console.log('📱 WhatsApp Service - Sending single message:', messageData);
      
      const response = await authApi.post(`${this.baseURL}/send`, messageData);
      
      if (response.data.success) {
        console.log('✅ Single message sent successfully:', response.data);
        return response.data;
      } else {
        console.warn('⚠️ Single message send failed:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error sending single message:', error);
      throw error;
    }
  }

  // Send Bulk WhatsApp Messages
  async sendBulkMessages(messagesData) {
    try {
      console.log('📱 WhatsApp Service - Sending bulk messages:', messagesData);
      
      const response = await authApi.post(`${this.baseURL}/send-bulk`, messagesData);
      
      if (response.data.success) {
        console.log('✅ Bulk messages sent successfully:', response.data);
        return response.data;
      } else {
        console.warn('⚠️ Bulk messages send failed:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error sending bulk messages:', error);
      throw error;
    }
  }

  // Get WhatsApp Message History
  async getMessageHistory(params = {}) {
    try {
      console.log('📱 WhatsApp Service - Fetching message history:', params);
      
      const queryParams = new URLSearchParams();
      
      if (params.phoneNumber) queryParams.append('phoneNumber', params.phoneNumber);
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);
      
      // Add cache buster
      queryParams.append('_t', Date.now());
      
      const queryString = queryParams.toString();
      const url = `${this.baseURL}/history?${queryString}`;
      
      const response = await authApi.get(url);
      
      if (response.data.success) {
        console.log('✅ Message history fetched successfully:', response.data);
        return response.data;
      } else {
        console.warn('⚠️ Message history fetch failed:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error fetching message history:', error);
      throw error;
    }
  }

  // Get WhatsApp Message Statistics
  async getStatistics() {
    try {
      console.log('📱 WhatsApp Service - Fetching statistics');
      
      const response = await authApi.get(`${this.baseURL}/statistics`, {
        params: { _t: Date.now() } // Cache buster
      });
      
      if (response.data.success) {
        console.log('✅ Statistics fetched successfully:', response.data);
        return response.data;
      } else {
        console.warn('⚠️ Statistics fetch failed:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw error;
    }
  }

  // Helper method to format phone number
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.length === 10) {
      return `91${cleaned}`; // Default to India country code
    }
    
    return cleaned;
  }

  // Helper method to validate phone number
  validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  // Helper method to validate message
  validateMessage(message) {
    return message && message.trim().length > 0 && message.trim().length <= 4096;
  }

  // Helper method to create message data structure
  createMessageData(phoneNumber, message, options = {}) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    
    const messageData = {
      phoneNumber: formattedPhone,
      message: message.trim()
    };

    // Add optional fields
    if (options.firstName) messageData.firstName = options.firstName;
    if (options.lastName) messageData.lastName = options.lastName;
    if (options.email) messageData.email = options.email;
    if (options.languageCode) messageData.languageCode = options.languageCode;
    if (options.country) messageData.country = options.country;
    if (options.media) messageData.media = options.media;

    return messageData;
  }

  // Helper method to create bulk message data structure
  createBulkMessageData(messages) {
    return {
      messages: messages.map(msg => this.createMessageData(msg.phoneNumber, msg.message, {
        firstName: msg.firstName,
        lastName: msg.lastName,
        email: msg.email,
        languageCode: msg.languageCode,
        country: msg.country,
        media: msg.media
      }))
    };
  }
}

// Create and export a singleton instance
const whatsappService = new WhatsAppService();
export default whatsappService;
