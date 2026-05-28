'use client';

import { useEffect } from 'react';
import { useAuthStore, AuthUser } from '@/store/authStore';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  roll_no?: string;
  department?: string;
  role?: 'student' | 'teacher';
}

interface LoginData {
  email: string;
  password: string;
}

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, hydrateFromStorage } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const register = async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    const { user: userData, token: tokenData, refreshToken } = response.data.data;
    setAuth(userData as AuthUser, tokenData, refreshToken);
    return response.data;
  };

  const login = async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    const { user: userData, token: tokenData, refreshToken } = response.data.data;
    setAuth(userData as AuthUser, tokenData, refreshToken);
    return response.data;
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    getProfile,
  };
}
