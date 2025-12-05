import { Router } from 'express';
import projectController from '../controllers/project.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createProjectValidator,
  updateProjectValidator,
  projectQueryValidator,
} from '../validators/project.validator';

const router = Router();

// Public routes - anyone can view projects
router.get(
  '/',
  validate(projectQueryValidator),
  projectController.findAll
);

router.get(
  '/:id',
  projectController.findById
);

router.get(
  '/:id/achievements',
  projectController.getAchievements
);

// Protected routes - only authenticated admin can create/update/delete
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createProjectValidator),
  projectController.create
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(updateProjectValidator),
  projectController.update
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  projectController.delete
);

export default router;
