import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { TokenPayload } from '../middleware/authMiddleware';

export class JwtService {
  private static readonly ACCESS_SECRET = env.JWT_SECRET;
  private static readonly REFRESH_SECRET = env.JWT_REFRESH_SECRET;
  private static readonly ACCESS_EXPIRY = env.JWT_EXPIRES_IN;
  private static readonly REFRESH_EXPIRY = env.JWT_REFRESH_EXPIRES_IN;

  /**
   * Generates a short-lived access token.
   */
  public static generateAccessToken(userId: string, role: 'student' | 'teacher' | 'admin', email: string): string {
    const payload: TokenPayload = {
      id: userId,
      role,
      email,
    };
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: this.ACCESS_EXPIRY as any });
  }

  /**
   * Generates a long-lived refresh token.
   */
  public static generateRefreshToken(userId: string): string {
    const payload = { id: userId };
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: this.REFRESH_EXPIRY as any });
  }

  /**
   * Verifies an access token and returns the payload.
   */
  public static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.ACCESS_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verifies a refresh token and returns the payload.
   */
  public static verifyRefreshToken(token: string): { id: string } {
    try {
      return jwt.verify(token, this.REFRESH_SECRET) as { id: string };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
