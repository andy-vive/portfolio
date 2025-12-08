import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { loginValidator, refreshTokenValidator } from '../validators/auth.validator';

const router = Router();

router.post('/login', validate(loginValidator), authController.login);

router.post('/logout', validate(refreshTokenValidator), authController.logout);

export default router;
