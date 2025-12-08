import toast from 'react-hot-toast';

/**
 * Custom Toast Utility
 * Provides consistent toast notifications throughout the application
 */
export const toastUtils = {
  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {object} options - Additional options
   */
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      ...options,
    });
  },

  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {object} options - Additional options
   */
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      ...options,
    });
  },

  /**
   * Show loading toast
   * @param {string} message - Loading message
   * @param {object} options - Additional options
   */
  loading: (message, options = {}) => {
    return toast.loading(message, {
      duration: Infinity,
      ...options,
    });
  },

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {object} options - Additional options
   */
  info: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      },
      ...options,
    });
  },

  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {object} options - Additional options
   */
  warning: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      style: {
        background: '#F59E0B',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
      },
      ...options,
    });
  },

  /**
   * Show delete confirmation modal
   * @param {string} itemName - Name of item being deleted
   * @param {string} itemType - Type of item (e.g., "Blog", "Lead")
   * @param {function} onConfirm - Function to call on confirmation
   * @param {function} onCancel - Function to call on cancellation
   * @param {boolean} isLoading - Whether delete operation is in progress
   * @returns {Object} Modal state object with show/hide functions
   */
  deleteConfirmation: (itemName, itemType = "Item", onConfirm, onCancel, isLoading = false) => {
    // This will be handled by the component using the modal
    // Return a function that can be called to show the modal
    return {
      show: () => {
        // This will be implemented in the component
        console.log('Show delete confirmation modal for:', itemName);
      },
      hide: () => {
        // This will be implemented in the component
        console.log('Hide delete confirmation modal');
      }
    };
  },

  /**
   * Show CRUD operation toasts
   */
  crud: {
    /**
     * Show create success toast
     * @param {string} itemType - Type of item created (e.g., "Blog", "Lead")
     */
    created: (itemType) => {
      return toastUtils.success(`${itemType} created successfully!`);
    },

    /**
     * Show update success toast
     * @param {string} itemType - Type of item updated
     */
    updated: (itemType) => {
      return toastUtils.success(`${itemType} updated successfully!`);
    },

    /**
     * Show delete success toast
     * @param {string} itemType - Type of item deleted
     */
    deleted: (itemType) => {
      return toastUtils.success(`${itemType} deleted successfully!`);
    },

    /**
     * Show create error toast
     * @param {string} itemType - Type of item that failed to create
     * @param {string} error - Error message
     */
    createError: (itemType, error = '') => {
      return toastUtils.error(`Failed to create ${itemType.toLowerCase()}. ${error}`);
    },

    /**
     * Show update error toast
     * @param {string} itemType - Type of item that failed to update
     * @param {string} error - Error message
     */
    updateError: (itemType, error = '') => {
      return toastUtils.error(`Failed to update ${itemType.toLowerCase()}. ${error}`);
    },

    /**
     * Show delete error toast
     * @param {string} itemType - Type of item that failed to delete
     * @param {string} error - Error message
     */
    deleteError: (itemType, error = '') => {
      return toastUtils.error(`Failed to delete ${itemType.toLowerCase()}. ${error}`);
    },

    /**
     * Show fetch error toast
     * @param {string} itemType - Type of item that failed to fetch
     * @param {string} error - Error message
     */
    fetchError: (itemType, error = '') => {
      return toastUtils.error(`Failed to load ${itemType.toLowerCase()}s. ${error}`);
    },
  },

  /**
   * Show authentication toasts
   */
  auth: {
    loginSuccess: () => toastUtils.success('Logged in successfully!'),
    loginError: (error = '') => toastUtils.error(`Login failed. ${error}`),
    logoutSuccess: () => toastUtils.success('Logged out successfully!'),
    logoutError: (error = '') => toastUtils.error(`Logout failed. ${error}`),
    sessionExpired: () => toastUtils.warning('Session expired. Please log in again.'),
    unauthorized: () => toastUtils.error('You are not authorized to perform this action.'),
  },

  /**
   * Show form validation toasts
   */
  validation: {
    required: (field) => toastUtils.error(`${field} is required.`),
    invalid: (field) => toastUtils.error(`Please enter a valid ${field.toLowerCase()}.`),
    minLength: (field, min) => toastUtils.error(`${field} must be at least ${min} characters.`),
    maxLength: (field, max) => toastUtils.error(`${field} must be no more than ${max} characters.`),
    email: () => toastUtils.error('Please enter a valid email address.'),
    phone: () => toastUtils.error('Please enter a valid phone number.'),
    url: () => toastUtils.error('Please enter a valid URL.'),
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Dismiss specific toast
   * @param {string} toastId - ID of toast to dismiss
   */
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export default toastUtils;
