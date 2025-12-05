import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { unauthorizedResponse } from '../utils/response.util';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, 'No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const payload = verifyToken(token);
      (req as any).user = payload;
      next();
    } catch (error) {
      return unauthorizedResponse(res, 'Invalid or expired token');
    }
  } catch (error) {
    return unauthorizedResponse(res, 'Authentication failed');
  }
};
