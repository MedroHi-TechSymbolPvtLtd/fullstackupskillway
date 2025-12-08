/**
 * Authentication utility functions
 */

/**
 * Get the authentication token from local storage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set the authentication token in local storage
 * @param {string} token - The authentication token to store
 */
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove the authentication token from local storage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Parse the JWT token to get user information
 * @param {string} token - The JWT token
 * @returns {Object|null} The decoded token payload or null if invalid
 */
export const parseToken = (token) => {
  if (!token) return null;
  
  try {
    // Split the token and get the payload (second part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Get user information from the stored token
 * @returns {Object|null} User information or null if not authenticated
 */
export const getUserInfo = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  return parseToken(token);
};