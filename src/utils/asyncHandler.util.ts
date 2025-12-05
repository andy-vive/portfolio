import { Request, Response, NextFunction } from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

/**
 * Wrapper function to handle async errors in Express route handlers
 * Eliminates the need for try-catch blocks in every controller method
 *
 * @param fn - Async controller function
 * @returns Wrapped function that catches errors and passes them to next()
 *
 * @example
 * export const login = asyncHandler(async (req, res) => {
 *   const result = await authService.login(req.body.username, req.body.password);
 *   return successResponse(res, result, 'Login successful');
 * });
 */
export const asyncHandler = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
