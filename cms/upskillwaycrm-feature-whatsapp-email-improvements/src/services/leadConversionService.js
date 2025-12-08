// Lead Conversion Service - Orchestrates lead to college conversion process
import { authApi } from './api/apiConfig';
import collegesApi from './api/collegesApi';

class LeadConversionService {
  constructor() {
    this.conversionInProgress = new Set(); // Track ongoing conversions to prevent duplicates
  }

  /**
   * Main orchestration method for handling lead status updates
   * Detects conversion events and triggers the conversion process
   * @param {number} leadId - The ID of the lead being updated
   * @param {string} newStatus - The new status being set
   * @param {string} oldStatus - The previous status
   * @returns {Promise<Object>} Conversion result
   */
  async handleLeadStatusUpdate(leadId, newStatus, oldStatus) {
    try {
      console.log(`🔄 Lead Conversion - Handling status update for lead ${leadId}: ${oldStatus} → ${newStatus}`);

      // Only process if status is changing to 'CONVERTED'
      if (newStatus !== 'CONVERTED' || oldStatus === 'CONVERTED') {
        console.log(`ℹ️ Lead Conversion - No conversion needed for lead ${leadId}`);
        return {
          success: true,
          converted: false,
          message: 'No conversion required'
        };
      }

      // Check if conversion is already in progress
      if (this.conversionInProgress.has(leadId)) {
        console.log(`⚠️ Lead Conversion - Conversion already in progress for lead ${leadId}`);
        return {
          success: false,
          error: 'Conversion already in progress',
          message: 'Please wait for the current conversion to complete'
        };
      }

      // Mark conversion as in progress
      this.conversionInProgress.add(leadId);

      try {
        // Fetch the lead data with fallback to localStorage
        let lead = null;
        
        try {
          // Try API first
          const leadResponse = await authApi.get(`/api/v1/leads/${leadId}`);
          
          if (leadResponse.data.success) {
            lead = leadResponse.data.data;
            console.log(`✅ Lead Conversion - Lead data fetched from API for ${leadId}:`, lead);
          } else {
            throw new Error(`API failed: ${leadResponse.data.message}`);
          }
        } catch (apiError) {
          console.log(`⚠️ Lead Conversion - API failed, using localStorage fallback:`, apiError.message);
          
          // Fallback to localStorage
          lead = this.getLeadFromStorage(leadId);
          
          if (!lead) {
            throw new Error(`Lead ${leadId} not found in localStorage`);
          }
          
          console.log(`✅ Lead Conversion - Lead data fetched from localStorage for ${leadId}:`, lead);
        }

        // Trigger the conversion process
        const conversionResult = await this.convertLeadToCollege(lead);

        console.log(`🎉 Lead Conversion - Conversion completed for lead ${leadId}:`, conversionResult);
        return conversionResult;

      } finally {
        // Always remove from in-progress set
        this.conversionInProgress.delete(leadId);
      }

    } catch (error) {
      console.error(`❌ Lead Conversion - Error handling status update for lead ${leadId}:`, error);
      
      // Remove from in-progress set on error
      this.conversionInProgress.delete(leadId);

      return {
        success: false,
        error: error.message,
        message: `Failed to process conversion for lead ${leadId}: ${error.message}`
      };
    }
  }

  /**
   * Main conversion coordinator method
   * Orchestrates the entire lead-to-college conversion process
   * @param {Object} lead - The lead object to convert
   * @returns {Promise<Object>} Conversion result with college information
   */
  async convertLeadToCollege(lead) {
    try {
      console.log(`🔄 Lead Conversion - Starting conversion process for lead:`, lead);

      // Validate lead data
      if (!lead || !lead.id) {
        throw new Error('Invalid lead data provided');
      }

      // Check if lead already has a linked college
      if (lead.linkedCollegeId) {
        console.log(`ℹ️ Lead Conversion - Lead ${lead.id} already linked to college ${lead.linkedCollegeId}`);
        return {
          success: true,
          converted: false,
          alreadyLinked: true,
          collegeId: lead.linkedCollegeId,
          message: 'Lead is already linked to a college'
        };
      }

      // Determine college name from lead data
      const collegeName = this.extractCollegeName(lead);
      console.log(`📝 Lead Conversion - College name determined: "${collegeName}"`);

      // Check for existing college with the same name
      const existingCollege = await this.findExistingCollege(collegeName);

      let college;
      let isNewCollege = false;

      if (existingCollege) {
        // Link to existing college
        console.log(`🔗 Lead Conversion - Linking to existing college:`, existingCollege);
        college = existingCollege;
        
        // Update the lead with college link
        await this.linkLeadToCollege(lead.id, college.id);
        
      } else {
        // Create new college
        console.log(`🏗️ Lead Conversion - Creating new college for lead ${lead.id}`);
        console.log(`🏗️ Lead Conversion - Lead data for college creation:`, lead);
        
        college = await this.createCollegeFromLead(lead);
        isNewCollege = true;
        
        console.log(`🏗️ Lead Conversion - College created, now linking to lead...`);
        console.log(`🏗️ Lead Conversion - College object:`, college);
        
        // Link the lead to the new college
        await this.linkLeadToCollege(lead.id, college.id);
        
        console.log(`✅ Lead Conversion - Lead ${lead.id} linked to college ${college.id}`);
      }

      // Log the conversion activity
      await this.logConversionActivity(
        lead.id, 
        college.id, 
        isNewCollege ? 'CREATED' : 'LINKED',
        {
          collegeName: college.name,
          leadName: lead.name,
          organizationName: lead.organization,
          isNewCollege
        }
      );

      // Send success notification
      await this.notifyConversionSuccess(lead, college, isNewCollege);

      console.log(`🎉 Lead Conversion - Successfully completed conversion for lead ${lead.id}`);

      return {
        success: true,
        converted: true,
        isNewCollege,
        college: {
          id: college.id,
          name: college.name,
          status: college.status
        },
        lead: {
          id: lead.id,
          name: lead.name,
          linkedCollegeId: college.id
        },
        message: isNewCollege 
          ? `Successfully created new college "${college.name}" and linked to lead`
          : `Successfully linked lead to existing college "${college.name}"`
      };

    } catch (error) {
      console.error(`❌ Lead Conversion - Error in conversion process:`, error);

      // Log the failed conversion
      await this.logConversionActivity(
        lead.id,
        null,
        'FAILED',
        {
          error: error.message,
          leadName: lead.name,
          organizationName: lead.organization
        }
      );

      // Send error notification
      await this.notifyConversionError(lead, error);

      throw error;
    }
  }

  /**
   * Extracts college name from lead data
   * Uses organization field first, falls back to lead name
   * @param {Object} lead - The lead object
   * @returns {string} The college name to use
   */
  extractCollegeName(lead) {
    // Use organization field if available and not empty
    if (lead.organization && lead.organization.trim()) {
      return lead.organization.trim();
    }

    // Fallback to lead name
    if (lead.name && lead.name.trim()) {
      return lead.name.trim();
    }

    // Last resort fallback
    return `College for Lead ${lead.id}`;
  }

  /**
   * Finds existing college with duplicate detection
   * Implements case-insensitive name matching with whitespace trimming
   * @param {string} organizationName - Name to search for
   * @returns {Promise<Object|null>} Existing college or null
   */
  async findExistingCollege(organizationName) {
    try {
      console.log(`🔍 Lead Conversion - Searching for existing college: "${organizationName}"`);

      if (!organizationName || !organizationName.trim()) {
        console.log(`⚠️ Lead Conversion - Empty organization name provided`);
        return null;
      }

      // Normalize the search term
      const normalizedName = this.normalizeCollegeName(organizationName);
      console.log(`🔍 Lead Conversion - Normalized search term: "${normalizedName}"`);

      // Search for colleges with similar names using enhanced search
      const searchResponse = await collegesApi.searchCollegesByName(normalizedName, {
        limit: 50, // Get more results for better matching
        status: 'ACTIVE' // Only search active colleges
      });

      if (!searchResponse.success || !searchResponse.data) {
        console.log(`ℹ️ Lead Conversion - No colleges found in search`);
        return null;
      }

      const colleges = searchResponse.data;
      console.log(`🔍 Lead Conversion - Found ${colleges.length} colleges to check for duplicates`);

      // Find exact matches first (case-insensitive, trimmed)
      for (const college of colleges) {
        if (this.isExactMatch(normalizedName, college.name)) {
          console.log(`✅ Lead Conversion - Found exact match: "${college.name}" (ID: ${college.id})`);
          return college;
        }
      }

      // Find fuzzy matches if no exact match
      for (const college of colleges) {
        if (this.isFuzzyMatch(normalizedName, college.name)) {
          console.log(`✅ Lead Conversion - Found fuzzy match: "${college.name}" (ID: ${college.id})`);
          return college;
        }
      }

      console.log(`ℹ️ Lead Conversion - No matching college found for "${organizationName}"`);
      return null;

    } catch (error) {
      console.error(`❌ Lead Conversion - Error searching for existing college:`, error);
      // Don't throw error - just return null to create new college
      return null;
    }
  }

  /**
   * Creates a new college from lead data
   * Maps lead fields to college fields according to requirements
   * @param {Object} lead - The lead object
   * @returns {Promise<Object>} Created college object
   */
  async createCollegeFromLead(lead) {
    try {
      console.log(`🏗️ Lead Conversion - Creating college from lead:`, lead);

      // Validate lead data
      if (!lead || !lead.id) {
        throw new Error('Invalid lead data provided for college creation');
      }

      console.log(`🏗️ Lead Conversion - Calling collegesApi.createCollegeFromLead...`);

      // Use the enhanced college creation method
      const createResponse = await collegesApi.createCollegeFromLead(lead);

      console.log(`🏗️ Lead Conversion - createCollegeFromLead response:`, createResponse);

      if (!createResponse.success) {
        console.error(`❌ Lead Conversion - College creation failed:`, createResponse);
        throw new Error(`Failed to create college: ${createResponse.message || 'Unknown error'}`);
      }

      const createdCollege = createResponse.data;
      console.log(`✅ Lead Conversion - College created successfully:`, createdCollege);

      // Verify the college was actually stored
      console.log(`🔍 Lead Conversion - Verifying college storage...`);
      const verifyResponse = await collegesApi.getAllColleges({ limit: 100 });
      console.log(`🔍 Lead Conversion - All colleges after creation:`, verifyResponse);

      return createdCollege;

    } catch (error) {
      console.error(`❌ Lead Conversion - Error creating college from lead:`, error);
      throw new Error(`Failed to create college: ${error.message}`);
    }
  }

  /**
   * Links a lead to a college by updating both records
   * Establishes bidirectional relationship as per requirements
   * @param {number} leadId - The lead ID
   * @param {number} collegeId - The college ID
   * @returns {Promise<void>}
   */
  async linkLeadToCollege(leadId, collegeId) {
    try {
      console.log(`🔗 Lead Conversion - Linking lead ${leadId} to college ${collegeId}`);

      // Get lead data for college update
      let leadData = null;
      try {
        const leadResponse = await authApi.get(`/api/v1/leads/${leadId}`);
        if (leadResponse.data.success) {
          leadData = leadResponse.data.data;
        }
      } catch (leadError) {
        console.log(`⚠️ Lead Conversion - Could not fetch lead data for college update:`, leadError.message);
      }

      // Update the lead record with college link and conversion date
      const leadUpdateData = {
        linkedCollegeId: collegeId,
        conversionDate: new Date().toISOString(),
        status: 'CONVERTED' // Ensure status is set to CONVERTED
      };

      console.log(`🔗 Lead Conversion - Updating lead ${leadId} with:`, leadUpdateData);

      const leadUpdateResponse = await authApi.put(`/api/v1/leads/${leadId}`, leadUpdateData);

      if (!leadUpdateResponse.data.success) {
        throw new Error(`Failed to update lead: ${leadUpdateResponse.data.message || 'Unknown error'}`);
      }

      console.log(`✅ Lead Conversion - Lead ${leadId} updated successfully`);

      // Update the college record with source lead information using enhanced API
      if (leadData) {
        try {
          console.log(`🔗 Lead Conversion - Updating college ${collegeId} with lead info`);

          const collegeUpdateResponse = await collegesApi.updateCollegeWithLeadInfo(collegeId, leadData);

          if (collegeUpdateResponse.success) {
            console.log(`✅ Lead Conversion - College ${collegeId} updated successfully with lead info`);
          } else {
            console.log(`⚠️ Lead Conversion - College update failed but continuing: ${collegeUpdateResponse.message}`);
          }

        } catch (collegeError) {
          // Don't fail the entire process if college update fails
          console.log(`⚠️ Lead Conversion - College update failed but continuing:`, collegeError.message);
        }
      }

      console.log(`🎉 Lead Conversion - Successfully linked lead ${leadId} to college ${collegeId}`);

    } catch (error) {
      console.error(`❌ Lead Conversion - Error linking lead to college:`, error);
      throw new Error(`Failed to link lead to college: ${error.message}`);
    }
  }

  /**
   * Sends success notification for completed conversion
   * Creates user-friendly notification with college details and action links
   * @param {Object} lead - The lead object
   * @param {Object} college - The college object
   * @param {boolean} isNewCollege - Whether college was newly created
   * @returns {Promise<void>}
   */
  async notifyConversionSuccess(lead, college, isNewCollege) {
    try {
      console.log(`📢 Lead Conversion - Sending success notification for lead ${lead.id}, college ${college.id}, new: ${isNewCollege}`);

      const notification = {
        type: 'success',
        title: isNewCollege ? 'College Created Successfully' : 'Lead Linked to Existing College',
        message: isNewCollege 
          ? `Successfully created new college "${college.name}" and linked lead "${lead.name}"`
          : `Successfully linked lead "${lead.name}" to existing college "${college.name}"`,
        data: {
          leadId: lead.id,
          leadName: lead.name,
          collegeId: college.id,
          collegeName: college.name,
          isNewCollege,
          conversionDate: new Date().toISOString(),
          actionUrl: `/crm/colleges/${college.id}`, // Direct link to view college
          secondaryActionUrl: `/crm/leads/${lead.id}` // Link to view lead
        },
        timestamp: new Date().toISOString(),
        category: 'lead_conversion'
      };

      // Store notification in localStorage for now (can be enhanced to use a proper notification service)
      this.storeNotification(notification);

      // Also trigger browser notification if supported
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }

      console.log(`✅ Lead Conversion - Success notification sent:`, notification);

    } catch (error) {
      console.error(`❌ Lead Conversion - Error sending success notification:`, error);
      // Don't throw error - notification failure shouldn't break conversion
    }
  }

  /**
   * Sends error notification for failed conversion
   * Creates user-friendly error notification with specific failure details
   * @param {Object} lead - The lead object
   * @param {Error} error - The error that occurred
   * @returns {Promise<void>}
   */
  async notifyConversionError(lead, error) {
    try {
      console.log(`📢 Lead Conversion - Sending error notification for lead ${lead.id}:`, error.message);

      const notification = {
        type: 'error',
        title: 'Lead Conversion Failed',
        message: `Failed to convert lead "${lead.name}" to college: ${error.message}`,
        data: {
          leadId: lead.id,
          leadName: lead.name,
          error: error.message,
          errorCode: error.code || 'CONVERSION_ERROR',
          timestamp: new Date().toISOString(),
          actionUrl: `/crm/leads/${lead.id}`, // Link to view lead
          retryAction: true // Indicate that retry is possible
        },
        timestamp: new Date().toISOString(),
        category: 'lead_conversion_error'
      };

      // Store notification
      this.storeNotification(notification);

      // Trigger browser notification for errors (important)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }

      console.log(`✅ Lead Conversion - Error notification sent:`, notification);

    } catch (notificationError) {
      console.error(`❌ Lead Conversion - Error sending error notification:`, notificationError);
      // Don't throw error - notification failure shouldn't break the process
    }
  }

  /**
   * Logs conversion activity for audit trail
   * Creates detailed audit entries for all conversion activities
   * @param {number} leadId - The lead ID
   * @param {number|null} collegeId - The college ID (null for failed conversions)
   * @param {string} action - The action performed (CREATED, LINKED, FAILED)
   * @param {Object} details - Additional details to log
   * @returns {Promise<void>}
   */
  async logConversionActivity(leadId, collegeId, action, details) {
    try {
      console.log(`📝 Lead Conversion - Creating audit log: Lead ${leadId}, College ${collegeId}, Action: ${action}`, details);

      const auditEntry = {
        id: Date.now() + Math.random(), // Simple ID generation for now
        leadId,
        collegeId,
        action,
        details: {
          ...details,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
          timestamp: new Date().toISOString(),
          sessionId: this.getSessionId()
        },
        timestamp: new Date().toISOString(),
        userId: this.getCurrentUserId(), // Will get from auth context
        success: action !== 'FAILED'
      };

      // Store audit entry in localStorage for now (can be enhanced to use proper audit service/API)
      this.storeAuditEntry(auditEntry);

      // Also log to console for debugging
      console.log(`✅ Lead Conversion - Audit entry created:`, auditEntry);

      // In a real implementation, this would also send to an audit API endpoint
      // await authApi.post('/api/v1/audit/conversion', auditEntry);

    } catch (error) {
      console.error(`❌ Lead Conversion - Error creating audit log:`, error);
      // Don't throw error - audit failure shouldn't break conversion
    }
  }

  /**
   * Utility method to check if a lead is eligible for conversion
   * @param {Object} lead - The lead object
   * @returns {boolean} Whether the lead can be converted
   */
  isLeadEligibleForConversion(lead) {
    if (!lead) return false;
    if (lead.status !== 'CONVERTED') return false;
    if (lead.linkedCollegeId) return false; // Already converted
    return true;
  }

  /**
   * Get conversion status for a lead
   * @param {number} leadId - The lead ID
   * @returns {Promise<Object>} Conversion status information
   */
  async getConversionStatus(leadId) {
    try {
      const leadResponse = await authApi.get(`/api/v1/leads/${leadId}`);
      
      if (!leadResponse.data.success) {
        throw new Error(`Failed to fetch lead: ${leadResponse.data.message}`);
      }

      const lead = leadResponse.data.data;
      
      return {
        success: true,
        leadId: lead.id,
        status: lead.status,
        linkedCollegeId: lead.linkedCollegeId,
        conversionDate: lead.conversionDate,
        isConverted: lead.status === 'CONVERTED',
        hasLinkedCollege: !!lead.linkedCollegeId,
        inProgress: this.conversionInProgress.has(leadId)
      };

    } catch (error) {
      console.error(`❌ Lead Conversion - Error getting conversion status for lead ${leadId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper Methods for Duplicate Detection

  /**
   * Normalizes college name for comparison
   * Trims whitespace, converts to lowercase, removes extra spaces
   * @param {string} name - The name to normalize
   * @returns {string} Normalized name
   */
  normalizeCollegeName(name) {
    if (!name) return '';
    
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s]/g, '') // Remove special characters except spaces
      .trim();
  }

  /**
   * Checks for exact match between normalized names
   * @param {string} searchName - The search term (normalized)
   * @param {string} collegeName - The college name to compare
   * @returns {boolean} Whether names match exactly
   */
  isExactMatch(searchName, collegeName) {
    if (!searchName || !collegeName) return false;
    
    const normalizedCollegeName = this.normalizeCollegeName(collegeName);
    return searchName === normalizedCollegeName;
  }

  /**
   * Checks for fuzzy match between names
   * Handles common variations like Inc, Corp, Ltd, University, College
   * @param {string} searchName - The search term (normalized)
   * @param {string} collegeName - The college name to compare
   * @returns {boolean} Whether names match with fuzzy logic
   */
  isFuzzyMatch(searchName, collegeName) {
    if (!searchName || !collegeName) return false;
    
    const normalizedCollegeName = this.normalizeCollegeName(collegeName);
    
    // Remove common business/institution suffixes for comparison
    const suffixes = [
      'inc', 'corp', 'corporation', 'ltd', 'limited', 'llc',
      'university', 'college', 'institute', 'institution', 'school',
      'academy', 'center', 'centre'
    ];
    
    let cleanSearchName = searchName;
    let cleanCollegeName = normalizedCollegeName;
    
    // Remove suffixes from both names
    suffixes.forEach(suffix => {
      const suffixPattern = new RegExp(`\\s+${suffix}$`, 'i');
      cleanSearchName = cleanSearchName.replace(suffixPattern, '');
      cleanCollegeName = cleanCollegeName.replace(suffixPattern, '');
    });
    
    // Check if cleaned names match
    if (cleanSearchName === cleanCollegeName) {
      return true;
    }
    
    // Check if one name contains the other (for partial matches)
    if (cleanSearchName.length > 3 && cleanCollegeName.length > 3) {
      return cleanSearchName.includes(cleanCollegeName) || 
             cleanCollegeName.includes(cleanSearchName);
    }
    
    return false;
  }

  // Helper Methods for Notifications and Audit

  /**
   * Stores notification in localStorage
   * @param {Object} notification - The notification object
   */
  storeNotification(notification) {
    try {
      const storageKey = 'lead_conversion_notifications';
      const existingNotifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Add new notification to the beginning of the array
      existingNotifications.unshift(notification);
      
      // Keep only the last 50 notifications
      const trimmedNotifications = existingNotifications.slice(0, 50);
      
      localStorage.setItem(storageKey, JSON.stringify(trimmedNotifications));
      
      // Trigger custom event for UI components to listen to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('leadConversionNotification', {
          detail: notification
        }));
      }
      
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  /**
   * Stores audit entry in localStorage
   * @param {Object} auditEntry - The audit entry object
   */
  storeAuditEntry(auditEntry) {
    try {
      const storageKey = 'lead_conversion_audit';
      const existingEntries = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Add new entry to the beginning of the array
      existingEntries.unshift(auditEntry);
      
      // Keep only the last 100 audit entries
      const trimmedEntries = existingEntries.slice(0, 100);
      
      localStorage.setItem(storageKey, JSON.stringify(trimmedEntries));
      
    } catch (error) {
      console.error('Error storing audit entry:', error);
    }
  }

  /**
   * Gets lead data from localStorage (CRM service storage)
   * @param {number} leadId - The lead ID to fetch
   * @returns {Object|null} Lead data or null if not found
   */
  getLeadFromStorage(leadId) {
    try {
      const storageKey = 'crm-data';
      const crmData = JSON.parse(localStorage.getItem(storageKey) || '{"leads": [], "colleges": [], "trainers": [], "users": []}');
      const lead = crmData.leads.find(l => l.id === parseInt(leadId));
      
      if (lead) {
        console.log(`📦 Lead Conversion - Found lead ${leadId} in localStorage:`, lead);
        return lead;
      } else {
        console.log(`📦 Lead Conversion - Lead ${leadId} not found in localStorage`);
        return null;
      }
    } catch (error) {
      console.error(`📦 Lead Conversion - Error getting lead ${leadId} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Gets current session ID (simple implementation)
   * @returns {string} Session ID
   */
  getSessionId() {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('lead_conversion_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('lead_conversion_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  }

  /**
   * Gets current user ID from auth context
   * @returns {number|null} User ID
   */
  getCurrentUserId() {
    try {
      // Try to get user ID from localStorage (where auth token might be stored)
      const token = localStorage.getItem('access_token');
      if (token) {
        // In a real implementation, you'd decode the JWT token to get user ID
        // For now, return a placeholder
        return 1; // Placeholder user ID
      }
      return null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  }

  /**
   * Gets stored notifications
   * @param {number} limit - Maximum number of notifications to return
   * @returns {Array} Array of notifications
   */
  getNotifications(limit = 10) {
    try {
      const storageKey = 'lead_conversion_notifications';
      const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return notifications.slice(0, limit);
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Gets stored audit entries
   * @param {number} limit - Maximum number of entries to return
   * @returns {Array} Array of audit entries
   */
  getAuditEntries(limit = 20) {
    try {
      const storageKey = 'lead_conversion_audit';
      const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return entries.slice(0, limit);
    } catch (error) {
      console.error('Error getting audit entries:', error);
      return [];
    }
  }

  /**
   * Clears old notifications
   * @param {number} olderThanDays - Remove notifications older than this many days
   */
  clearOldNotifications(olderThanDays = 7) {
    try {
      const storageKey = 'lead_conversion_notifications';
      const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      const filteredNotifications = notifications.filter(notification => 
        new Date(notification.timestamp) > cutoffDate
      );
      
      localStorage.setItem(storageKey, JSON.stringify(filteredNotifications));
      
    } catch (error) {
      console.error('Error clearing old notifications:', error);
    }
  }
}

// Create and export singleton instance
const leadConversionService = new LeadConversionService();
export default leadConversionService;
