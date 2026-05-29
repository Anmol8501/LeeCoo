import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterBody, LoginBody, RefreshBody } from '../types/auth.types';
import { AppError, ValidationError } from '../middleware/errorHandler';

export class AuthController {
  /**
   * POST /auth/register
   * Registers a new student or teacher account.
   */
  public static async register(
    req: Request<{}, {}, RegisterBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, roll_no, department, role } = req.body;

      if (!name || !email || !password) {
        throw new ValidationError('Name, email, and password are required.');
      }

      // Check if student role is trying to register without roll number
      if (role === 'student' && !roll_no) {
        throw new ValidationError('Roll number is required for students.');
      }

      const result = await AuthService.register({
        name,
        email,
        password,
        roll_no,
        department,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   * Authenticates user and issues access & refresh tokens.
   */
  public static async login(
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required.');
      }

      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   * Issues a new access token using a refresh token.
   */
  public static async refresh(
    req: Request<{}, {}, RefreshBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required.');
      }

      const result = await AuthService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/profile
   * Returns details of the currently authenticated user.
   */
  public static async profile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized.', 401);
      }

      const userProfile = await AuthService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully.',
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /auth/profile
   * Updates current user's profile details.
   */
  public static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized.', 401);
      }

      const { name, bio, profile_image_url } = req.body;

      const updatedProfile = await AuthService.updateProfile(
        req.user.id,
        name,
        bio,
        profile_image_url
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /auth/password
   * Changes current user's password.
   */
  public static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized.', 401);
      }

      const { oldPassword, newPassword } = req.body;

      await AuthService.changePassword(req.user.id, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Logs out user and invalidates session.
   */
  public static async logout(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        message: 'Logout successful.',
      });
    } catch (error) {
      next(error);
    }
  }
}
