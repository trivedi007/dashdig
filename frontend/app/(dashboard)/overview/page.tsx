'use client';

import { useEffect, useState } from 'react';
import { 
  FaLink, 
  FaMousePointer, 
  FaChartLine, 
  FaCheckCircle,
  FaTrophy,
  FaArrowUp,
  FaArrowDown 
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useUrls } from '../../../lib/hooks/useUrls';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function OverviewPage() {
  const { data, isLoading, error } = useUrls();
  
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    avgClicksPerUrl: 0,
    activeLinks: 0,
    ctr: 0,
    weeklyGrowth: 0,
    clickGrowth: 0
  });

  const [topUrls, setTopUrls] = useState<Array<{
    slug: string;
    url: string;
    clicks: number;
  }>>([]);

  // Update stats when data loads
  useEffect(() => {
    if (data?.urls) {
      const urls = data.urls;
      const totalClicks = data.totalClicks || 0;
      const avgClicks = urls.length > 0 ? Math.round(totalClicks / urls.length) : 0;
      const activeLinks = urls.filter(u => u.clicks > 0).length;
      const ctr = urls.length > 0 ? ((totalClicks / urls.length) * 100) : 0;
      
      // Calculate weekly growth (mock data for now)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentUrls = urls.filter(u => new Date(u.createdAt) > weekAgo).length;
      
      setStats({
        totalUrls: urls.length,
        totalClicks: totalClicks,
        avgClicksPerUrl: avgClicks,
        activeLinks: activeLinks,
        ctr: parseFloat(ctr.toFixed(1)),
        weeklyGrowth: recentUrls,
        clickGrowth: Math.round(totalClicks * 0.15)
      });

      // Set top URLs
      const sorted = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 3);
      setTopUrls(sorted.map(u => ({
        slug: u.shortCode,
        url: u.originalUrl,
        clicks: u.clicks
      })));
    }
  }, [data]);

  // Chart configuration
  const chartData = {
    labels: ['Oct 29', 'Oct 30', 'Oct 31', 'Nov 01', 'Nov 02', 'Nov 03', 'Nov 04'],
    datasets: [
      {
        label: 'Clicks',
        data: [12, 10, 5, 8, 9, 11, 6],
        borderColor: '#FF6B2C',
        backgroundColor: 'rgba(255, 107, 44, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#FF6B2C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#FF6B2C',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        borderRadius: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
          borderDash: [5, 5],
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          }
        }
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <p className="text-xl font-bold text-slate-900 mb-2">Error loading data</p>
          <p className="text-slate-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-lg text-gray-600">
            Track your link performance and analytics
          </p>
        </div>

        {/* Stats Grid - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Total URLs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
                <FaLink className="text-white text-2xl" />
              </div>
              {stats.weeklyGrowth > 0 && (
                <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                  <FaArrowUp className="text-xs" />
                  <span>+{stats.weeklyGrowth}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                Total Links
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stats.totalUrls}
              </p>
              <p className="text-sm text-gray-500">
                <span className="text-green-600 font-semibold">+{stats.weeklyGrowth}</span> this week
              </p>
            </div>
          </div>

          {/* Card 2: Total Clicks */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <FaMousePointer className="text-white text-2xl" />
              </div>
              {stats.clickGrowth > 0 && (
                <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                  <FaArrowUp className="text-xs" />
                  <span>+{stats.clickGrowth}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                Total Clicks
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stats.totalClicks}
              </p>
              <p className="text-sm text-gray-500">
                <span className="text-green-600 font-semibold">+{stats.clickGrowth}</span> this week
              </p>
            </div>
          </div>

          {/* Card 3: Avg Clicks/URL */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-200">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <div className="flex items-center space-x-1 text-orange-600 text-sm font-semibold bg-orange-50 px-3 py-1 rounded-full">
                <span>{stats.ctr.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                Avg Clicks/URL
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stats.avgClicksPerUrl}
              </p>
              <p className="text-sm text-gray-500">
                <span className="text-orange-600 font-semibold">{stats.ctr.toFixed(1)}%</span> CTR
              </p>
            </div>
          </div>

          {/* Card 4: Active Links */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
              <div className="flex items-center space-x-1 text-purple-600 text-sm font-semibold bg-purple-50 px-3 py-1 rounded-full">
                <span>{stats.totalUrls > 0 ? Math.round((stats.activeLinks / stats.totalUrls) * 100) : 0}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                Active Links
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stats.activeLinks}
              </p>
              <p className="text-sm text-gray-500">
                <span className="text-purple-600 font-semibold">
                  {stats.totalUrls > 0 ? Math.round((stats.activeLinks / stats.totalUrls) * 100) : 0}%
                </span> active
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Clicks Over Time
              </h2>
              <p className="text-sm text-gray-500">
                Last 7 days performance
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Period:</span>
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="h-[350px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Performing URLs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <FaTrophy className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Top Performing URLs
              </h2>
              <p className="text-sm text-gray-500">
                Your best performing links this week
              </p>
            </div>
          </div>
          
          {topUrls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No URLs created yet</p>
              <Link
                href="/dashboard"
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-xl"
              >
                Create Your First URL
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {topUrls.map((url, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 hover:border-orange-200"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold shadow-lg shadow-orange-200">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/analytics/${url.slug}`}
                          className="font-semibold text-orange-600 text-lg mb-1 hover:underline cursor-pointer block"
                        >
                          {url.slug}
                        </Link>
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {url.url}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        {url.clicks}
                      </p>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">
                        CLICKS
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/analytics"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-xl"
                >
                  View All Analytics
                </Link>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
