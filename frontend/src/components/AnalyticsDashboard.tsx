'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  totalClicks: number
  uniqueCountries: number
  uniqueDevices: number
  uniqueBrowsers: number
  uniqueReferrers: number
  topCountries: Array<{ country: string; count: number }>
  topDevices: Array<{ device: string; count: number }>
  topBrowsers: Array<{ browser: string; count: number }>
  topReferrers: Array<{ referrer: string; count: number }>
}

interface TimeSeriesData {
  date: any
  clicks: number
  uniqueVisitors: number
}

interface ClickLog {
  _id: string
  timestamp: string
  clickData: {
    ip: string
    country: string
    city: string
    device: string
    browser: string
    os: string
    referrer: string
    language: string
  }
}

interface AnalyticsDashboardProps {
  urlId: string
  shortCode: string
  originalUrl: string
}

export default function AnalyticsDashboard({ urlId, shortCode, originalUrl }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [clickLogs, setClickLogs] = useState<ClickLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'timeseries' | 'logs'>('overview')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [urlId, timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Use mock data for demo purposes
      setAnalyticsData({
        totalClicks: 247,
        uniqueCountries: 12,
        uniqueDevices: 3,
        uniqueBrowsers: 5,
        uniqueReferrers: 8,
        topCountries: [
          { country: 'United States', count: 142 },
          { country: 'Canada', count: 38 },
          { country: 'United Kingdom', count: 28 },
          { country: 'Germany', count: 15 },
          { country: 'Australia', count: 12 },
          { country: 'France', count: 8 },
          { country: 'Japan', count: 4 }
        ],
        topDevices: [
          { device: 'desktop', count: 156 },
          { device: 'mobile', count: 78 },
          { device: 'tablet', count: 13 }
        ],
        topBrowsers: [
          { browser: 'Chrome', count: 134 },
          { browser: 'Safari', count: 67 },
          { browser: 'Firefox', count: 28 },
          { browser: 'Edge', count: 15 },
          { browser: 'Opera', count: 3 }
        ],
        topReferrers: [
          { referrer: 'Direct', count: 89 },
          { referrer: 'Google', count: 67 },
          { referrer: 'Facebook', count: 34 },
          { referrer: 'Twitter', count: 28 },
          { referrer: 'LinkedIn', count: 15 },
          { referrer: 'Reddit', count: 8 },
          { referrer: 'Email', count: 6 }
        ]
      });
      
      setTimeSeriesData([
        { date: { year: 2025, month: 10, day: 8 }, clicks: 23, uniqueVisitors: 18 },
        { date: { year: 2025, month: 10, day: 9 }, clicks: 45, uniqueVisitors: 32 },
        { date: { year: 2025, month: 10, day: 10 }, clicks: 67, uniqueVisitors: 48 },
        { date: { year: 2025, month: 10, day: 11 }, clicks: 89, uniqueVisitors: 61 },
        { date: { year: 2025, month: 10, day: 12 }, clicks: 23, uniqueVisitors: 18 }
      ]);
      
      setClickLogs([
        {
          _id: 'mock1',
          timestamp: new Date().toISOString(),
          clickData: {
            ip: '192.168.1.1',
            country: 'United States',
            city: 'San Francisco',
            device: 'desktop',
            browser: 'Chrome',
            os: 'Windows',
            referrer: 'https://google.com',
            language: 'en-US'
          }
        },
        {
          _id: 'mock2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          clickData: {
            ip: '192.168.1.2',
            country: 'Canada',
            city: 'Toronto',
            device: 'mobile',
            browser: 'Safari',
            os: 'iOS',
            referrer: 'Direct',
            language: 'en-CA'
          }
        },
        {
          _id: 'mock3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          clickData: {
            ip: '192.168.1.3',
            country: 'United Kingdom',
            city: 'London',
            device: 'desktop',
            browser: 'Firefox',
            os: 'macOS',
            referrer: 'https://facebook.com',
            language: 'en-GB'
          }
        }
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      // Mock export functionality
      alert(`Exporting analytics data as ${format.toUpperCase()}...`)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊', desc: 'Key metrics and insights' },
              { id: 'timeseries', label: 'Time Series', icon: '📈', desc: 'Click trends over time' },
              { id: 'logs', label: 'Click Logs', icon: '📋', desc: 'Detailed click history' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs text-gray-500">{tab.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Analytics Content */}
      {activeTab === 'overview' && analyticsData && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <span className="text-2xl text-white">👆</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalClicks.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-medium">+12% from last week</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                  <span className="text-2xl text-white">🌍</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Countries</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.uniqueCountries}</p>
                  <p className="text-xs text-blue-600 font-medium">Global reach</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <span className="text-2xl text-white">📱</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Device Types</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.uniqueDevices}</p>
                  <p className="text-xs text-purple-600 font-medium">Multi-platform</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <span className="text-2xl text-white">🌐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Browsers</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.uniqueBrowsers}</p>
                  <p className="text-xs text-orange-600 font-medium">Cross-browser</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Countries Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Top Countries</h3>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🌍</span>
                </div>
              </div>
              <div className="space-y-4">
                {analyticsData.topCountries.slice(0, 5).map((country, index) => {
                  const percentage = (country.count / analyticsData.totalClicks) * 100;
                  return (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900 flex-1">{country.country || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12 text-right">{country.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device Types Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Device Types</h3>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📱</span>
                </div>
              </div>
              <div className="space-y-4">
                {analyticsData.topDevices.map((device, index) => {
                  const percentage = (device.count / analyticsData.totalClicks) * 100;
                  const colors = [
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600', 
                    'from-purple-500 to-purple-600'
                  ];
                  return (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className={`w-8 h-8 bg-gradient-to-r ${colors[index % colors.length]} rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3`}>
                          {device.device === 'desktop' ? '🖥️' : device.device === 'mobile' ? '📱' : '📱'}
                        </div>
                        <span className="text-sm font-medium text-gray-900 flex-1 capitalize">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12 text-right">{device.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Browsers */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Top Browsers</h3>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🌐</span>
                </div>
              </div>
              <div className="space-y-3">
                {analyticsData.topBrowsers?.slice(0, 5).map((browser, index) => {
                  const percentage = (browser.count / analyticsData.totalClicks) * 100;
                  return (
                    <div key={browser.browser} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 w-8">#{index + 1}</span>
                        <span className="text-sm text-gray-700 ml-2">{browser.browser}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{browser.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Top Referrers</h3>
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🔗</span>
                </div>
              </div>
              <div className="space-y-3">
                {analyticsData.topReferrers?.slice(0, 5).map((referrer, index) => {
                  const percentage = (referrer.count / analyticsData.totalClicks) * 100;
                  return (
                    <div key={referrer.referrer} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 w-8">#{index + 1}</span>
                        <span className="text-sm text-gray-700 ml-2">{referrer.referrer || 'Direct'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-pink-500 to-rose-600 h-1.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{referrer.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Series Tab */}
      {activeTab === 'timeseries' && timeSeriesData && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Click Trends Over Time</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📈</span>
            </div>
          </div>
          {timeSeriesData.length > 0 ? (
            <div className="h-64 flex items-end justify-around border-b border-l border-gray-200 pt-4">
              {timeSeriesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center h-full justify-end group relative">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md transition-all duration-300 hover:scale-y-105"
                    style={{ height: `${(data.clicks / Math.max(...timeSeriesData.map(d => d.clicks))) * 90 + 10}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{data.date.day}/{data.date.month}</span>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {data.clicks} clicks
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📈</span>
              </div>
              <p className="text-gray-500 text-lg">No time series data available</p>
              <p className="text-gray-400 text-sm">Click data will appear here over time</p>
            </div>
          )}
        </div>
      )}

      {/* Click Logs Tab */}
      {activeTab === 'logs' && clickLogs && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Detailed Click Logs</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📋</span>
            </div>
          </div>
          {clickLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clickLogs.map((log) => (
                    <tr key={log._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.clickData.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.clickData.city}, {log.clickData.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.clickData.device}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.clickData.browser}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.clickData.os}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline truncate max-w-xs">
                        {log.clickData.referrer ? <a href={log.clickData.referrer} target="_blank" rel="noopener noreferrer">{log.clickData.referrer}</a> : 'Direct'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📋</span>
              </div>
              <p className="text-gray-500 text-lg">No click logs available</p>
              <p className="text-gray-400 text-sm">Click logs will appear as users visit your links</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}