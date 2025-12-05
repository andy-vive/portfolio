import { body, query } from 'express-validator';

export const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company must not exceed 100 characters'),
  body('description')
    .optional()
    .trim(),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('teamSize')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Team size must be a positive integer'),
  body('role')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Role must not exceed 100 characters'),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array'),
  body('responsibilities.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Responsibility item cannot be empty'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('technologies.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Technology item cannot be empty'),
];

export const updateProjectValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company must not exceed 100 characters'),
  body('description')
    .optional()
    .trim(),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('teamSize')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Team size must be a positive integer'),
  body('role')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Role must not exceed 100 characters'),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array'),
  body('responsibilities.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Responsibility item cannot be empty'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('technologies.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Technology item cannot be empty'),
];

export const projectQueryValidator = [
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
  query('company')
    .optional()
    .trim(),
  query('technology')
    .optional()
    .trim(),
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
    .isIn(['title', 'company', 'startDate', 'endDate', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
  query('includeAchievements')
    .optional()
    .isBoolean()
    .withMessage('includeAchievements must be a boolean'),
];
