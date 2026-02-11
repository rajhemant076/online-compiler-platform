import axios from 'axios';

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com';

// Judge0 Language IDs (Free Public API)
export const LANGUAGE_IDS = {
  'c': 50,          // C (GCC 9.2.0)
  'cpp': 54,        // C++ (GCC 9.2.0)
  'java': 62,       // Java (OpenJDK 13.0.1)
  'python': 71,     // Python (3.8.1)
};

/**
 * Submit code to Judge0 for execution
 * @param {string} language - Programming language (c, cpp, java, python)
 * @param {string} sourceCode - Source code to execute
 * @param {string} stdin - Standard input
 * @returns {string} Submission token
 */
export const submitCode = async (language, sourceCode, stdin = '') => {
  const languageId = LANGUAGE_IDS[language.toLowerCase()];
  
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const response = await axios.post(
      `${JUDGE0_BASE_URL}/submissions`,
      {
        language_id: languageId,
        source_code: sourceCode,
        stdin: stdin,
      },
      {
        params: {
          base64_encoded: false,
          wait: false,
        },
      }
    );

    return response.data.token;
  } catch (error) {
    console.error('Judge0 submission error:', error.response?.data || error.message);
    throw new Error('Failed to submit code for execution');
  }
};

/**
 * Get submission result from Judge0
 * @param {string} token - Submission token
 * @returns {object} Submission result
 */
export const getSubmission = async (token) => {
  try {
    const response = await axios.get(
      `${JUDGE0_BASE_URL}/submissions/${token}`,
      {
        params: {
          base64_encoded: false,
          fields: '*',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Judge0 fetch error:', error.response?.data || error.message);
    throw new Error('Failed to fetch submission result');
  }
};

/**
 * Poll submission until completion
 * @param {string} token - Submission token
 * @param {number} maxAttempts - Maximum polling attempts
 * @param {number} interval - Interval between polls in milliseconds
 * @returns {object} Final submission result
 */
export const pollSubmission = async (token, maxAttempts = 30, interval = 1000) => {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await getSubmission(token);
    
    // Status IDs:
    // 1 = In Queue
    // 2 = Processing
    // 3 = Accepted
    // 4 = Wrong Answer
    // 5 = Time Limit Exceeded
    // 6 = Compilation Error
    // 7-14 = Runtime Errors
    
    if (result.status.id > 2) {
      // Execution completed
      return result;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error('Execution timeout: Result not ready after maximum attempts');
};

/**
 * Execute code and return formatted result
 * @param {string} language - Programming language
 * @param {string} sourceCode - Source code
 * @param {string} stdin - Standard input
 * @returns {object} Formatted execution result
 */
export const executeCode = async (language, sourceCode, stdin = '') => {
  // Submit code
  const token = await submitCode(language, sourceCode, stdin);
  
  // Poll for result
  const result = await pollSubmission(token);
  
  // Format response
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    compile_output: result.compile_output || '',
    time: result.time || '0',
    memory: result.memory || '0',
    status: {
      id: result.status.id,
      description: result.status.description,
    },
    token: token,
  };
};