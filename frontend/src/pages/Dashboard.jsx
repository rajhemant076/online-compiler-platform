import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, FileText, TrendingUp } from 'lucide-react';
import { snippetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SnippetCard from '../components/SnippetCard';

const Dashboard = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMySnippets();
  }, []);

  const fetchMySnippets = async () => {
    try {
      const response = await snippetAPI.getMySnippets({ page: 1, limit: 10 });
      setSnippets(response.data.data.snippets);
    } catch (error) {
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnippet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) {
      return;
    }

    try {
      await snippetAPI.delete(id);
      setSnippets(snippets.filter((s) => s._id !== id));
      alert('Snippet deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete snippet');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Snippets
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.totalSnippets || 0}
                </p>
              </div>
              <FileText className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Code Executions
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.totalExecutions || 0}
                </p>
              </div>
              <Code2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Activity Score
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {(user?.totalSnippets || 0) + (user?.totalExecutions || 0)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* My Snippets */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Snippets
            </h2>
            <Link
              to="/compiler"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create New
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : snippets.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't created any snippets yet
              </p>
              <Link
                to="/compiler"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Your First Snippet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {snippets.map((snippet) => (
                <SnippetCard
                  key={snippet._id}
                  snippet={snippet}
                  onDelete={handleDeleteSnippet}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;