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
  console.log('🔍 AnalyticsDashboard rendered with props:', { urlId, shortCode, originalUrl })
  
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
      
      // If no URL ID, use mock data for now
      if (!urlId) {
        setAnalyticsData({
          totalClicks: 17,
          uniqueCountries: 3,
          uniqueDevices: 2,
          uniqueBrowsers: 2,
          uniqueReferrers: 1,
          topCountries: [
            { country: 'United States', count: 12 },
            { country: 'Canada', count: 3 },
            { country: 'United Kingdom', count: 2 }
          ],
          topDevices: [
            { device: 'desktop', count: 10 },
            { device: 'mobile', count: 7 }
          ]
        });
        
        setTimeSeriesData([
          { date: { year: 2025, month: 10, day: 10 }, clicks: 5, uniqueVisitors: 4 },
          { date: { year: 2025, month: 10, day: 11 }, clicks: 8, uniqueVisitors: 6 },
          { date: { year: 2025, month: 10, day: 12 }, clicks: 4, uniqueVisitors: 3 }
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
          }
        ]);
        
        setLoading(false);
        return;
      }
      
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';
      const token = localStorage.getItem('token');
      
      const [analyticsResponse, timeSeriesResponse, logsResponse] = await Promise.all([
        fetch(`${API_URL}/api/analytics/url/${urlId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_URL}/api/analytics/url/${urlId}/timeseries?period=day&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_URL}/api/analytics/url/${urlId}/clicks?page=1&limit=20`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json()
        setAnalyticsData(analytics.data)
      }

      if (timeSeriesResponse.ok) {
        const timeSeries = await timeSeriesResponse.json()
        setTimeSeriesData(timeSeries.data)
      }

      if (logsResponse.ok) {
        const logs = await logsResponse.json()
        setClickLogs(logs.data)
      }

    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      
      const endDate = new Date()
      const startDate = new Date()
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-backend-production.up.railway.app';
      const response = await fetch(`${API_URL}/api/analytics/url/${urlId}/export?format=${format}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${shortCode}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  // Debug render
  console.log('🔍 AnalyticsDashboard render - loading:', loading, 'analyticsData:', analyticsData)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">dashdig.com/{shortCode}</span>
              <span className="mx-2">→</span>
              <span className="text-sm">{originalUrl}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            {/* Export Buttons */}
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Export JSON'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'timeseries', label: 'Time Series', icon: '📈' },
              { id: 'logs', label: 'Click Logs', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Analytics Content */}
      {activeTab === 'overview' && analyticsData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👆</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalClicks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Countries</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueCountries}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Device Types</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueDevices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">🌐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Browsers</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueBrowsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          {analyticsData.topCountries.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {analyticsData.topCountries.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 w-8">#{index + 1}</span>
                      <span className="text-sm text-gray-700 ml-2">{country.country || 'Unknown'}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{country.count} clicks</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Devices */}
          {analyticsData.topDevices.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
              <div className="space-y-3">
                {analyticsData.topDevices.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 w-8">#{index + 1}</span>
                      <span className="text-sm text-gray-700 ml-2 capitalize">{device.device}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{device.count} clicks</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeseries' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Click Trends</h3>
          {timeSeriesData.length > 0 ? (
            <div className="space-y-4">
              {timeSeriesData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(data.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {data.uniqueVisitors} unique visitors
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {data.clicks} clicks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No time series data available</p>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Clicks</h3>
          </div>
          {clickLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Browser
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clickLogs.map((log) => (
                    <tr key={log._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {log.clickData.device}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.clickData.browser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.clickData.country || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {log.clickData.referrer || 'Direct'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No click logs available</p>
          )}
        </div>
      )}
    </div>
  )
}
