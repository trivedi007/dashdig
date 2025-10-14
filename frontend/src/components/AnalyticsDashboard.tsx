'use client'

export default function AnalyticsDashboard({ urlId, shortCode, originalUrl }: any) {
  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics for {shortCode}</h2>
        <p className="text-gray-600 text-sm">dashdig.com/{shortCode}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">247</div>
          <div className="text-sm text-blue-800">Total Clicks</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-green-800">Countries</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">3</div>
          <div className="text-sm text-purple-800">Device Types</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">5</div>
          <div className="text-sm text-orange-800">Browsers</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Top Countries</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">United States</span>
              <span className="font-bold text-gray-900">142</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Canada</span>
              <span className="font-bold text-gray-900">38</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">United Kingdom</span>
              <span className="font-bold text-gray-900">28</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Device Types</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Desktop</span>
              <span className="font-bold text-gray-900">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Mobile</span>
              <span className="font-bold text-gray-900">78</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Tablet</span>
              <span className="font-bold text-gray-900">13</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}