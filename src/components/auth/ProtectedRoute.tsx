import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-theuyir-yellow border-t-theuyir-pink rounded-full animate-spin"></div>
        <p className="mt-4 text-theuyir-darkgrey font-medium">Authenticating...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // If role check is required
  if (requiredRole && user) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!requiredRoles.includes(user.role)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-700 mb-4">
              You do not have the required permissions to access this page.
            </p>
            <a 
              href="/dashboard" 
              className="inline-block px-4 py-2 bg-theuyir-darkgrey text-white rounded-md hover:bg-theuyir-darkgrey/90 transition-colors"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }
  
  // If authenticated and passes role check, render children
  return <>{children}</>;
};

export default ProtectedRoute; 