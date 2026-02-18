"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, User as ApiUser } from '@/services/api';

type AuthContextType = {
  user: ApiUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const tokenUser = apiClient.getTokenUser();
        if (tokenUser) {
          const profile = await apiClient.getProfile();
          if (mounted) setUser(profile);
        }
      } catch (err) {
        apiClient.logout();
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { user: u } = await apiClient.login(email, password);
    setUser(u);
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const { user: u } = await apiClient.register(email, password, name, phone);
    setUser(u);
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  const refresh = async () => {
    await apiClient.refreshToken();
    const profile = await apiClient.getProfile();
    setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
