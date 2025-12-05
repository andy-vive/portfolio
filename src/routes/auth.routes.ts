import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { loginValidator, refreshTokenValidator } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/login - Login
router.post('/login', validate(loginValidator), authController.login);

// POST /api/auth/logout - Logout
router.post('/logout', validate(refreshTokenValidator), authController.logout);

export default router;
