import { Request, Response, NextFunction } from 'express';
import projectService from '../services/project.service';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryParams } from '../types/project.types';

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data: CreateProjectDto = req.body;
      const project = await projectService.create(data);
      return successResponse(res, project, 'Project created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const params: ProjectQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        search: req.query.search as string,
        company: req.query.company as string,
        technology: req.query.technology as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        sortBy: req.query.sortBy as ProjectQueryParams['sortBy'],
        sortOrder: req.query.sortOrder as ProjectQueryParams['sortOrder'],
        includeAchievements: req.query.includeAchievements === 'true',
      };

      const result = await projectService.findAll(params);
      return paginatedResponse(
        res,
        result.projects,
        result.pagination,
        'Projects retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id = parseInt(req.params.id);
      const includeAchievements = req.query.includeAchievements === 'true';
      const project = await projectService.findById(id, includeAchievements);
      return successResponse(res, project, 'Project retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateProjectDto = req.body;
      const project = await projectService.update(id, data);
      return successResponse(res, project, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id = parseInt(req.params.id);
      await projectService.delete(id);
      return successResponse(res, null, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAchievements(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const id = parseInt(req.params.id);
      const achievements = await projectService.getProjectAchievements(id);
      return successResponse(res, achievements, 'Project achievements retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
