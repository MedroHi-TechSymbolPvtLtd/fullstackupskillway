/**
 * Admin Configuration
 * 
 * IMPORTANT: These are hardcoded admin credentials for the CMS.
 * In production, you should:
 * 1. Change these credentials to strong, unique values
 * 2. Consider using environment variables for additional security
 * 3. Implement proper admin user management if needed
 * 
 * To change admin credentials:
 * 1. Update the values below
 * 2. Restart the application
 * 3. Use the new credentials to login via POST /api/v1/admin/login
 */

export const ADMIN_CONFIG = {
  // Admin email - change this in production
  email: process.env.ADMIN_EMAIL || 'admin@upskillway.com',
  
  // Admin password - change this in production
  password: process.env.ADMIN_PASSWORD || 'admin123',
  
  // Admin role identifier
  role: 'admin' as const,
  
  // Admin display name
  name: 'UpSkillWay Admin',
};

// Validation function to check admin credentials
export const validateAdminCredentials = (email: string, password: string): boolean => {
  return email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password;
};

// Get admin profile data
export const getAdminProfile = () => ({
  id: 'ae6f528c-9909-4668-8106-b063114ace5a', // Actual UUID from database
  email: ADMIN_CONFIG.email,
  name: ADMIN_CONFIG.name,
  role: ADMIN_CONFIG.role,
});
