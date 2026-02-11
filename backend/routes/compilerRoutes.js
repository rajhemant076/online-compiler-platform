import express from 'express';
import { runCode } from '../controllers/compilerController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { codeExecutionLimiter } from '../middleware/rateLimiter.js';
import { codeExecutionValidation, validate } from '../utils/validation.js';

const router = express.Router();

router.post(
  '/run',
  codeExecutionLimiter,
  optionalAuth,
  codeExecutionValidation,
  validate,
  runCode
);

export default router;