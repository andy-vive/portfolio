import { Router } from 'express';
import achievementController from '../controllers/achievement.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createAchievementValidator,
  updateAchievementValidator,
  achievementQueryValidator,
} from '../validators/achievement.validator';

const router = Router();

// Public routes - anyone can view achievements
router.get(
  '/',
  validate(achievementQueryValidator),
  achievementController.findAll
);

router.get(
  '/:id',
  achievementController.findById
);

// Protected routes - only authenticated admin can create/update/delete
router.post(
  '/',
  authenticate,
  validate(createAchievementValidator),
  achievementController.create
);

router.put(
  '/:id',
  authenticate,
  validate(updateAchievementValidator),
  achievementController.update
);

router.delete(
  '/:id',
  authenticate,
  achievementController.delete
);

export default router;
