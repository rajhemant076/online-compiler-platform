import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Code2, User, Trash2, Edit } from 'lucide-react';
import { LANGUAGES } from '../utils/constants';

const SnippetCard = ({ snippet, onDelete, showActions = false }) => {
  const language = LANGUAGES.find((l) => l.id === snippet.language);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link
            to={`/snippet/${snippet._id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {snippet.title}
          </Link>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Code2 className="w-4 h-4" />
              <span>{language?.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(snippet.createdAt)}</span>
            </div>
            {snippet.userId?.name && (
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{snippet.userId.name}</span>
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/compiler?snippet=${snippet._id}`}
              className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(snippet._id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-800 dark:text-gray-200">
          {snippet.sourceCode.substring(0, 150)}
          {snippet.sourceCode.length > 150 && '...'}
        </pre>
      </div>
    </div>
  );
};

export default SnippetCard;