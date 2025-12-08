import { Router } from 'express';
import achievementController from '../controllers/achievement.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createAchievementValidator,
  updateAchievementValidator,
  achievementQueryValidator,
} from '../validators/achievement.validator';

const router = Router();

router.get(
  '/',
  validate(achievementQueryValidator),
  achievementController.findAll
);

router.get(
  '/:id',
  achievementController.findById
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createAchievementValidator),
  achievementController.create
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(updateAchievementValidator),
  achievementController.update
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  achievementController.delete
);

export default router;
