'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
  plan: string;
  is_active: boolean;
  subscription_status: string;
  api_calls_this_month: number;
  messages_this_month: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        setLoading(false);
        return;
      }
      api.setToken(token);
      const userData = await api.getMe();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const result = await api.login({ email, password });
    api.setToken(result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);
    setUser(result.user);
    return result;
  };

  const register = async (email: string, password: string, fullName: string, companyName?: string) => {
    const result = await api.register({ email, password, full_name: fullName, company_name: companyName });
    api.setToken(result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    window.location.href = '/';
  };

  return { user, loading, login, register, logout, fetchUser };
}
