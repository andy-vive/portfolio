import { Request, Response } from 'express';
import projectService from '../services/project.service';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryParams } from '../types/project.types';
import { asyncHandler } from '../utils/asyncHandler.util';

export class ProjectController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateProjectDto = req.body;
    const project = await projectService.create(data);
    return successResponse(res, project, 'Project created successfully', 201);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
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
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const includeAchievements = req.query.includeAchievements === 'true';
    const project = await projectService.findById(id, includeAchievements);
    return successResponse(res, project, 'Project retrieved successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data: UpdateProjectDto = req.body;
    const project = await projectService.update(id, data);
    return successResponse(res, project, 'Project updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await projectService.delete(id);
    return successResponse(res, null, 'Project deleted successfully');
  });

  getAchievements = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const achievements = await projectService.getProjectAchievements(id);
    return successResponse(res, achievements, 'Project achievements retrieved successfully');
  });
}

export default new ProjectController();
