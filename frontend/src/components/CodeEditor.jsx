import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange, height = '500px' }) => {
  const getMonacoLanguage = (lang) => {
    const langMap = {
      c: 'c',
      cpp: 'cpp',
      java: 'java',
      python: 'python',
    };
    return langMap[lang] || 'plaintext';
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={onChange}
        theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;