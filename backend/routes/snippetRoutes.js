import express from 'express';
import {
  createSnippet,
  getAllSnippets,
  getSnippetById,
  getMySnippets,
  updateSnippet,
  deleteSnippet,
} from '../controllers/snippetController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import {
  snippetValidation,
  snippetUpdateValidation,
  snippetIdValidation,
  validate,
} from '../utils/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllSnippets);
router.get('/:id', snippetIdValidation, validate, optionalAuth, getSnippetById);

// Protected routes
router.post('/', protect, snippetValidation, validate, createSnippet);
router.get('/user/me', protect, getMySnippets);
router.put('/:id', protect, snippetUpdateValidation, validate, updateSnippet);
router.delete('/:id', protect, snippetIdValidation, validate, deleteSnippet);

export default router;