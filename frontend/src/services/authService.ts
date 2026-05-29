import api from './api';
import { RegisterData, LoginData, AuthResponse } from '../types/auth.types';
import { User } from '../types';

export const authService = {
  /**
   * Log in a user.
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  /**
   * Register a new user account.
   */
  async signup(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  /**
   * Retrieve the current user's profile.
   */
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  /**
   * Update the user's profile details.
   */
  async updateProfile(data: { name?: string; bio?: string; profile_image_url?: string }): Promise<User> {
    const response = await api.patch('/auth/profile', data);
    return response.data.data;
  },

  /**
   * Change user password.
   */
  async changePassword(oldPassword?: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put('/auth/password', { oldPassword, newPassword });
    return response.data;
  },

  /**
   * Logout user.
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout').catch(() => {});
  }
};

export default authService;
