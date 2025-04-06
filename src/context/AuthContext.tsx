'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getCurrentUserData, 
  registerUser, 
  signInUser, 
  signOutUser, 
  resetPassword,
  UserData, 
  UserRole 
} from '@/lib/auth';
import { useRouter } from 'next/navigation';

// Define context types
interface AuthContextProps {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userData = await getCurrentUserData(user.uid);
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (email: string, password: string, displayName: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await registerUser(email, password, displayName, role);
      setUserData(userData);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await signInUser(email, password);
      setUserData(userData);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signOutUser();
      setUserData(null);
      router.push('/login');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetUserPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await resetPassword(email);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Define context value
  const value = {
    user,
    userData,
    loading,
    error,
    register,
    login,
    logout,
    resetUserPassword,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 