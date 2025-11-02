'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api' 
    : 'https://dashdig-production.up.railway.app/api')

export default function WidgetPage() {
  const [framework, setFramework] = useState<'vanilla' | 'react' | 'vue' | 'angular'>('vanilla')
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState('Loading...')
  const [loading, setLoading] = useState(true)

  // Fetch API key on mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setApiKey('Please sign in to get your API key')
          setLoading(false)
          return
        }

        const response = await fetch(`${API_BASE}/api-keys`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch API key')
        }

        const data = await response.json()
        if (data.success && data.data.apiKey) {
          setApiKey(data.data.apiKey)
        } else {
          setApiKey('Error loading API key')
        }
      } catch (error) {
        console.error('Error fetching API key:', error)
        setApiKey('Error loading API key')
      } finally {
        setLoading(false)
      }
    }

    fetchApiKey()
  }, [])

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
            Embed Dashdig Widget
          </span>
        </h1>
        <p className="text-gray-600">
          Add URL shortening functionality to your website or app
        </p>
      </div>

      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-xl p-6 text-white"
      >
        <h2 className="text-xl font-bold mb-2">🔑 Your API Key</h2>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 font-mono text-sm flex items-center justify-between">
          <span>{apiKey}</span>
          <button
            onClick={() => copyToClipboard(apiKey)}
            className="px-3 py-1 bg-white/30 hover:bg-white/40 rounded transition-colors"
          >
            📋 Copy
          </button>
        </div>
        <p className="text-sm mt-3 opacity-90">
          Keep your API key secure. Don't share it publicly or commit it to version control.
        </p>
      </motion.div>

      {/* Framework Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['vanilla', 'react', 'vue', 'angular'] as const).map((fw) => (
          <button
            key={fw}
            onClick={() => setFramework(fw)}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              framework === fw
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {fw.charAt(0).toUpperCase() + fw.slice(1)}
            {fw === 'vanilla' && ' JS'}
          </button>
        ))}
      </div>

      {/* Code Snippet */}
      <motion.div
        key={framework}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Installation Code</h3>
          <button
            onClick={() => copyToClipboard(codeSnippets[framework])}
            className="px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#3bb5b0] text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
          >
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={framework === 'vanilla' ? 'html' : framework === 'angular' ? 'typescript' : framework}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '14px'
            }}
          >
            {codeSnippets[framework]}
          </SyntaxHighlighter>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Integration</h3>
          <p className="text-gray-600 text-sm">
            Drop-in widget that works with any framework. Copy and paste the code to get started in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Customizable</h3>
          <p className="text-gray-600 text-sm">
            Match your brand with customizable themes, colors, and positioning options.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Built-in Analytics</h3>
          <p className="text-gray-600 text-sm">
            Track clicks, devices, locations, and more right from your dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Reliable</h3>
          <p className="text-gray-600 text-sm">
            Enterprise-grade security with 99.9% uptime SLA and HTTPS everywhere.
          </p>
        </motion.div>
      </div>

      {/* Documentation Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600 mb-4">
          Check out our comprehensive documentation and API reference
        </p>
        <a
          href="https://docs.dashdig.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          📚 View Documentation
        </a>
      </motion.div>
    </div>
  )
}

