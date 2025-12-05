import { body, query } from 'express-validator';

export const createAchievementValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('dateAchieved')
    .notEmpty()
    .withMessage('Date achieved is required')
    .isISO8601()
    .withMessage('Date achieved must be a valid date'),
  body('timeOfAchievement')
    .trim()
    .notEmpty()
    .withMessage('Time of achievement is required')
    .isLength({ max: 50 })
    .withMessage('Time of achievement must not exceed 50 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tag item cannot be empty'),
  body('projectId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),
  body('proofUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Proof URL must be a valid URL')
    .isLength({ max: 500 })
    .withMessage('Proof URL must not exceed 500 characters'),
];

export const updateAchievementValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('dateAchieved')
    .optional()
    .isISO8601()
    .withMessage('Date achieved must be a valid date'),
  body('timeOfAchievement')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Time of achievement cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Time of achievement must not exceed 50 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tag item cannot be empty'),
  body('projectId')
    .optional()
    .custom((value) => value === null || (Number.isInteger(value) && value > 0))
    .withMessage('Project ID must be null or a positive integer'),
  body('proofUrl')
    .optional()
    .custom((value) => value === null || (typeof value === 'string' && value.trim().length > 0))
    .withMessage('Proof URL must be null or a non-empty string')
    .custom((value) => {
      if (value === null) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    })
    .withMessage('Proof URL must be a valid URL')
    .isLength({ max: 500 })
    .withMessage('Proof URL must not exceed 500 characters'),
];

export const achievementQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim(),
  query('category')
    .optional()
    .trim(),
  query('projectId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  query('sortBy')
    .optional()
    .isIn(['title', 'dateAchieved', 'category', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
  query('includeProject')
    .optional()
    .isBoolean()
    .withMessage('includeProject must be a boolean'),
];
