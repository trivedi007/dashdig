'use client';

export default function UrlsPage() {
  return (
    <div id="section-urls" className="section-content p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">URL Management</h2>
            <button className="px-6 py-3 orange-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all tracking-tight">
              <i className="fas fa-plus mr-2"></i>Create New URL
            </button>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input type="text" placeholder="Search URLs..." className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Short URL</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Original URL</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Clicks</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Created</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <a href="#" className="text-orange-600 font-semibold hover:underline">nike.vaporfly.running</a>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600 text-sm truncate max-w-xs block" title="https://www.nike.com/vaporfly">
                      https://www.nike.com/vaporfly
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-gray-900">10</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">Nov 2, 2025</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-3">
                      <button className="text-gray-400 hover:text-orange-600 transition-colors">
                        <i className="fas fa-copy"></i>
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <a href="#" className="text-orange-600 font-semibold hover:underline">tide.laundry.detergent</a>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600 text-sm truncate max-w-xs block">
                      https://www.uline.com/Product/Detail/S-25975...
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-gray-900">10</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">Nov 1, 2025</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-3">
                      <button className="text-gray-400 hover:text-orange-600 transition-colors">
                        <i className="fas fa-copy"></i>
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1-10 of 84 URLs</p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-semibold">Previous</button>
              <button className="px-4 py-2 orange-gradient text-white rounded-lg shadow-lg font-semibold">1</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-semibold">2</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-semibold">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
