import { Request, Response, NextFunction } from 'express';
import { internalErrorResponse } from '../utils/response.util';
import { logger } from '../utils/logger.util';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown[]
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  if (err.name === 'SequelizeValidationError') {
    const sequelizeErr = err as unknown as { errors?: Array<{ path: string; message: string }> };
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: sequelizeErr.errors?.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      },
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const sequelizeErr = err as unknown as { errors?: Array<{ path: string; message: string }> };
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Resource already exists',
        details: sequelizeErr.errors?.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      },
    });
  }

  return internalErrorResponse(res, 'An unexpected error occurred');
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};
