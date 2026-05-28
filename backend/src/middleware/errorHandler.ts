import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  errors?: unknown[];

  constructor(message: string, statusCode: number, errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  
  logger.error(`${req.method} ${req.originalUrl} - Status: ${statusCode} - Error: ${message}`);
  
  if (process.env.NODE_ENV === 'development' && !(err instanceof AppError)) {
    logger.error(err.stack || '');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err instanceof AppError && err.errors ? { errors: err.errors } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
