'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api/admin';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      await adminAPI.getCurrentUser();
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch {
      sessionStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    const response = await adminAPI.login(username, password);
    sessionStorage.setItem('admin_token', response.access_token);
    setIsAuthenticated(true);
    router.push('/admin');
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
