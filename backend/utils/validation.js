import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation rules
export const signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const codeExecutionValidation = [
  body('language')
    .notEmpty().withMessage('Language is required')
    .isIn(['c', 'cpp', 'java', 'python']).withMessage('Invalid language'),
  body('code')
    .notEmpty().withMessage('Code is required')
    .trim(),
  body('stdin')
    .optional()
    .isString(),
];

export const snippetValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('language')
    .notEmpty().withMessage('Language is required')
    .isIn(['c', 'cpp', 'java', 'python']).withMessage('Invalid language'),
  body('sourceCode')
    .notEmpty().withMessage('Source code is required'),
  body('stdin')
    .optional()
    .isString(),
  body('output')
    .optional()
    .isString(),
  body('visibility')
    .optional()
    .isIn(['public', 'private']).withMessage('Visibility must be public or private'),
];

export const snippetUpdateValidation = [
  param('id')
    .isMongoId().withMessage('Invalid snippet ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('language')
    .optional()
    .isIn(['c', 'cpp', 'java', 'python']).withMessage('Invalid language'),
  body('sourceCode')
    .optional()
    .notEmpty().withMessage('Source code cannot be empty'),
  body('visibility')
    .optional()
    .isIn(['public', 'private']).withMessage('Visibility must be public or private'),
];

export const snippetIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid snippet ID'),
];