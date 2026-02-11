import React from 'react';
import { User, Mail, Calendar, Code2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.name}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Snippets
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.totalSnippets || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Code2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Code Executions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.totalExecutions || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Account Information
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Name:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user?.name}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user?.email}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Account Created:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 dark:text-gray-400">Activity Score:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(user?.totalSnippets || 0) + (user?.totalExecutions || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;