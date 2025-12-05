import { Response } from 'express';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> extends ApiSuccessResponse<T> {
  pagination: PaginationMeta;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T,
  pagination: PaginationMeta,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiPaginatedResponse<T> = {
    success: true,
    data,
    pagination,
    ...(message && { message }),
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: ValidationError[]
): Response => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(response);
};

export const validationErrorResponse = (
  res: Response,
  errors: ValidationError[]
): Response => {
  return errorResponse(res, 'VALIDATION_ERROR', 'Validation failed', 400, errors);
};

export const unauthorizedResponse = (
  res: Response,
  message: string = 'Unauthorized'
): Response => {
  return errorResponse(res, 'UNAUTHORIZED', message, 401);
};

export const forbiddenResponse = (
  res: Response,
  message: string = 'Forbidden'
): Response => {
  return errorResponse(res, 'FORBIDDEN', message, 403);
};

export const notFoundResponse = (
  res: Response,
  message: string = 'Resource not found'
): Response => {
  return errorResponse(res, 'NOT_FOUND', message, 404);
};

export const internalErrorResponse = (
  res: Response,
  message: string = 'Internal server error'
): Response => {
  return errorResponse(res, 'INTERNAL_ERROR', message, 500);
};
