import { Router } from 'express';
import viewController from '../controllers/view.controller';

const router = Router();

// Public pages
router.get('/', viewController.home);
router.get('/projects', viewController.projects);
router.get('/achievements', viewController.achievements);
router.get('/skills', viewController.skills);
router.get('/experience', viewController.experience);

// Admin pages (authentication handled client-side via admin.js)
router.get('/admin/login', viewController.adminLogin);
router.get('/admin/projects', viewController.adminProjectsList);
router.get('/admin/projects/create', viewController.adminProjectCreate);
router.get('/admin/projects/:id/edit', viewController.adminProjectEdit);
router.get('/admin/achievements', viewController.adminAchievementsList);
router.get('/admin/achievements/create', viewController.adminAchievementCreate);
router.get('/admin/achievements/:id/edit', viewController.adminAchievementEdit);

export default router;
