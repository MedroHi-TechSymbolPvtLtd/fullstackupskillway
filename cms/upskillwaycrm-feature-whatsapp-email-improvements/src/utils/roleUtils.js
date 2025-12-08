import { authUtils } from '../services/utils/authUtils';

/**
 * Role-based access control utility
 * Defines which roles can access which features
 */

// Define role permissions
const ROLE_PERMISSIONS = {
  admin: {
    // Admin has access to everything
    canAccessDashboard: true,
    canAccessCRM: true,
    canAccessCMS: true,
    canAccessSales: true,
    canAccessLeads: true,
    canAccessWhatsApp: true,
    canAccessEmail: true,
    canAccessContent: true,
    canAccessUserManagement: true,
    canAccessTrainerManagement: true,
    canAccessCollegeManagement: true,
    canAccessTrainerBookings: true,
  },
  sales: {
    // Sales users can only access leads, WhatsApp, email, and colleges
    canAccessDashboard: false, // Dashboard is NOT visible to sales users
    canAccessCRM: false,
    canAccessCMS: false,
    canAccessSales: true,
    canAccessLeads: true,
    canAccessWhatsApp: true,
    canAccessEmail: true,
    canAccessContent: false,
    canAccessUserManagement: false,
    canAccessTrainerManagement: false,
    canAccessCollegeManagement: true, // Sales users CAN access colleges
    canAccessTrainerBookings: false,
  },
  // Add more roles as needed
  manager: {
    canAccessDashboard: true,
    canAccessCRM: true,
    canAccessCMS: true,
    canAccessSales: true,
    canAccessLeads: true,
    canAccessWhatsApp: true,
    canAccessEmail: true,
    canAccessContent: true,
    canAccessUserManagement: true,
    canAccessTrainerManagement: true,
    canAccessCollegeManagement: true,
    canAccessTrainerBookings: true,
  },
};

/**
 * Get current user from auth storage
 */
export const getCurrentUser = () => {
  try {
    return authUtils.getUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get current user role
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  if (!user) return null;
  return user.role || null;
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (permission) => {
  const role = getUserRole();
  if (!role) return false;
  
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  
  return permissions[permission] === true;
};

/**
 * Check if user can access a specific route/path
 */
export const canAccessRoute = (path) => {
  const role = getUserRole();
  if (!role) return false;
  
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  
  // Sales users can only access specific routes
  if (role === 'sales') {
    // Dashboard is NOT accessible to sales users
    if (path === '/dashboard') {
      return false; // Block access to main dashboard
    }
    
    if (path.startsWith('/dashboard')) {
      // Check if it's a sales-allowed route
      const allowedPaths = [
        '/dashboard/crm/leads', // Leads
        '/dashboard/sales/whatsapp', // WhatsApp
        '/dashboard/sales/email', // Email
        '/dashboard/crm/colleges', // Colleges
      ];
      
      // Check if path matches any allowed path or is a sub-route of allowed paths
      const isAllowed = allowedPaths.some(allowedPath => 
        path === allowedPath || path.startsWith(allowedPath + '/')
      );
      
      return isAllowed;
    }
    return false;
  }
  
  // Admin and other roles have full access
  if (role === 'admin' || role === 'manager') {
    return true;
  }
  
  return false;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = () => {
  return hasRole('admin');
};

/**
 * Check if user is sales
 */
export const isSales = () => {
  return hasRole('sales');
};

/**
 * Get allowed menu items for current user
 */
export const getAllowedMenuItems = (menuItems, userRole) => {
  if (!userRole) return [];
  
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return [];
  
  // For sales users, filter menu items
  if (userRole === 'sales') {
    return menuItems.filter(item => {
      // Sales users can only see Sales menu with leads, WhatsApp, email, and colleges
      if (item.key === 'sales') {
        return true; // Show sales menu
      }
      // Hide dashboard for sales users
      if (item.key === 'dashboard') {
        return false; // Hide dashboard
      }
      // Hide CRM and CMS menus
      return false;
    });
  }
  
  // Admin and other roles see all menus
  return menuItems;
};

/**
 * Filter menu items based on role
 */
export const filterMenuItemsByRole = (menuItems, userRole) => {
  if (!userRole) return menuItems;
  
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return menuItems;
  
  // For sales users, filter sub-items
  if (userRole === 'sales') {
    return menuItems.map(menu => {
      if (menu.key === 'sales') {
        // Show leads, WhatsApp, email, and colleges in sales menu
        return {
          ...menu,
          items: menu.items.filter(item => 
            item.key === 'leads' || 
            item.key === 'whatsapp' || 
            item.key === 'email' ||
            item.key === 'colleges'
          ),
        };
      }
      if (menu.key === 'crm') {
        // Hide CRM menu for sales users (but we'll add colleges to sales menu)
        return null;
      }
      if (menu.key === 'cms') {
        // Hide CMS menu for sales users
        return null;
      }
      if (menu.key === 'dashboard') {
        // Hide dashboard for sales users
        return null;
      }
      return menu;
    }).filter(Boolean); // Remove null items
  }
  
  // Admin and other roles see all menus
  return menuItems;
};

export default {
  getCurrentUser,
  getUserRole,
  hasPermission,
  canAccessRoute,
  hasRole,
  isAdmin,
  isSales,
  getAllowedMenuItems,
  filterMenuItemsByRole,
  ROLE_PERMISSIONS,
};

