'use client';

import { useEffect } from 'react';
import { useAuthStore, AuthUser } from '@/store/authStore';
import { RegisterData, LoginData } from '@/types/auth.types';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, hydrateFromStorage } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const register = async (data: RegisterData) => {
    const result = await authService.signup(data);
    setAuth(result.user as AuthUser, result.token, result.refreshToken);
    return { data: result };
  };

  const login = async (data: LoginData) => {
    const result = await authService.login(data);
    setAuth(result.user as AuthUser, result.token, result.refreshToken);
    return { data: result };
  };

  const logout = async () => {
    await authService.logout();
    clearAuth();
    router.push('/login');
  };

  const getProfile = async () => {
    return authService.getProfile();
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
