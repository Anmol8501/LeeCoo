import { UserRole } from './index';

export interface RegisterBody {
  name: string;
  email: string;
  password?: string; // Optional if we support SSO later, but required for password auth
  roll_no?: string;
  department?: string;
  role?: UserRole;
}

export interface LoginBody {
  email: string;
  password?: string;
}

export interface RefreshBody {
  refreshToken: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roll_no?: string | null;
  department?: string | null;
  profile_image_url?: string | null;
  bio?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuthDataResponse {
  user: AuthUserResponse;
  token: string;
  refreshToken: string;
}
