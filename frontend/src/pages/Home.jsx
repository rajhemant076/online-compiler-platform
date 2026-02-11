import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Zap, Share2, Lock } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Multi-Language Support',
      description: 'Write and execute code in C, C++, Java, and Python with syntax highlighting.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Execution',
      description: 'Run your code instantly with our powerful Judge0-powered execution engine.',
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: 'Share Code Snippets',
      description: 'Save and share your code snippets with unique URLs for collaboration.',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your code is secure with private snippets and JWT-based authentication.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Code. Compile. Share.
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            An online code compiler platform that lets you write, execute, and share code
            in multiple programming languages instantly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/compiler"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-lg transition-colors"
            >
              Start Coding
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-lg border-2 border-primary-600 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose CodeCompiler?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 card-hover"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start coding?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of developers using CodeCompiler for their coding needs.
          </p>
          <Link
            to="/compiler"
            className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 font-medium text-lg transition-colors"
          >
            Try it Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;