import Snippet from '../models/Snippet.js';
import User from '../models/User.js';

// @desc    Create new snippet
// @route   POST /api/snippets
// @access  Private
export const createSnippet = async (req, res, next) => {
  try {
    const { title, language, sourceCode, stdin, output, visibility } = req.body;

    const snippet = await Snippet.create({
      userId: req.user._id,
      title,
      language,
      sourceCode,
      stdin: stdin || '',
      output: output || '',
      visibility: visibility || 'public',
    });

    // Increment user's snippet count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalSnippets: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Snippet created successfully',
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all public snippets
// @route   GET /api/snippets
// @access  Public
export const getAllSnippets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, language } = req.query;

    const query = { visibility: 'public' };
    if (language) {
      query.language = language;
    }

    const snippets = await Snippet.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Snippet.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        snippets,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get snippet by ID
// @route   GET /api/snippets/:id
// @access  Public
export const getSnippetById = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate('userId', 'name email');

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found',
      });
    }

    // Check if snippet is private and user is not the owner
    if (snippet.visibility === 'private') {
      if (!req.user || snippet.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to private snippet',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's snippets
// @route   GET /api/snippets/user/me
// @access  Private
export const getMySnippets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const snippets = await Snippet.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Snippet.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        snippets,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
export const updateSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found',
      });
    }

    // Check if user is the owner
    if (snippet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this snippet',
      });
    }

    const { title, language, sourceCode, stdin, output, visibility } = req.body;

    if (title) snippet.title = title;
    if (language) snippet.language = language;
    if (sourceCode) snippet.sourceCode = sourceCode;
    if (stdin !== undefined) snippet.stdin = stdin;
    if (output !== undefined) snippet.output = output;
    if (visibility) snippet.visibility = visibility;

    snippet.updatedAt = Date.now();

    await snippet.save();

    res.status(200).json({
      success: true,
      message: 'Snippet updated successfully',
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Private
export const deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found',
      });
    }

    // Check if user is the owner
    if (snippet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this snippet',
      });
    }

    await snippet.deleteOne();

    // Decrement user's snippet count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalSnippets: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Snippet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};