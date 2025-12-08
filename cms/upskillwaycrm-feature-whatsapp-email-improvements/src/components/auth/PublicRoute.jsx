import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '../../services/utils/authUtils';
import { getUserRole } from '../../utils/roleUtils';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true = authenticated, false = not authenticated

  useEffect(() => {
    const checkAuth = () => {
      const token = authUtils.getToken();
      const user = authUtils.getUser();
      
      console.log('PublicRoute: Checking authentication', {
        hasToken: !!token,
        hasUser: !!user
      });
      
      // Check if user is authenticated
      const authenticated = !!(token && user);
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        console.log('PublicRoute: User already authenticated, will redirect to dashboard');
      } else {
        console.log('PublicRoute: User not authenticated, allowing access to public route');
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to appropriate page if already authenticated
  if (isAuthenticated) {
    const userRole = getUserRole();
    // Sales users should be redirected to leads instead of dashboard
    const redirectPath = userRole === 'sales' ? '/dashboard/crm/leads' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Render public content if not authenticated
  return children;
};

export default PublicRoute;