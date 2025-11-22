'use client';

export default function AnalyticsPage() {
  return (
    <div id="section-analytics" className="section-content p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Analytics</h2>
          <p className="text-gray-600 font-medium">Detailed metrics for all your links</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Analytics Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">nike.vaporfly.running</h3>
                <p className="text-sm text-gray-500 truncate">https://www.nike.com/vaporfly</p>
              </div>
              <div className="ml-4">
                <i className="fas fa-chart-line text-2xl text-orange-500"></i>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-4xl font-bold text-orange-600">10</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Clicks</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="text-orange-600 font-semibold text-sm hover:underline tracking-tight">View Report</button>
              <button className="text-gray-500 font-semibold text-sm hover:text-orange-600 tracking-tight">Insights →</button>
            </div>
          </div>

          {/* Analytics Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">tide.laundry.detergent</h3>
                <p className="text-sm text-gray-500 truncate">https://www.uline.com/Product...</p>
              </div>
              <div className="ml-4">
                <i className="fas fa-chart-line text-2xl text-blue-500"></i>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-4xl font-bold text-blue-600">10</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Clicks</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="text-blue-600 font-semibold text-sm hover:underline tracking-tight">View Report</button>
              <button className="text-gray-500 font-semibold text-sm hover:text-blue-600 tracking-tight">Insights →</button>
            </div>
          </div>

          {/* Analytics Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">cvs.shop.tide</h3>
                <p className="text-sm text-gray-500 truncate">https://www.cvs.com/shop/tide</p>
              </div>
              <div className="ml-4">
                <i className="fas fa-chart-line text-2xl text-green-500"></i>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-4xl font-bold text-green-600">6</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Total Clicks</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="text-green-600 font-semibold text-sm hover:underline tracking-tight">View Report</button>
              <button className="text-gray-500 font-semibold text-sm hover:text-green-600 tracking-tight">Insights →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
