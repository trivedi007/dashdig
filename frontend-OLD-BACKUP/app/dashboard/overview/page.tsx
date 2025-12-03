'use client'

export default function OverviewPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2 font-medium">Monitor your humanized and shortenized URLs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              🔗
            </div>
            <span className="text-green-500 text-sm font-semibold">+10</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">TOTAL LINKS</p>
          <p className="text-3xl font-bold text-gray-900">84</p>
          <p className="text-green-500 text-sm mt-2">+10 this week</p>
        </div>

        {/* Total Clicks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              👆
            </div>
            <span className="text-green-500 text-sm font-semibold">+12</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">TOTAL CLICKS</p>
          <p className="text-3xl font-bold text-gray-900">79</p>
          <p className="text-green-500 text-sm mt-2">+12 this week</p>
        </div>

        {/* Avg Clicks/URL */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              📈
            </div>
            <span className="text-orange-500 text-sm font-semibold">94.0%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">AVG CLICKS/URL</p>
          <p className="text-3xl font-bold text-gray-900">1</p>
          <p className="text-orange-500 text-sm mt-2">94.0% CTR</p>
        </div>

        {/* Active Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              ✅
            </div>
            <span className="text-purple-500 text-sm font-semibold">56%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">ACTIVE LINKS</p>
          <p className="text-3xl font-bold text-gray-900">47</p>
          <p className="text-purple-500 text-sm mt-2">56% active</p>
        </div>
      </div>

      {/* Top Performing URLs */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing URLs</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                #1
              </div>
              <div>
                <p className="font-semibold text-gray-900">nike.vaporfly.running</p>
                <p className="text-sm text-gray-600">https://www.nike.com/vaporfly</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">10</p>
              <p className="text-sm text-gray-600">CLICKS</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                #2
              </div>
              <div>
                <p className="font-semibold text-gray-900">tide.laundry.detergent</p>
                <p className="text-sm text-gray-600">https://www.uline.com/Product/Detail/S-25975</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">10</p>
              <p className="text-sm text-gray-600">CLICKS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
