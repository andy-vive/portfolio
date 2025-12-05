import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { successResponse } from '../utils/response.util';
import { asyncHandler } from '../utils/asyncHandler.util';

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    return successResponse(res, result, 'Login successful');
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return successResponse(res, null, 'Logged out successfully');
  });
}

export default new AuthController();
