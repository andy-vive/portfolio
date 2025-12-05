import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { successResponse } from '../utils/response.util';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      return successResponse(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
