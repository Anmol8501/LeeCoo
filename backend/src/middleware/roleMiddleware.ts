import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Middleware to restrict access to specific user roles.
 * Must be used after authenticateJWT middleware.
 *
 * @param roles Array of allowed roles ('student', 'teacher', 'admin')
 */
export const requireRole = (roles: Array<'student' | 'teacher' | 'admin'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized. Session not found.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden. Insufficient permissions.', 403));
    }

    next();
  };
};
