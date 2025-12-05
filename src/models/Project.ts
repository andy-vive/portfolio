import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import sequelize from '../config/database';
import Achievement from './Achievement';

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare company: string | null;
  declare description: string | null;
  declare startDate: Date | null;
  declare endDate: Date | null;
  declare teamSize: number | null;
  declare role: string | null;
  declare responsibilities: string[] | null;
  declare technologies: string[] | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Associations
  declare achievements?: NonAttribute<Achievement[]>;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [3, 200],
      },
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    teamSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    responsibilities: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    technologies: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'projects',
    indexes: [
      { fields: ['company'] },
      { fields: ['start_date'] },
      { fields: ['end_date'] },
    ],
  }
);

export default Project;
