import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Documentation | Dashdig',
  description: 'Documentation and guides for Dashdig URL Shortener - Getting started, WordPress plugin, API reference',
  openGraph: {
    title: 'Documentation | Dashdig',
    description: 'Everything you need to get started with Dashdig URL Shortener',
    type: 'website',
  },
};

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
            <Logo linkTo={null} variant="compact" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Documentation</h1>
        <p className="text-gray-600 text-lg mb-12">
          Everything you need to get started with Dashdig - Humanize and Shortenize URLs
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Getting Started */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Quick start guide to create your first human-readable short URL
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
              <li>Sign up for a free account at <Link href="/auth/signin" className="text-[#FF6B35] hover:underline">dashdig.com</Link></li>
              <li>Access your dashboard</li>
              <li>Click "Create New Link" button</li>
              <li>Enter your long URL</li>
              <li>Customize your human-readable short URL</li>
              <li>Click "Dig This!" to create your link</li>
            </ol>
            <Link 
              href="/auth/signin" 
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Get Started Free
            </Link>
          </section>

          {/* WordPress Plugin */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🔌</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">WordPress Plugin</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Install Dashdig on your WordPress site for seamless integration
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
              <li>Install from WordPress.org plugin directory</li>
              <li>Activate the "Dashdig Analytics" plugin</li>
              <li>Go to <strong>Settings → Dashdig</strong></li>
              <li>Enter your API key from dashboard</li>
              <li>Click "Test Connection" to verify</li>
              <li>Save settings and start shortening!</li>
            </ol>
            <a 
              href="https://wordpress.org/plugins/dashdig-analytics/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Download Plugin
            </a>
          </section>

          {/* API Documentation */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🔑</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Public API v1</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Integrate Dashdig into your applications with our RESTful API v1
            </p>
            <div className="bg-gray-50 p-4 rounded border border-gray-300 mb-4 overflow-x-auto">
              <p className="text-xs text-gray-600 mb-2">Base URL:</p>
              <code className="text-sm text-gray-900 font-mono">
                https://dashdig-production.up.railway.app/api/v1
              </code>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Authentication:</strong> API key in X-API-Key header
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/dashboard/settings/api"
                className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
              >
                Get API Key
              </Link>
              <a
                href="#api-v1-reference"
                className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                View API Docs
              </a>
            </div>
          </section>

          {/* Support */}
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Get Help</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Need assistance? We're here to help!
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">📧 Support:</span>
                <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:underline">
                  support@dashdig.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">🔒 Privacy:</span>
                <a href="mailto:privacy@dashdig.com" className="text-[#FF6B35] hover:underline">
                  privacy@dashdig.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">💼 Sales:</span>
                <a href="mailto:sales@dashdig.com" className="text-[#FF6B35] hover:underline">
                  sales@dashdig.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[80px]">🐛 Issues:</span>
                <a href="https://github.com/trivedi007/dashdig/issues" className="text-[#FF6B35] hover:underline" target="_blank" rel="noopener noreferrer">
                  GitHub Issues
                </a>
              </li>
            </ul>
            <a 
              href="mailto:support@dashdig.com"
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Contact Support
            </a>
          </section>
        </div>

        {/* Public API v1 Reference */}
        <section id="api-v1-reference" className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">🚀 Public API v1 Reference</h2>

          {/* Getting Started */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h3>
            <p className="text-gray-700 mb-4">
              The Dashdig Public API allows you to programmatically create, manage, and track short URLs. All API requests require authentication via API key.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm font-semibold text-gray-900">Base URL</p>
              <code className="text-sm text-gray-700 font-mono">https://dashdig-production.up.railway.app/api/v1</code>
            </div>
          </div>

          {/* Authentication */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Authentication</h3>
            <p className="text-gray-700 mb-4">
              Include your API key in the <code className="bg-gray-100 px-2 py-1 rounded">X-API-Key</code> header with every request.
            </p>
            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              <pre className="text-sm font-mono text-gray-900">X-API-Key: dk_live_your_api_key_here</pre>
            </div>
            <p className="text-gray-700 mt-4">
              Get your API key from{' '}
              <Link href="/dashboard/settings/api" className="text-[#FF6B35] hover:underline">
                Dashboard → Settings → API
              </Link>
            </p>
          </div>

          {/* Rate Limiting */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Rate Limiting</h3>
            <p className="text-gray-700 mb-4">
              Rate limits are enforced based on your subscription plan:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Free:</strong> 100 requests/hour</li>
              <li><strong>Pro:</strong> 1,000 requests/hour</li>
              <li><strong>Enterprise:</strong> 5,000 requests/hour</li>
            </ul>
            <p className="text-gray-700 mb-4">Rate limit headers are included in all responses:</p>
            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              <pre className="text-sm font-mono text-gray-900">
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-11-22T20:00:00Z`}
              </pre>
            </div>
          </div>

          {/* Error Codes */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Error Codes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">INVALID_URL</td>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">The provided URL is not valid</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">MISSING_API_KEY</td>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">API key is required in X-API-Key header</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">INVALID_API_KEY</td>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">The provided API key is invalid</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">RATE_LIMIT_EXCEEDED</td>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">You have exceeded your hourly rate limit</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">URL_NOT_FOUND</td>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">The requested short link was not found</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">UNAUTHORIZED</td>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">Missing required permissions</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm font-mono text-gray-700">QUOTA_EXCEEDED</td>
                    <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">Monthly URL creation limit exceeded</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Endpoints */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Endpoints</h3>

            {/* POST /links */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-3 text-gray-900">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono mr-2">POST</span>
                /api/v1/links
              </h4>
              <p className="text-gray-700 mb-4">Create a new short URL</p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">cURL</p>
                  <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                    <pre className="text-sm text-green-400">
{`curl -X POST https://dashdig-production.up.railway.app/api/v1/links \\
  -H "X-API-Key: dk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/long/url",
    "customSlug": "my-link",
    "tags": ["product", "sale"]
  }'`}
                    </pre>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">JavaScript (fetch)</p>
                  <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                    <pre className="text-sm text-blue-400">
{`const response = await fetch('https://dashdig-production.up.railway.app/api/v1/links', {
  method: 'POST',
  headers: {
    'X-API-Key': 'dk_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    originalUrl: 'https://example.com/long/url',
    customSlug: 'my-link',
    tags: ['product', 'sale']
  })
});
const data = await response.json();`}
                    </pre>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Python (requests)</p>
                  <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                    <pre className="text-sm text-yellow-400">
{`import requests

response = requests.post(
    'https://dashdig-production.up.railway.app/api/v1/links',
    headers={'X-API-Key': 'dk_live_your_api_key'},
    json={
        'originalUrl': 'https://example.com/long/url',
        'customSlug': 'my-link',
        'tags': ['product', 'sale']
    }
)
data = response.json()`}
                    </pre>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">PHP</p>
                  <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                    <pre className="text-sm text-purple-400">
{`$ch = curl_init('https://dashdig-production.up.railway.app/api/v1/links');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: dk_live_your_api_key',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'originalUrl' => 'https://example.com/long/url',
    'customSlug' => 'my-link',
    'tags' => ['product', 'sale']
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$data = json_decode($response, true);`}
                    </pre>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Response (201 Created)</p>
                  <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "shortUrl": "https://dashdig.com/my-link",
    "shortCode": "my-link",
    "originalUrl": "https://example.com/long/url",
    "qrCode": "data:image/png;base64,...",
    "tags": ["product", "sale"],
    "expiresAt": null,
    "createdAt": "2025-11-22T10:30:00Z",
    "clicks": 0
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* GET /links */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-3 text-gray-900">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-2">GET</span>
                /api/v1/links
              </h4>
              <p className="text-gray-700 mb-4">List all your short URLs (paginated)</p>

              <div className="bg-gray-900 p-4 rounded overflow-x-auto mb-4">
                <pre className="text-sm text-green-400">
{`curl -X GET "https://dashdig-production.up.railway.app/api/v1/links?page=1&limit=20" \\
  -H "X-API-Key: dk_live_your_api_key"`}
                </pre>
              </div>

              <p className="text-sm font-semibold text-gray-900 mb-2">Query Parameters</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                <li><code className="bg-gray-100 px-2 py-1 rounded">page</code> - Page number (default: 1)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">limit</code> - Items per page (default: 20, max: 100)</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">sortBy</code> - Sort by field: createdAt, updatedAt, clicks</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">order</code> - Sort order: asc or desc</li>
              </ul>
            </div>

            {/* GET /links/:id */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-3 text-gray-900">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-2">GET</span>
                /api/v1/links/:id
              </h4>
              <p className="text-gray-700 mb-4">Get details for a specific short URL</p>

              <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                <pre className="text-sm text-green-400">
{`curl -X GET https://dashdig-production.up.railway.app/api/v1/links/507f1f77bcf86cd799439011 \\
  -H "X-API-Key: dk_live_your_api_key"`}
                </pre>
              </div>
            </div>

            {/* PATCH /links/:id */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-3 text-gray-900">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-mono mr-2">PATCH</span>
                /api/v1/links/:id
              </h4>
              <p className="text-gray-700 mb-4">Update a short URL</p>

              <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                <pre className="text-sm text-green-400">
{`curl -X PATCH https://dashdig-production.up.railway.app/api/v1/links/507f1f77bcf86cd799439011 \\
  -H "X-API-Key: dk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/new-destination",
    "tags": ["updated"]
  }'`}
                </pre>
              </div>
            </div>

            {/* DELETE /links/:id */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-3 text-gray-900">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono mr-2">DELETE</span>
                /api/v1/links/:id
              </h4>
              <p className="text-gray-700 mb-4">Delete a short URL (soft delete)</p>

              <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                <pre className="text-sm text-green-400">
{`curl -X DELETE https://dashdig-production.up.railway.app/api/v1/links/507f1f77bcf86cd799439011 \\
  -H "X-API-Key: dk_live_your_api_key"`}
                </pre>
              </div>
            </div>

            {/* GET /links/:id/stats */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-3 text-gray-900">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-2">GET</span>
                /api/v1/links/:id/stats
              </h4>
              <p className="text-gray-700 mb-4">Get analytics for a short URL</p>

              <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                <pre className="text-sm text-green-400">
{`curl -X GET "https://dashdig-production.up.railway.app/api/v1/links/507f1f77bcf86cd799439011/stats?startDate=2025-01-01T00:00:00Z&endDate=2025-12-31T23:59:59Z" \\
  -H "X-API-Key: dk_live_your_api_key"`}
                </pre>
              </div>
            </div>

            {/* GET /domains */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-3 text-gray-900">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-2">GET</span>
                /api/v1/domains
              </h4>
              <p className="text-gray-700 mb-4">List custom domains</p>

              <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                <pre className="text-sm text-green-400">
{`curl -X GET https://dashdig-production.up.railway.app/api/v1/domains \\
  -H "X-API-Key: dk_live_your_api_key"`}
                </pre>
              </div>
            </div>
          </div>

          {/* OpenAPI Spec */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">OpenAPI Specification</h3>
            <p className="text-gray-700 mb-4">
              Download the complete OpenAPI 3.0 specification for use with API testing tools like Postman or Insomnia:
            </p>
            <a
              href="https://dashdig-production.up.railway.app/openapi.yaml"
              className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
            >
              Download OpenAPI Spec
            </a>
          </div>
        </section>

        {/* API Reference Section */}
        <section className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">🔧 Legacy API Reference</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Create Short URL</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Request:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`POST /api/shorten
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "url": "https://example.com/very-long-url",
  "keywords": ["optional", "keywords"],
  "customSlug": "optional-custom-slug"
}`}
                </pre>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-300 mt-4">
                <p className="text-sm text-gray-600 mb-2">Response:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "shortCode": "Example.Long.Custom.Slug",
    "shortUrl": "https://dashdig.com/Example.Long.Custom.Slug",
    "originalUrl": "https://example.com/very-long-url"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Get Analytics</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Request:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`GET /api/analytics/:shortCode
Authorization: Bearer YOUR_API_KEY`}
                </pre>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-300 mt-4">
                <p className="text-sm text-gray-600 mb-2">Response:</p>
                <pre className="text-sm font-mono text-gray-900 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "clicks": 1234,
    "uniqueClicks": 567,
    "browsers": { "Chrome": 45, "Firefox": 30 },
    "devices": { "Desktop": 60, "Mobile": 40 },
    "countries": { "US": 50, "UK": 20 }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">❓ Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">What makes Dashdig different?</h3>
              <p className="text-gray-700 leading-relaxed">
                Dashdig creates <strong>human-readable short URLs</strong> like "dashdig.com/Target.Tide.WashingMachine.Cleaner" 
                instead of cryptic strings like "bit.ly/3xK9mP2". Our tagline says it all: <strong>"Humanize and Shortenize URLs"</strong>. 
                These memorable links are easier to share verbally, improve click-through rates, and boost SEO.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Is there a free plan?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! Our free plan includes <strong>100 short URLs per month</strong> and basic analytics including 
                click tracking, browser stats, and device breakdown. Perfect for personal projects and small websites.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">How do I get an API key?</h3>
              <p className="text-gray-700 leading-relaxed">
                Sign up for an account, then go to <strong>Dashboard → Settings → API Keys</strong> to generate your key. 
                You can create multiple API keys for different applications and revoke them anytime.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Can I use custom domains?</h3>
              <p className="text-gray-700 leading-relaxed">
                Custom domains are available on Pro and Enterprise plans. Use your own branded domain like "go.yourcompany.com" 
                for shortened URLs. Contact{' '}
                <a href="mailto:sales@dashdig.com" className="text-[#FF6B35] hover:underline">sales@dashdig.com</a> for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">How does the WordPress plugin work?</h3>
              <p className="text-gray-700 leading-relaxed">
                The WordPress plugin connects to our secure API at{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">dashdig-production.up.railway.app</code> to 
                create short URLs directly from your WordPress dashboard. All communication is encrypted via HTTPS/TLS. 
                See our{' '}
                <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link> for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">What analytics do you provide?</h3>
              <p className="text-gray-700 leading-relaxed">
                Dashdig provides comprehensive analytics including: total clicks, unique visitors, geographic location (city/country), 
                browser types, device breakdown (desktop/mobile/tablet), referrer sources, and time-based click patterns. 
                Analytics data is retained for 24 months.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Is my data secure?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! We use industry-standard security measures including HTTPS/TLS encryption, bcrypt password hashing, 
                secure MongoDB Atlas storage, and Redis Cloud caching. We are GDPR and CCPA compliant. 
                Read our full{' '}
                <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Can I delete my short URLs?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes, you can delete any short URL from your dashboard at any time. Once deleted, the short URL will 
                immediately stop redirecting. This is useful for managing expired campaigns or removing outdated links.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-lg border border-orange-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">📚 Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/terms" className="text-[#FF6B35] hover:underline">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Resources</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="text-[#FF6B35] hover:underline">Dashboard</Link>
                </li>
                <li>
                  <a href="https://wordpress.org/plugins/dashdig-analytics/" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">
                    WordPress Plugin
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Support</h3>
              <ul className="space-y-1">
                <li>
                  <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:underline">Email Support</a>
                </li>
                <li>
                  <a href="https://github.com/trivedi007/dashdig/issues" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">
                    Report Issues
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6">
            <Link href="/" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              ← Back to Home
            </Link>
            <Link href="/terms" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link href="/dashboard" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Dashboard
            </Link>
            <a href="mailto:support@dashdig.com" className="text-[#FF6B35] hover:text-[#e55a28] font-medium transition-colors">
              Contact Support
            </a>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Dashdig. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}


