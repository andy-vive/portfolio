import { Op } from 'sequelize';
import { Project, Achievement } from '../models';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryParams } from '../types/project.types';
import { AppError } from '../middleware/error.middleware';
import { PaginationMeta } from '../utils/response.util';

export interface ProjectListResponse {
  projects: Project[];
  pagination: PaginationMeta;
}

export class ProjectService {
  async create(data: CreateProjectDto): Promise<Project> {
    const project = await Project.create({
      title: data.title,
      company: data.company || null,
      description: data.description || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      teamSize: data.teamSize || null,
      role: data.role || null,
      responsibilities: data.responsibilities || null,
      technologies: data.technologies || null,
    });

    return project;
  }

  async findAll(params: ProjectQueryParams): Promise<ProjectListResponse> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'DESC';

    const where: any = {};

    if (params.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${params.search}%` } },
        { description: { [Op.like]: `%${params.search}%` } },
        { company: { [Op.like]: `%${params.search}%` } },
      ];
    }

    if (params.company) {
      where.company = { [Op.like]: `%${params.company}%` };
    }

    if (params.technology) {
      where.technologies = { [Op.like]: `%${params.technology}%` };
    }

    if (params.startDate) {
      where.startDate = { [Op.gte]: params.startDate };
    }

    if (params.endDate) {
      where.endDate = { [Op.lte]: params.endDate };
    }

    const include = params.includeAchievements
      ? [{ model: Achievement, as: 'achievements' }]
      : [];

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      projects,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      },
    };
  }

  async findById(id: number, includeAchievements = false): Promise<Project> {
    const include = includeAchievements
      ? [{ model: Achievement, as: 'achievements' }]
      : [];

    const project = await Project.findByPk(id, { include });

    if (!project) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    }

    return project;
  }

  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    const project = await this.findById(id);

    await project.update({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.company !== undefined && { company: data.company || null }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.startDate !== undefined && { startDate: data.startDate || null }),
      ...(data.endDate !== undefined && { endDate: data.endDate || null }),
      ...(data.teamSize !== undefined && { teamSize: data.teamSize || null }),
      ...(data.role !== undefined && { role: data.role || null }),
      ...(data.responsibilities !== undefined && { responsibilities: data.responsibilities || null }),
      ...(data.technologies !== undefined && { technologies: data.technologies || null }),
    });

    return project;
  }

  async delete(id: number): Promise<void> {
    const project = await this.findById(id);
    await project.destroy();
  }

  async getProjectAchievements(id: number): Promise<Achievement[]> {
    const project = await this.findById(id, true);
    return project.achievements || [];
  }
}

export default new ProjectService();
