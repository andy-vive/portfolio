import sequelize from '../config/database';
import User from './User';
import RefreshToken from './RefreshToken';
import Project from './Project';
import Achievement from './Achievement';

// Define associations
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE',
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Project.hasMany(Achievement, {
  foreignKey: 'projectId',
  as: 'achievements',
  onDelete: 'SET NULL',
});

Achievement.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});

export { sequelize, User, RefreshToken, Project, Achievement };
