import { authApi } from './apiConfig';
import { API_ENDPOINTS } from './apiConfig';
import { authUtils } from '../utils/authUtils';

// Create the service object
const authApiService = {
  // Health check
  healthCheck: () => {
    return authApi.get(API_ENDPOINTS.AUTH.HEALTHZ);
  },

  // Login - supports both admin and user login
  login: (credentials, isAdmin = false) => {
    const endpoint = isAdmin ? API_ENDPOINTS.AUTH.ADMIN_LOGIN : API_ENDPOINTS.AUTH.LOGIN;
    const loginType = isAdmin ? 'Admin' : 'User';
    
    console.log(`🔐 authApi.login called (${loginType}) with:`, credentials);
    console.log('📍 Using endpoint:', endpoint);
    console.log('🌐 Full URL will be:', `${authApi.defaults.baseURL}${endpoint}`);
    
    return authApi.post(endpoint, credentials)
      .then(response => {
        console.log(`✅ authApi.login (${loginType}) success response:`, response);
        console.log('📦 Response data:', response.data);
        return response;
      })
      .catch(error => {
        console.error(`❌ authApi.login (${loginType}) error:`, error);
        console.error('📊 Error response:', error.response);
        console.error('📊 Error response data:', error.response?.data);
        console.error('📊 Error response status:', error.response?.status);
        console.error('📊 Error response headers:', error.response?.headers);
        throw error;
      });
  },

  // Admin login (alias for clarity)
  adminLogin: (credentials) => {
    const endpoint = API_ENDPOINTS.AUTH.ADMIN_LOGIN;
    return authApi.post(endpoint, credentials);
  },

  // User login (alias for clarity)
  userLogin: (credentials) => {
    const endpoint = API_ENDPOINTS.AUTH.LOGIN;
    return authApi.post(endpoint, credentials);
  },

  // Google OAuth login
  googleLogin: (googleData) => {
    return authApi.post(API_ENDPOINTS.AUTH.LOGIN, {
      google_id: googleData.google_id,
      email: googleData.email,
      username: googleData.username || googleData.name,
      profile_pic: googleData.profile_pic || googleData.picture,
      isVerified: googleData.isVerified || true
    });
  },

  // Logout
  logout: () => {
    const refreshToken = authUtils.getRefreshToken();
    
    console.log('authApi.logout called with refreshToken:', refreshToken ? 'present' : 'missing');
    
    return authApi.post(API_ENDPOINTS.AUTH.LOGOUT, {
      refreshToken: refreshToken
    }).then(response => {
      console.log('authApi.logout response:', response);
      return response;
    }).catch(error => {
      console.error('authApi.logout error:', error);
      throw error;
    });
  },
  
  // Refresh token
  refreshToken: (refreshToken) => {
    return authApi.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken
    });
  },

  // Forgot password
  forgotPassword: (email) => {
    return authApi.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
  
  // Reset password
  resetPassword: (token, newPassword) => {
    return authApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password: newPassword
    });
  },

  // Verify email
  verifyEmail: (token) => {
    return authApi.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  },

  // Get current user profile (this might be handled by profiles service)
  getProfile: () => {
    console.log('authApi.getProfile called');
    // Use the correct endpoint for getting user profile
    return authApi.get(API_ENDPOINTS.PROFILES.ME);
  },

  // Update profile (this might be handled by profiles service)
  updateProfile: (profileData) => {
    return authApi.put('/auth/me', profileData);
  },
};

// Export the service as the default export
export default authApiService;

// Also export as named export to match imports in other files
export { authApiService as authApi };

// Export individual functions for easier imports
export const {
  healthCheck,
  login,
  googleLogin,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
} = authApiService;