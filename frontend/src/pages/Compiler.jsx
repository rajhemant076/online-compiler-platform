import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Save, Share2, Download } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import { compilerAPI, snippetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_CODE, STATUS_MESSAGES } from '../utils/constants';

const Compiler = () => {
  const [searchParams] = useSearchParams();
  const snippetId = searchParams.get('snippet');

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (snippetId) {
      loadSnippet(snippetId);
    }
  }, [snippetId]);

  const loadSnippet = async (id) => {
    try {
      const response = await snippetAPI.getById(id);
      const snippet = response.data.data.snippet;
      setLanguage(snippet.language);
      setCode(snippet.sourceCode);
      setStdin(snippet.stdin || '');
      setOutput(snippet.output || '');
      setSaveTitle(snippet.title);
    } catch (error) {
      console.error('Error loading snippet:', error);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
    setStdin('');
    setOutput('');
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Error: Code cannot be empty');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...');

    try {
      const response = await compilerAPI.runCode({
        language,
        code,
        stdin,
      });

      const result = response.data.data;
      let outputText = '';

      if (result.compile_output) {
        outputText += `Compilation Error:\n${result.compile_output}\n\n`;
      }

      if (result.stderr) {
        outputText += `Runtime Error:\n${result.stderr}\n\n`;
      }

      if (result.stdout) {
        outputText += `Output:\n${result.stdout}`;
      }

      if (!result.stdout && !result.stderr && !result.compile_output) {
        outputText = 'No output';
      }

      outputText += `\n\nStatus: ${STATUS_MESSAGES[result.status.id] || result.status.description}`;
      outputText += `\nExecution Time: ${result.time}s`;
      outputText += `\nMemory Used: ${result.memory} KB`;

      setOutput(outputText);
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || 'Failed to execute code'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveSnippet = async () => {
    if (!isAuthenticated) {
      alert('Please login to save snippets');
      navigate('/login');
      return;
    }

    if (!saveTitle.trim()) {
      alert('Please enter a title for your snippet');
      return;
    }

    setIsSaving(true);

    try {
      const response = await snippetAPI.create({
        title: saveTitle,
        language,
        sourceCode: code,
        stdin,
        output,
        visibility: 'public',
      });

      const snippet = response.data.data.snippet;
      alert('Snippet saved successfully!');
      setShowSaveModal(false);
      setSaveTitle('');
      navigate(`/snippet/${snippet._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save snippet');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (snippetId) {
      const url = `${window.location.origin}/snippet/${snippetId}`;
      navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    } else {
      alert('Please save the snippet first to get a shareable link');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Code Compiler
          </h1>
          <div className="flex items-center space-x-4">
            <LanguageSelector
              selectedLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Code Editor
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            <CodeEditor language={language} value={code} onChange={setCode} height="500px" />
          </div>

          {/* Input/Output */}
          <div className="space-y-4">
            {/* Input */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Input (stdin)
              </h2>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input here..."
                className="w-full h-48 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm text-gray-900 dark:text-white"
              />
            </div>

            {/* Output */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Output
              </h2>
              <div className="w-full h-80 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg overflow-auto">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {output || 'Output will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Save Snippet
            </h3>
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="Enter snippet title..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSaveTitle('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSnippet}
                disabled={isSaving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compiler;