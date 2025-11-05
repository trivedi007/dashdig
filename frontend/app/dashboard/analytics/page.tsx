'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUrls } from '../../../lib/hooks/useUrls';

export default function AnalyticsPage() {
  const { data, isLoading, error } = useUrls();

  // Define color schemes for cards
  const colorSchemes = [
    {
      name: 'orange',
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      icon: 'text-orange-500',
      button: 'border-orange-500 text-orange-600 hover:bg-orange-50',
    },
    {
      name: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      icon: 'text-blue-500',
      button: 'border-blue-500 text-blue-600 hover:bg-blue-50',
    },
    {
      name: 'green',
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: 'text-green-500',
      button: 'border-green-500 text-green-600 hover:bg-green-50',
    },
    {
      name: 'purple',
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      icon: 'text-purple-500',
      button: 'border-purple-500 text-purple-600 hover:bg-purple-50',
    },
    {
      name: 'pink',
      bg: 'bg-pink-100',
      text: 'text-pink-600',
      icon: 'text-pink-500',
      button: 'border-pink-500 text-pink-600 hover:bg-pink-50',
    },
    {
      name: 'indigo',
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      icon: 'text-indigo-500',
      button: 'border-indigo-500 text-indigo-600 hover:bg-indigo-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">Error loading analytics</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  // Get URLs for analytics cards
  const urls = data?.urls || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">View detailed analytics for all your shortened URLs</p>
      </div>

      {/* Analytics Cards Grid */}
      {urls.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-bar text-orange-600 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Analytics Yet</h3>
            <p className="text-gray-600 mb-6">
              Create shortened URLs to start tracking analytics and insights.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md shadow-orange-200 hover:shadow-lg"
            >
              <i className="fas fa-plus"></i>
              <span>Create Your First URL</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urls.map((url, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];
            
            return (
              <div
                key={url._id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* URL Title */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {url.shortCode}
                  </h3>
                  <p
                    className="text-sm text-gray-500 truncate cursor-help"
                    title={url.originalUrl}
                  >
                    {url.originalUrl.length > 40
                      ? `${url.originalUrl.substring(0, 40)}...`
                      : url.originalUrl}
                  </p>
                </div>

                {/* Chart Icon and Clicks */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 ${colorScheme.bg} rounded-xl flex items-center justify-center`}>
                    <i className={`fas fa-chart-line text-3xl ${colorScheme.icon}`}></i>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${colorScheme.text}`}>
                      {url.clicks}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                      TOTAL CLICKS
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Link
                    href={`/dashboard/analytics/${url.shortCode}`}
                    className={`block w-full px-4 py-2.5 border-2 ${colorScheme.button} rounded-lg font-semibold text-center transition-all duration-200`}
                  >
                    View Report
                  </Link>
                  <Link
                    href={`/dashboard/analytics/${url.shortCode}`}
                    className="block w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Insights →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
