export interface CreateProjectDto {
  title: string;
  company?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  teamSize?: number;
  role?: string;
  responsibilities?: string[];
  technologies?: string[];
}

export interface UpdateProjectDto {
  title?: string;
  company?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  teamSize?: number;
  role?: string;
  responsibilities?: string[];
  technologies?: string[];
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  technology?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'title' | 'company' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
  includeAchievements?: boolean;
}
