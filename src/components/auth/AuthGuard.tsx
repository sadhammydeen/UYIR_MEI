"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/auth';

// Public routes (no auth required)
const publicRoutes = ['/login', '/register', '/forgot-password', '/'];

// Role-specific routes
const roleRoutes: Record<UserRole, string[]> = {
  admin: ['/admin'],
  ngo: ['/ngo', '/ngo/profile', '/ngo/projects', '/ngo/impact', '/ngo/leaderboard', '/ngo/partners', '/ngo/metrics', '/ngo/achievements', '/ngo/beneficiaries'],
  donor: ['/donor', '/donor/profile', '/donor/donations', '/donor/impact'],
  volunteer: ['/volunteer', '/volunteer/profile', '/volunteer/opportunities'],
  beneficiary: ['/beneficiary', '/beneficiary/profile', '/beneficiary/support']
};

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if the route requires authentication
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    // If we're still loading auth state, don't do anything yet
    if (loading) return;
    
    // Handling authentication check
    if (!user && !isPublicRoute) {
      // Not authenticated and trying to access protected route
      router.push('/login');
      return;
    }
    
    // User authenticated, check role-based access
    if (user && userData && !isPublicRoute) {
      const userRole = userData.role;
      
      // Check if user is allowed to access this route based on their role
      const hasAccess = roleRoutes[userRole].some(route => pathname.startsWith(route));
      
      if (!hasAccess) {
        // Unauthorized role, redirect to appropriate dashboard
        router.push(`/${userRole}`);
        return;
      }
    }
    
    // If we've made it here, the user is authorized to view this page
    setAuthorized(true);
  }, [user, userData, loading, pathname, router]);

  // While loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authorized (and not redirected yet), show a blank page
  if (!authorized && !publicRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default AuthGuard; 