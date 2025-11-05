'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function OverviewPage() {
  useEffect(() => {
    // Initialize Chart after component mounts
    if (typeof window !== 'undefined' && (window as any).Chart) {
      const ctx = (document.getElementById('clicksChart') as HTMLCanvasElement)?.getContext('2d');
      if (ctx) {
        new (window as any).Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Oct 29', 'Oct 30', 'Oct 31', 'Nov 01', 'Nov 02', 'Nov 03', 'Nov 04'],
            datasets: [{
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
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1F2937',
                padding: 12,
                borderRadius: 8,
                displayColors: false,
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#6B7280', font: { size: 12 } }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#F3F4F6',
                  borderDash: [5, 5],
                },
                ticks: { color: '#6B7280', font: { size: 12 } }
              },
            },
          }
        });
      }
    }
  }, []);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="lazyOnload" />
      
      <div id="section-overview" className="section-content p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Links Card */}
            <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 orange-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-link text-white text-2xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                  <i className="fas fa-arrow-up text-xs"></i>
                  <span>+10</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Links</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">84</p>
                <p className="text-sm text-gray-500">
                  <span className="text-green-600 font-semibold">+10</span> this week
                </p>
              </div>
            </div>

            {/* Total Clicks Card */}
            <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 blue-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-mouse-pointer text-white text-2xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                  <i className="fas fa-arrow-up text-xs"></i>
                  <span>+12</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Clicks</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">79</p>
                <p className="text-sm text-gray-500">
                  <span className="text-green-600 font-semibold">+12</span> this week
                </p>
              </div>
            </div>

            {/* Avg Clicks Card */}
            <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 green-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-chart-line text-white text-2xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-orange-600 text-sm font-semibold bg-orange-50 px-3 py-1 rounded-full">
                  <span>94.0%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Avg Clicks/URL</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">1</p>
                <p className="text-sm text-gray-500">
                  <span className="text-orange-600 font-semibold">94.0%</span> CTR
                </p>
              </div>
            </div>

            {/* Active Links Card */}
            <div className="stat-card bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 purple-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-check-circle text-white text-2xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-purple-600 text-sm font-semibold bg-purple-50 px-3 py-1 rounded-full">
                  <span>56%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Active Links</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">47</p>
                <p className="text-sm text-gray-500">
                  <span className="text-purple-600 font-semibold">56%</span> active
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Clicks Over Time</h2>
                <p className="text-sm text-gray-500">Last 7 days performance</p>
              </div>
              <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <canvas id="clicksChart" height="80"></canvas>
          </div>

          {/* Top Performing URLs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <i className="fas fa-trophy text-white text-lg"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top Performing URLs</h2>
                <p className="text-sm text-gray-500">Your best performing links this week</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full orange-gradient text-white font-bold shadow-lg">
                    #1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-orange-600 text-lg mb-1 hover:underline cursor-pointer">nike.vaporfly.running</p>
                    <p className="text-sm text-gray-500 truncate">https://www.nike.com/vaporfly</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">10</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">CLICKS</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full blue-gradient text-white font-bold shadow-lg">
                    #2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-600 text-lg mb-1 hover:underline cursor-pointer">tide.laundry.detergent</p>
                    <p className="text-sm text-gray-500 truncate">https://www.uline.com/Product/Detail/S-25975</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">10</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">CLICKS</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full green-gradient text-white font-bold shadow-lg">
                    #3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-600 text-lg mb-1 hover:underline cursor-pointer">cvs.shop.tide</p>
                    <p className="text-sm text-gray-500 truncate">https://www.cvs.com/shop/tide</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">4</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">CLICKS</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="px-6 py-3 orange-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                View All Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
