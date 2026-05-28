import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Access Denied. No token provided.', 401));
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_token_1234567890';

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token.', 403));
  }
};

export const requireRole = (roles: Array<'student' | 'teacher' | 'admin'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden. Insufficient permissions.', 403));
    }

    next();
  };
};
