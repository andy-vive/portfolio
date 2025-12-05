import { Request, Response, NextFunction } from 'express';
import achievementService from '../services/achievement.service';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { CreateAchievementDto, UpdateAchievementDto, AchievementQueryParams } from '../types/achievement.types';

export class AchievementController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data: CreateAchievementDto = req.body;
      const achievement = await achievementService.create(data);
      return successResponse(res, achievement, 'Achievement created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const params: AchievementQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        search: req.query.search as string,
        category: req.query.category as string,
        projectId: req.query.projectId ? parseInt(req.query.projectId as string) : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        sortBy: req.query.sortBy as AchievementQueryParams['sortBy'],
        sortOrder: req.query.sortOrder as AchievementQueryParams['sortOrder'],
        includeProject: req.query.includeProject === 'true',
      };

      const result = await achievementService.findAll(params);
      return paginatedResponse(
        res,
        result.achievements,
        result.pagination,
        'Achievements retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id = parseInt(req.params.id);
      const includeProject = req.query.includeProject === 'true';
      const achievement = await achievementService.findById(id, includeProject);
      return successResponse(res, achievement, 'Achievement retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateAchievementDto = req.body;
      const achievement = await achievementService.update(id, data);
      return successResponse(res, achievement, 'Achievement updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id = parseInt(req.params.id);
      await achievementService.delete(id);
      return successResponse(res, null, 'Achievement deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AchievementController();
