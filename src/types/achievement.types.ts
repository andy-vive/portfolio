export interface CreateAchievementDto {
  title: string;
  description: string;
  dateAchieved: Date;
  timeOfAchievement: string;
  category?: string;
  tags?: string[];
  projectId?: number;
  proofUrl?: string;
}

export interface UpdateAchievementDto {
  title?: string;
  description?: string;
  dateAchieved?: Date;
  timeOfAchievement?: string;
  category?: string;
  tags?: string[];
  projectId?: number | null;
  proofUrl?: string | null;
}

export interface AchievementQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  projectId?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'title' | 'dateAchieved' | 'category' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
  includeProject?: boolean;
}
