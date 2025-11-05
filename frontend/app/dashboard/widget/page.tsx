'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WidgetPage() {
  const [activeTab, setActiveTab] = useState<'vanilla' | 'react' | 'vue' | 'angular'>('vanilla');
  const [showFullKey, setShowFullKey] = useState(false);

  // Mock API key (in production, fetch from backend)
  const apiKey = 'ddg_live_abc123def456ghi789jkl353a';
  const maskedKey = 'ddg_live_••••••••••••353a';

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string = 'Code') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Code snippets for each framework
  const codeSnippets = {
    vanilla: `<!-- Add this to your HTML -->
<div id="dashdig-widget"></div>

<!-- Add this before closing </body> -->
<script src="https://cdn.dashdig.com/widget.js"></script>
<script>
  Dashdig.init({
    apiKey: '${apiKey}',
    container: '#dashdig-widget',
    theme: 'light'
  });
</script>`,
    react: `// Install the package
npm install @dashdig/widget

// Import in your component
import { DashdigWidget } from '@dashdig/widget';

function App() {
  return (
    <DashdigWidget
      apiKey="${apiKey}"
      theme="light"
    />
  );
}`,
    vue: `<!-- Install the package -->
npm install @dashdig/widget

<!-- Use in your component -->
<template>
  <DashdigWidget
    :apiKey="apiKey"
    theme="light"
  />
</template>

<script>
import { DashdigWidget } from '@dashdig/widget';

export default {
  components: { DashdigWidget },
  data() {
    return {
      apiKey: '${apiKey}'
    };
  }
};
</script>`,
    angular: `// Install the package
npm install @dashdig/widget

// Import in your module
import { DashdigModule } from '@dashdig/widget';

@NgModule({
  imports: [DashdigModule],
  // ...
})

// Use in your template
<dashdig-widget
  [apiKey]="apiKey"
  theme="light"
></dashdig-widget>

// In your component
apiKey = '${apiKey}';`
  };

  // Handle API key regeneration
  const handleRegenerate = () => {
    if (window.confirm('Are you sure you want to regenerate your API key? This will invalidate the current key.')) {
      toast.success('API key regenerated successfully!');
      // In production, call API to regenerate
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Embed Dashdig Widget</h1>
        <p className="text-gray-600">Add the Dashdig URL shortener to your website or application</p>
      </div>

      {/* API Key Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your API Key</h2>
        <p className="text-sm text-gray-600 mb-4">
          Keep this key secure. It's used to authenticate your widget integration.
        </p>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <code className="flex-1 font-mono text-sm text-gray-900">
              {showFullKey ? apiKey : maskedKey}
            </code>
            <button
              onClick={() => setShowFullKey(!showFullKey)}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
              title={showFullKey ? 'Hide key' : 'Show key'}
            >
              <i className={`fas ${showFullKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <button
            onClick={() => copyToClipboard(apiKey, 'API key')}
            className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md shadow-orange-200 hover:shadow-lg"
          >
            <i className="fas fa-copy mr-2"></i>
            Copy
          </button>
          <button
            onClick={handleRegenerate}
            className="px-5 py-3 border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200"
          >
            <i className="fas fa-sync mr-2"></i>
            Regenerate
          </button>
        </div>
      </div>

      {/* Integration Code Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Integration Code</h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose your framework and copy the integration code below.
        </p>

        {/* Framework Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('vanilla')}
              className={`pb-3 px-1 font-semibold transition-colors relative ${
                activeTab === 'vanilla'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vanilla JS
              {activeTab === 'vanilla' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('react')}
              className={`pb-3 px-1 font-semibold transition-colors relative ${
                activeTab === 'react'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              React
              {activeTab === 'react' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('vue')}
              className={`pb-3 px-1 font-semibold transition-colors relative ${
                activeTab === 'vue'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vue
              {activeTab === 'vue' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('angular')}
              className={`pb-3 px-1 font-semibold transition-colors relative ${
                activeTab === 'angular'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Angular
              {activeTab === 'angular' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Code Block */}
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => copyToClipboard(codeSnippets[activeTab], 'Code')}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
            >
              <i className="fas fa-copy mr-2"></i>
              Copy
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <code className="text-sm font-mono">{codeSnippets[activeTab]}</code>
          </pre>
        </div>
      </div>

      {/* Integration Checklist */}
      <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl border border-orange-100 p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-white"></i>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Integration Checklist</h3>
            <p className="text-sm text-gray-600">Follow these steps to complete your integration</p>
          </div>
        </div>

        <div className="space-y-3 ml-13">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked
              readOnly
              className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                Copy your API key
              </p>
              <p className="text-sm text-gray-600">
                Use the key above to authenticate your widget
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked
              readOnly
              className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                Add integration code
              </p>
              <p className="text-sm text-gray-600">
                Copy the code snippet for your framework
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              readOnly
              className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                Test your integration
              </p>
              <p className="text-sm text-gray-600">
                Verify the widget appears and functions correctly
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <i className="fas fa-question text-white"></i>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Check out our comprehensive documentation or contact our support team.
            </p>
            <div className="flex space-x-3">
              <a
                href="/docs"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-book mr-2"></i>
                View Documentation
              </a>
              <a
                href="/support"
                className="inline-flex items-center px-4 py-2 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <i className="fas fa-life-ring mr-2"></i>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
