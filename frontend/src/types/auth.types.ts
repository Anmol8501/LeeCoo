import { User } from './index';

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  roll_no?: string;
  department?: string;
  role?: 'student' | 'teacher';
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
