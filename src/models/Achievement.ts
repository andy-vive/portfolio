import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import sequelize from '../config/database';
import Project from './Project';

class Achievement extends Model<InferAttributes<Achievement>, InferCreationAttributes<Achievement>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare dateAchieved: Date;
  declare timeOfAchievement: string;
  declare category: string | null;
  declare tags: string[] | null;
  declare projectId: ForeignKey<Project['id']> | null;
  declare proofUrl: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare project?: NonAttribute<Project>;
}

Achievement.init(
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
        len: [5, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000],
      },
    },
    dateAchieved: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isNotFuture(value: Date) {
          if (value > new Date()) {
            throw new Error('Date achieved cannot be in the future');
          }
        },
      },
    },
    timeOfAchievement: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    proofUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize,
    tableName: 'achievements',
    indexes: [
      { fields: ['date_achieved'] },
      { fields: ['category'] },
      { fields: ['project_id'] },
    ],
  }
);

export default Achievement;
