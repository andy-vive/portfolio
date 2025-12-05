import { Request, Response, NextFunction } from 'express';
import projectService from '../services/project.service';
import achievementService from '../services/achievement.service';

export class ViewController {
  async home(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get featured projects and recent achievements for home page
      const projectsResult = await projectService.findAll({
        limit: 3,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      const achievementsResult = await achievementService.findAll({
        limit: 3,
        sortBy: 'dateAchieved',
        sortOrder: 'DESC'
      });

      res.render('pages/home', {
        title: 'Home - Pham The Duy',
        projects: projectsResult.projects,
        achievements: achievementsResult.achievements,
      });
    } catch (error) {
      next(error);
    }
  }

  async projects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const company = req.query.company as string;
      const technology = req.query.technology as string;
      const search = req.query.search as string;

      const result = await projectService.findAll({
        page,
        limit: 9,
        company,
        technology,
        search,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        includeAchievements: false,
      });

      res.render('pages/projects', {
        title: 'Projects - Pham The Duy',
        projects: result.projects,
        pagination: result.pagination,
        filters: { company, technology, search },
      });
    } catch (error) {
      next(error);
    }
  }

  async achievements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const category = req.query.category as string;
      const search = req.query.search as string;

      const result = await achievementService.findAll({
        page,
        limit: 12,
        category,
        search,
        sortBy: 'dateAchieved',
        sortOrder: 'DESC',
        includeProject: true,
      });

      res.render('pages/achievements', {
        title: 'Achievements - Pham The Duy',
        achievements: result.achievements,
        pagination: result.pagination,
        filters: { category, search },
      });
    } catch (error) {
      next(error);
    }
  }

  async skills(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('pages/skills', {
        title: 'Skills - Pham The Duy',
      });
    } catch (error) {
      next(error);
    }
  }

  async experience(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('pages/experience', {
        title: 'Experience - Pham The Duy',
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin routes
  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('admin/login', {
        error: req.query.error as string,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminProjectsList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const search = req.query.search as string;

      const result = await projectService.findAll({
        page,
        limit: 20,
        search,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });

      res.render('admin/projects-list', {
        projects: result.projects,
        pagination: result.pagination,
        filters: { search },
        success: req.query.success as string,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminProjectCreate(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('admin/project-form', {
        project: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminProjectEdit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const project = await projectService.findById(id);

      res.render('admin/project-form', {
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminAchievementsList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const search = req.query.search as string;

      const result = await achievementService.findAll({
        page,
        limit: 20,
        search,
        sortBy: 'dateAchieved',
        sortOrder: 'DESC',
        includeProject: true,
      });

      res.render('admin/achievements-list', {
        achievements: result.achievements,
        pagination: result.pagination,
        filters: { search },
        success: req.query.success as string,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminAchievementCreate(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await projectService.findAll({ limit: 1000 });

      res.render('admin/achievement-form', {
        achievement: null,
        projects: projects.projects,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminAchievementEdit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const achievement = await achievementService.findById(id, true);
      const projects = await projectService.findAll({ limit: 1000 });

      res.render('admin/achievement-form', {
        achievement,
        projects: projects.projects,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ViewController();
