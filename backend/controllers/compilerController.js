import { executeCode } from '../utils/judge0.js';
import User from '../models/User.js';

// @desc    Execute code using Judge0
// @route   POST /api/compiler/run
// @access  Public (with optional auth for tracking)
export const runCode = async (req, res, next) => {
  try {
    const { language, code, stdin } = req.body;

    // Validate code is not empty
    if (!code || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Code cannot be empty',
      });
    }

    // Execute code using Judge0
    const result = await executeCode(language, code, stdin || '');

    // If user is authenticated, increment execution count
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalExecutions: 1 },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Code executed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Code execution error:', error.message);
    next(error);
  }
};