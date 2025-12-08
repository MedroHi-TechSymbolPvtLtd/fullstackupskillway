import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '../../services/utils/authUtils';
import { canAccessRoute, getUserRole } from '../../utils/roleUtils';
import toast from 'react-hot-toast';

/**
 * RoleProtectedRoute - Protects routes based on user role
 * 
 * @param {React.ReactNode} children - The component to render if access is allowed
 * @param {string[]} allowedRoles - Array of roles that can access this route (optional, defaults to all authenticated users)
 * @param {string} requiredPermission - Specific permission required (optional)
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles = null, // null means any authenticated user can access
  requiredPermission = null 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [hasAccess, setHasAccess] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = () => {
      const token = authUtils.getToken();
      const user = authUtils.getUser();
      
      // First check authentication
      const authenticated = !!(token && user);
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        setHasAccess(false);
        return;
      }
      
      // Check role-based access
      const userRole = getUserRole();
      
      // If allowedRoles is specified, check if user role is in the list
      if (allowedRoles && allowedRoles.length > 0) {
        const hasRoleAccess = allowedRoles.includes(userRole);
        if (!hasRoleAccess) {
          setHasAccess(false);
          toast.error('You do not have permission to access this page');
          return;
        }
      }
      
      // Check route-based access
      const routeAccess = canAccessRoute(location.pathname);
      if (!routeAccess) {
        setHasAccess(false);
        toast.error('You do not have permission to access this page');
        return;
      }
      
      setHasAccess(true);
    };

    checkAccess();
  }, [location.pathname, allowedRoles]);

  // Show loading while checking authentication
  if (isAuthenticated === null || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to appropriate page if access denied
  if (!hasAccess) {
    const userRole = getUserRole();
    // Sales users should be redirected to leads instead of dashboard
    const redirectPath = userRole === 'sales' ? '/dashboard/crm/leads' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Render protected content if authenticated and has access
  return children;
};

export default RoleProtectedRoute;

