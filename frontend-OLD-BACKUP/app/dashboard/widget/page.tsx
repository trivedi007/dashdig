'use client';

import { useState } from 'react';

export default function WidgetPage() {
  const [activeTab, setActiveTab] = useState('vanilla');
  const emojiFont = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";

  const showCode = (framework: string) => {
    setActiveTab(framework);
  };

  const copyApiKey = () => {
    const apiKey = 'ddg_live_474cf5506b37325360555574788ebc01847535353a';
    navigator.clipboard.writeText(apiKey);
    alert('API key copied to clipboard!');
  };

  const copyCode = (framework: string) => {
    const codeElement = document.querySelector(`#code-${framework} code`);
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent || '');
      alert('Code copied to clipboard!');
    }
  };

  return (
    <div id="section-widget" className="section-content p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Embed Dashdig Widget</h2>
          <p className="text-gray-600 mb-4 font-medium">Add Dashdig URL shortening functionality to your product in minutes.</p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 mb-8">
            <span className="text-2xl" style={{ fontFamily: emojiFont }}>⚡</span>
            <span className="text-2xl font-bold tracking-tight" style={{ color: '#F9541C' }}>Dig</span>
            <span className="text-2xl font-bold tracking-tight" style={{ color: '#0B1727' }}>this!</span>
          </div>
          
          {/* API Key Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Your API Key</h3>
              <button className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold tracking-tight">
                <i className="fas fa-sync mr-2"></i>Regenerate
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm">
                ddg_live_••••••••••••353a
              </div>
              <button onClick={() => copyApiKey()} className="px-6 py-3 orange-gradient text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all tracking-tight">
                <i className="fas fa-copy mr-2"></i>Copy
              </button>
            </div>
          </div>

          {/* Integration Code */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Code</h3>
            
            {/* Framework Tabs */}
            <div className="flex space-x-2 mb-4 border-b border-gray-200">
              <button 
                onClick={() => showCode('vanilla')} 
                id="tab-vanilla" 
                className={`tab-button px-6 py-3 font-semibold tracking-tight ${
                  activeTab === 'vanilla' 
                    ? 'text-orange-600 border-b-3 border-orange-600' 
                    : 'text-gray-600 hover:text-orange-600'
                } transition-colors`}
              >
                Vanilla JS
              </button>
              <button 
                onClick={() => showCode('react')} 
                id="tab-react" 
                className={`tab-button px-6 py-3 font-semibold tracking-tight ${
                  activeTab === 'react' 
                    ? 'text-orange-600 border-b-3 border-orange-600' 
                    : 'text-gray-600 hover:text-orange-600'
                } transition-colors`}
              >
                React
              </button>
              <button 
                onClick={() => showCode('vue')} 
                id="tab-vue" 
                className={`tab-button px-6 py-3 font-semibold tracking-tight ${
                  activeTab === 'vue' 
                    ? 'text-orange-600 border-b-3 border-orange-600' 
                    : 'text-gray-600 hover:text-orange-600'
                } transition-colors`}
              >
                Vue
              </button>
              <button 
                onClick={() => showCode('angular')} 
                id="tab-angular" 
                className={`tab-button px-6 py-3 font-semibold tracking-tight ${
                  activeTab === 'angular' 
                    ? 'text-orange-600 border-b-3 border-orange-600' 
                    : 'text-gray-600 hover:text-orange-600'
                } transition-colors`}
              >
                Angular
              </button>
            </div>

            {/* Code Blocks */}
            <div className="relative">
              <div id="code-vanilla" className={`code-block bg-gray-900 rounded-xl p-6 overflow-x-auto ${activeTab !== 'vanilla' ? 'hidden' : ''}`}>
                <button onClick={() => copyCode('vanilla')} className="absolute top-4 right-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors font-semibold tracking-tight">
                  <i className="fas fa-copy mr-2"></i>Copy
                </button>
                <pre className="text-gray-300 text-sm"><code>{`<!-- Add the Dashdig widget script -->
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js"></script>

<script>
  Dashdig.init({
    apiKey: 'ddg_live_••••••••••••353a',
    container: '#dashdig-container',
    theme: 'light',
    position: 'bottom-right'
  });

  async function createShortUrl() {
    const result = await Dashdig.createUrl({
      url: 'https://example.com/long-url',
      customSlug: 'my-link'
    });
    console.log('Short URL:', result.shortUrl);
  }
</script>

<div id="dashdig-container"></div>`}</code></pre>
              </div>

              <div id="code-react" className={`code-block bg-gray-900 rounded-xl p-6 overflow-x-auto ${activeTab !== 'react' ? 'hidden' : ''}`}>
                <button onClick={() => copyCode('react')} className="absolute top-4 right-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors font-semibold tracking-tight">
                  <i className="fas fa-copy mr-2"></i>Copy
                </button>
                <pre className="text-gray-300 text-sm"><code>{`import { DashdigWidget } from '@dashdig/react';

function App() {
  return (
    <DashdigWidget
      apiKey="ddg_live_••••••••••••353a"
      position="bottom-right"
      theme="light"
      onLoad={() => console.log('Dashdig loaded')}
    />
  );
}`}</code></pre>
              </div>

              <div id="code-vue" className={`code-block bg-gray-900 rounded-xl p-6 overflow-x-auto ${activeTab !== 'vue' ? 'hidden' : ''}`}>
                <button onClick={() => copyCode('vue')} className="absolute top-4 right-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors font-semibold tracking-tight">
                  <i className="fas fa-copy mr-2"></i>Copy
                </button>
                <pre className="text-gray-300 text-sm"><code>{`<template>
  <DashdigWidget
    :apiKey="apiKey"
    position="bottom-right"
    theme="light"
    @load="onLoad"
  />
</template>

<script>
import { DashdigWidget } from '@dashdig/vue';

export default {
  components: { DashdigWidget },
  data() {
    return {
      apiKey: 'ddg_live_••••••••••••353a'
    }
  }
}
</script>`}</code></pre>
              </div>

              <div id="code-angular" className={`code-block bg-gray-900 rounded-xl p-6 overflow-x-auto ${activeTab !== 'angular' ? 'hidden' : ''}`}>
                <button onClick={() => copyCode('angular')} className="absolute top-4 right-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors font-semibold tracking-tight">
                  <i className="fas fa-copy mr-2"></i>Copy
                </button>
                <pre className="text-gray-300 text-sm"><code>{`// app.module.ts
import { DashdigModule } from '@dashdig/angular';

@NgModule({
  imports: [
    DashdigModule.forRoot({
      apiKey: 'ddg_live_••••••••••••353a'
    })
  ]
})

// component.html
<dashdig-widget
  position="bottom-right"
  theme="light"
></dashdig-widget>`}</code></pre>
              </div>
            </div>
          </div>

          {/* Integration Checklist */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span className="text-gray-700">Include the widget script and initialize Dashdig with your API key</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span className="text-gray-700">Choose light or dark theme, placement, and optional callbacks</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span className="text-gray-700">Check the widget guide for integration help</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
