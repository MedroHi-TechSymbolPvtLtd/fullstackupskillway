/**
 * DateTime utility functions for consistent date/time handling
 */

/**
 * Formats a date/time value to ISO string format
 * @param {Date|string|number} dateTime - The date/time value to format
 * @returns {string|null} ISO formatted datetime string or null if invalid
 */
export const formatToISO = (dateTime) => {
  if (!dateTime) return null;
  
  try {
    // If it's already a Date object, convert to ISO string
    if (dateTime instanceof Date) {
      return dateTime.toISOString();
    }
    
    // If it's a string, try to parse and convert to ISO
    if (typeof dateTime === 'string') {
      const parsed = new Date(dateTime);
      if (isNaN(parsed.getTime())) {
        console.warn(`Invalid date format: ${dateTime}`);
        return null;
      }
      return parsed.toISOString();
    }
    
    // If it's a number (timestamp), convert to Date then ISO
    if (typeof dateTime === 'number') {
      const parsed = new Date(dateTime);
      if (isNaN(parsed.getTime())) {
        console.warn(`Invalid timestamp: ${dateTime}`);
        return null;
      }
      return parsed.toISOString();
    }
    
    return null;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return null;
  }
};

/**
 * Formats a date/time value to local datetime string for display
 * @param {Date|string|number} dateTime - The date/time value to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted datetime string for display
 */
export const formatForDisplay = (dateTime, options = {}) => {
  if (!dateTime) return '';
  
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return date.toLocaleString('en-US', defaultOptions);
  } catch (error) {
    console.error('Error formatting datetime for display:', error);
    return '';
  }
};

/**
 * Validates if a datetime string is in proper ISO format
 * @param {string} dateTime - The datetime string to validate
 * @returns {boolean} True if valid ISO format
 */
export const isValidISO = (dateTime) => {
  if (!dateTime || typeof dateTime !== 'string') return false;
  
  try {
    const date = new Date(dateTime);
    return !isNaN(date.getTime()) && dateTime === date.toISOString();
  } catch (error) {
    return false;
  }
};

/**
 * Creates a datetime string for a specific date and time
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {string} ISO formatted datetime string
 */
export const createDateTime = (date, time) => {
  try {
    const dateTime = new Date(`${date}T${time}:00`);
    if (isNaN(dateTime.getTime())) {
      throw new Error('Invalid date or time format');
    }
    return dateTime.toISOString();
  } catch (error) {
    console.error('Error creating datetime:', error);
    return null;
  }
};

/**
 * Gets current datetime in ISO format
 * @returns {string} Current datetime in ISO format
 */
export const getCurrentISO = () => {
  return new Date().toISOString();
};

/**
 * Adds time to a datetime
 * @param {string|Date} dateTime - Base datetime
 * @param {number} hours - Hours to add
 * @param {number} minutes - Minutes to add (optional)
 * @returns {string} New datetime in ISO format
 */
export const addTime = (dateTime, hours = 0, minutes = 0) => {
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid base datetime');
    }
    
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    
    return date.toISOString();
  } catch (error) {
    console.error('Error adding time to datetime:', error);
    return null;
  }
};

export default {
  formatToISO,
  formatForDisplay,
  isValidISO,
  createDateTime,
  getCurrentISO,
  addTime
};
