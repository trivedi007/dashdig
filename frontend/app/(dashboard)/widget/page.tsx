'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import toast from 'react-hot-toast'

export default function WidgetPage() {
  const [framework, setFramework] = useState<'vanilla' | 'react' | 'vue' | 'angular'>('vanilla')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  // In production, fetch from API
  const apiKey = 'ddg_live_a1b2c3d4e5f6g7h8i9j01c4d'

  const maskApiKey = (key: string) => {
    const prefix = key.substring(0, 9)
    const suffix = key.substring(key.length - 4)
    const masked = '••••••••••••'
    return `${prefix}${masked}${suffix}`
  }

  const codeSnippets = {
    vanilla: `<!-- Add the Dashdig widget script -->
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js"></script>

<script>
  // Initialize Dashdig widget
  Dashdig.init({
    apiKey: '${apiKey}',
    container: '#dashdig-container',
    theme: 'light', // 'light' or 'dark'
    position: 'bottom-right' // Position on screen
  });

  // Create a short URL
  async function createShortUrl() {
    const result = await Dashdig.createUrl({
      url: 'https://example.com/long-url',
      customSlug: 'my-link' // Optional
    });
    console.log('Short URL:', result.shortUrl);
  }
</script>

<!-- Widget container -->
<div id="dashdig-container"></div>`,
    react: `// Install the React package
// npm install @dashdig/react

import { DashdigProvider, useDashdig } from '@dashdig/react';

function App() {
  return (
    <DashdigProvider apiKey="${apiKey}">
      <YourComponent />
    </DashdigProvider>
  );
}

function YourComponent() {
  const { createUrl, loading, error } = useDashdig();

  const handleCreateUrl = async () => {
    try {
      const result = await createUrl({
        url: 'https://example.com/long-url',
        customSlug: 'my-link' // Optional
      });
      console.log('Short URL:', result.shortUrl);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <button onClick={handleCreateUrl} disabled={loading}>
        {loading ? 'Creating...' : 'Create Short URL'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}`,
    vue: `<!-- Install the Vue package -->
<!-- npm install @dashdig/vue -->

<template>
  <div>
    <button @click="createShortUrl" :disabled="loading">
      {{ loading ? 'Creating...' : 'Create Short URL' }}
    </button>
    <p v-if="error">Error: {{ error.message }}</p>
    <p v-if="shortUrl">Short URL: {{ shortUrl }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDashdig } from '@dashdig/vue';

const { createUrl, loading, error } = useDashdig({
  apiKey: '${apiKey}'
});

const shortUrl = ref('');

const createShortUrl = async () => {
  try {
    const result = await createUrl({
      url: 'https://example.com/long-url',
      customSlug: 'my-link' // Optional
    });
    shortUrl.value = result.shortUrl;
  } catch (err) {
    console.error('Error:', err);
  }
};
</script>`,
    angular: `// Install the Angular package
// npm install @dashdig/angular

// app.module.ts
import { DashdigModule } from '@dashdig/angular';

@NgModule({
  imports: [
    DashdigModule.forRoot({
      apiKey: '${apiKey}'
    })
  ]
})
export class AppModule { }

// component.ts
import { Component } from '@angular/core';
import { DashdigService } from '@dashdig/angular';

@Component({
  selector: 'app-root',
  template: \`
    <button (click)="createShortUrl()" [disabled]="loading">
      {{ loading ? 'Creating...' : 'Create Short URL' }}
    </button>
    <p *ngIf="error">Error: {{ error }}</p>
    <p *ngIf="shortUrl">Short URL: {{ shortUrl }}</p>
  \`
})
export class AppComponent {
  loading = false;
  error = '';
  shortUrl = '';

  constructor(private dashdig: DashdigService) {}

  async createShortUrl() {
    this.loading = true;
    this.error = '';
    
    try {
      const result = await this.dashdig.createUrl({
        url: 'https://example.com/long-url',
        customSlug: 'my-link' // Optional
      });
      this.shortUrl = result.shortUrl;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
}`
  }

  const copyToClipboard = async (text: string, type: 'code' | 'key') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'code') {
        setCopiedCode(true)
        toast.success('Code copied to clipboard!')
        setTimeout(() => setCopiedCode(false), 2000)
      } else {
        setCopiedKey(true)
        toast.success('API key copied!')
        setTimeout(() => setCopiedKey(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy')
    }
  }

  const handleRegenerateKey = () => {
    // In production, call API to regenerate
    setShowRegenerateDialog(false)
    toast.success('API key regenerated successfully!')
    // Reload the page or update state with new key
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
            Embed Dashdig Widget
          </span>
        </h1>
        <p className="text-slate-600 text-lg">
          Add URL shortening functionality to your website or app
        </p>
      </div>

      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="fas fa-key text-[#FF6B35]"></i>
              Your API Key
            </h2>
            <p className="text-sm text-slate-500">
              Use this key to authenticate your widget requests
            </p>
          </div>
          <button
            onClick={() => setShowRegenerateDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <i className="fas fa-rotate"></i>
            Regenerate
          </button>
        </div>

        {/* API Key Display */}
        <div className="relative">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <code className="flex-1 font-mono text-sm text-slate-900 select-all">
              {showApiKey ? apiKey : maskApiKey(apiKey)}
            </code>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 text-slate-600 hover:text-[#FF6B35] hover:bg-slate-100 rounded-lg transition-colors"
                title={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                <i className={`fas ${showApiKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              <button
                onClick={() => copyToClipboard(apiKey, 'key')}
                className="relative p-2 text-slate-600 hover:text-[#FF6B35] hover:bg-slate-100 rounded-lg transition-colors"
                title="Copy API key"
              >
                <i className={`fas ${copiedKey ? 'fa-check' : 'fa-copy'}`}></i>
                {copiedKey && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  >
                    Copied!
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <i className="fas fa-triangle-exclamation text-amber-600 mt-0.5"></i>
          <div className="flex-1">
            <p className="text-sm text-amber-900 font-medium">Keep your API key secure</p>
            <p className="text-xs text-amber-700 mt-1">
              Don't share it publicly or commit it to version control. Use environment variables in production.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Framework Selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Installation Code</h2>
        </div>
        
        {/* Framework Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          {(['vanilla', 'react', 'vue', 'angular'] as const).map((fw) => (
            <button
              key={fw}
              onClick={() => setFramework(fw)}
              className={`relative px-6 py-4 text-sm font-semibold transition-all ${
                framework === fw
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {fw === 'vanilla' ? 'Vanilla JS' : fw.charAt(0).toUpperCase() + fw.slice(1)}
              {framework === fw && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B35]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Code Display */}
        <div className="relative">
          <button
            onClick={() => copyToClipboard(codeSnippets[framework], 'code')}
            className={`absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              copiedCode
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <i className={`fas ${copiedCode ? 'fa-check' : 'fa-copy'}`}></i>
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </button>

          <div className="relative">
            <SyntaxHighlighter
              language={framework === 'vanilla' ? 'html' : framework === 'angular' ? 'typescript' : framework}
              style={vscDarkPlus}
              showLineNumbers={true}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '13px',
                padding: '24px',
                paddingTop: '64px',
                background: '#1e1e1e'
              }}
              lineNumberStyle={{
                color: '#858585',
                fontSize: '13px',
                minWidth: '3em',
                paddingRight: '1em',
                textAlign: 'right',
                userSelect: 'none'
              }}
              codeTagProps={{
                style: {
                  fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace"
                }
              }}
            >
              {codeSnippets[framework]}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: 'fa-bolt',
            title: 'Easy Integration',
            description: 'Drop-in widget that works with any framework'
          },
          {
            icon: 'fa-palette',
            title: 'Customizable',
            description: 'Match your brand with themes and colors'
          },
          {
            icon: 'fa-chart-line',
            title: 'Built-in Analytics',
            description: 'Track clicks, devices, locations, and more'
          },
          {
            icon: 'fa-shield-halved',
            title: 'Secure & Reliable',
            description: '99.9% uptime with enterprise security'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-[#FF6B35] rounded-lg flex items-center justify-center mb-4">
              <i className={`fas ${feature.icon} text-white text-xl`}></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Documentation Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 text-center border border-slate-200"
      >
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-book text-white text-2xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Need Help?</h3>
          <p className="text-slate-600 mb-6">
            Check out our comprehensive documentation and API reference for detailed guides, examples, and troubleshooting.
          </p>
          <a
            href="https://docs.dashdig.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors font-semibold shadow-sm"
          >
            <i className="fas fa-book-open"></i>
            View Documentation
            <i className="fas fa-arrow-right text-sm"></i>
          </a>
        </div>
      </motion.div>

      {/* Regenerate Confirmation Dialog */}
      <AnimatePresence>
        {showRegenerateDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRegenerateDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-triangle-exclamation text-amber-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Regenerate API Key?</h3>
              </div>
              <p className="text-slate-600 mb-6 text-sm">
                This will invalidate your current API key. Any applications using the old key will stop working immediately. Are you sure you want to continue?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegenerateDialog(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegenerateKey}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Regenerate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

