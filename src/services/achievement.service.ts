import { Op } from 'sequelize';
import { Achievement, Project } from '../models';
import { CreateAchievementDto, UpdateAchievementDto, AchievementQueryParams } from '../types/achievement.types';
import { AppError } from '../middleware/error.middleware';
import { PaginationMeta } from '../utils/response.util';

export interface AchievementListResponse {
  achievements: Achievement[];
  pagination: PaginationMeta;
}

export class AchievementService {
  async create(data: CreateAchievementDto): Promise<Achievement> {
    if (data.projectId) {
      const project = await Project.findByPk(data.projectId);
      if (!project) {
        throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
      }
    }

    const achievement = await Achievement.create({
      title: data.title,
      description: data.description,
      dateAchieved: data.dateAchieved,
      timeOfAchievement: data.timeOfAchievement,
      category: data.category || null,
      tags: data.tags || null,
      projectId: data.projectId || null,
      proofUrl: data.proofUrl || null,
    });

    return achievement;
  }

  async findAll(params: AchievementQueryParams): Promise<AchievementListResponse> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const sortBy = params.sortBy || 'dateAchieved';
    const sortOrder = params.sortOrder || 'DESC';

    const where: any = {};

    if (params.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${params.search}%` } },
        { description: { [Op.like]: `%${params.search}%` } },
      ];
    }

    if (params.category) {
      where.category = { [Op.like]: `%${params.category}%` };
    }

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    if (params.startDate) {
      where.dateAchieved = { [Op.gte]: params.startDate };
    }

    if (params.endDate) {
      where.dateAchieved = {
        ...(where.dateAchieved as object),
        [Op.lte]: params.endDate,
      };
    }

    const include = params.includeProject
      ? [{ model: Project, as: 'project' }]
      : [];

    const { count, rows: achievements } = await Achievement.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      achievements,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      },
    };
  }

  async findById(id: number, includeProject = false): Promise<Achievement> {
    const include = includeProject
      ? [{ model: Project, as: 'project' }]
      : [];

    const achievement = await Achievement.findByPk(id, { include });

    if (!achievement) {
      throw new AppError(404, 'ACHIEVEMENT_NOT_FOUND', 'Achievement not found');
    }

    return achievement;
  }

  async update(id: number, data: UpdateAchievementDto): Promise<Achievement> {
    const achievement = await this.findById(id);

    if (data.projectId !== undefined && data.projectId !== null) {
      const project = await Project.findByPk(data.projectId);
      if (!project) {
        throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
      }
    }

    await achievement.update({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.dateAchieved !== undefined && { dateAchieved: data.dateAchieved }),
      ...(data.timeOfAchievement !== undefined && { timeOfAchievement: data.timeOfAchievement }),
      ...(data.category !== undefined && { category: data.category || null }),
      ...(data.tags !== undefined && { tags: data.tags || null }),
      ...(data.projectId !== undefined && { projectId: data.projectId }),
      ...(data.proofUrl !== undefined && { proofUrl: data.proofUrl }),
    });

    return achievement;
  }

  async delete(id: number): Promise<void> {
    const achievement = await this.findById(id);
    await achievement.destroy();
  }
}

export default new AchievementService();
