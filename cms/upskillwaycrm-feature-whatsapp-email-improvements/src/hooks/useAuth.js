import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../services/utils/authUtils';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = () => {
    try {
      const token = authUtils.getToken();
      const userData = authUtils.getUser();
      
      console.log('useAuth: Checking authentication', {
        hasToken: !!token,
        hasUser: !!userData
      });

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('useAuth: Error checking authentication', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, tokens) => {
    try {
      // Store tokens and user data
      authUtils.setToken(tokens.accessToken);
      if (tokens.refreshToken) {
        authUtils.setRefreshToken(tokens.refreshToken);
      }
      authUtils.setUser(userData);

      // Update state
      setIsAuthenticated(true);
      setUser(userData);

      console.log('useAuth: User logged in successfully');
    } catch (error) {
      console.error('useAuth: Error during login', error);
    }
  };

  const logout = async () => {
    try {
      console.log('useAuth: Logging out user');
      
      // Clear auth data
      authUtils.clearAuth();
      
      // Clear legacy storage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Update state
      setIsAuthenticated(false);
      setUser(null);

      // Navigate to login
      navigate('/login', { replace: true });
      
      console.log('useAuth: User logged out successfully');
    } catch (error) {
      console.error('useAuth: Error during logout', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
};

export default useAuth;