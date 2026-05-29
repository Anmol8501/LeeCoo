import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { PasswordService } from './PasswordService';
import { JwtService } from './JwtService';
import {
  AppError,
  DuplicateEmailError,
  InvalidCredentialsError,
  InvalidTokenError
} from '../middleware/errorHandler';
import { RegisterBody, AuthDataResponse, AuthUserResponse } from '../types/auth.types';

export class AuthService {
  private static readonly userRepository = AppDataSource.getRepository(User);

  /**
   * Registers a new user (student or teacher) and generates tokens.
   */
  public static async register(data: RegisterBody): Promise<AuthDataResponse> {
    const { name, email, password, roll_no, department, role } = data;

    if (!password) {
      throw new AppError('Password is required.', 400);
    }

    // Validate password strength
    const strengthResult = PasswordService.validatePasswordStrength(password);
    if (!strengthResult.isValid) {
      throw new AppError('Weak password.', 400, strengthResult.errors);
    }

    // Check if user already exists by email
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new DuplicateEmailError('Email is already registered.');
    }

    // Check if user already exists by roll number (only for students/teachers if roll_no is provided)
    if (roll_no) {
      const existingRollNo = await this.userRepository.findOne({ where: { roll_no } });
      if (existingRollNo) {
        throw new DuplicateEmailError('Roll number is already registered.');
      }
    }

    // Hash the password
    const passwordHash = await PasswordService.hashPassword(password);

    // Create and save new user
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password_hash = passwordHash;
    newUser.roll_no = roll_no || null;
    newUser.department = department || null;
    newUser.role = role || 'student';
    newUser.is_active = true;

    await this.userRepository.save(newUser);

    // Generate tokens
    const accessToken = JwtService.generateAccessToken(newUser.id, newUser.role, newUser.email);
    const refreshToken = JwtService.generateRefreshToken(newUser.id);

    return {
      user: this.mapToUserResponse(newUser),
      token: accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticates user credentials and generates access/refresh tokens.
   */
  public static async login(email: string, password?: string): Promise<AuthDataResponse> {
    if (!password) {
      throw new AppError('Password is required.', 400);
    }

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    // Compare passwords
    const isPasswordMatch = await PasswordService.comparePassword(password, user.password_hash);
    if (!isPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    // Update last login timestamp
    user.last_login_at = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const accessToken = JwtService.generateAccessToken(user.id, user.role, user.email);
    const refreshToken = JwtService.generateRefreshToken(user.id);

    return {
      user: this.mapToUserResponse(user),
      token: accessToken,
      refreshToken,
    };
  }

  /**
   * Refreshes access token using a valid refresh token.
   */
  public static async refreshAccessToken(token: string): Promise<{ token: string }> {
    let payload;
    try {
      payload = JwtService.verifyRefreshToken(token);
    } catch (err) {
      throw new InvalidTokenError('Invalid or expired refresh token.');
    }
    
    const user = await this.userRepository.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    // Generate new access token
    const newAccessToken = JwtService.generateAccessToken(user.id, user.role, user.email);

    return {
      token: newAccessToken,
    };
  }

  /**
   * Retrieves profile details for a specific user ID.
   */
  public static async getUserById(userId: string): Promise<AuthUserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return this.mapToUserResponse(user);
  }

  /**
   * Updates profile details for a user.
   */
  public static async updateProfile(
    userId: string,
    name?: string,
    bio?: string,
    profile_image_url?: string
  ): Promise<AuthUserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profile_image_url !== undefined) user.profile_image_url = profile_image_url;

    await this.userRepository.save(user);
    return this.mapToUserResponse(user);
  }

  /**
   * Changes the password of a user after verifying their old password.
   */
  public static async changePassword(
    userId: string,
    oldPassword?: string,
    newPassword?: string
  ): Promise<void> {
    if (!oldPassword || !newPassword) {
      throw new AppError('Old and new passwords are required.', 400);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Compare old password
    const isMatch = await PasswordService.comparePassword(oldPassword, user.password_hash);
    if (!isMatch) {
      throw new AppError('Incorrect current password.', 400);
    }

    // Validate new password strength
    const strengthResult = PasswordService.validatePasswordStrength(newPassword);
    if (!strengthResult.isValid) {
      throw new AppError('Weak new password.', 400, strengthResult.errors);
    }

    // Hash and save new password
    user.password_hash = await PasswordService.hashPassword(newPassword);
    await this.userRepository.save(user);
  }

  /**
   * Helper to map user model to secure user response representation (omitting password hash).
   */
  private static mapToUserResponse(user: User): AuthUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roll_no: user.roll_no,
      department: user.department,
      profile_image_url: user.profile_image_url,
      bio: user.bio,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
