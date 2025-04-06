'use client';

import { Suspense, useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

// Loading component for Suspense boundaries
function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Track hydration for debugging
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <AuthGuard>
          <div id="app-container" data-hydrated={isHydrated}>
            {children}
          </div>
        </AuthGuard>
      </Suspense>
    </AuthProvider>
  );
} 