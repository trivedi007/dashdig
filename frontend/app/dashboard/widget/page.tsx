'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import toast from 'react-hot-toast'

type FrameworkOption = 'vanilla' | 'react' | 'vue' | 'angular'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

const resolveApiBase = () => {
  const rawBase = (() => {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
    }

    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    }

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001'
    }

    return 'https://dashdig-production.up.railway.app'
  })()

  const normalized = rawBase.replace(/\/$/, '')
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`
}

const buildApiUrl = (path: string) => {
  const base = resolveApiBase()
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export default function WidgetPage() {
  const [framework, setFramework] = useState<FrameworkOption>('vanilla')
  const [copied, setCopied] = useState(false)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const [apiKey, setApiKey] = useState('Loading…')
  const [loading, setLoading] = useState(true)
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'install', label: 'Include the widget script and initialize Dashdig with your API key', completed: false },
    { id: 'configure', label: 'Choose light or dark theme, placement, and optional callbacks', completed: false },
    { id: 'integrate', label: 'Use the SDK helpers to generate links on demand inside your product', completed: false },
    { id: 'secure', label: 'Keep the API key secure — never expose it in public repositories', completed: false }
  ])

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
          setApiKey('Sign in to fetch your API key')
          setLoading(false)
          return
        }

        const response = await fetch(buildApiUrl('api-keys'), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch API key')
        }

        const data = await response.json()
        if (data.success && data.data?.apiKey) {
          setApiKey(data.data.apiKey)
        } else {
          setApiKey('No API key found yet')
        }
      } catch (err) {
        console.error('Error fetching API key:', err)
        setApiKey('Error loading API key')
      } finally {
        setLoading(false)
      }
    }

    fetchApiKey()
  }, [])

  // Load checklist from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('dashdig-checklist')
    if (saved) {
      try {
        setChecklist(JSON.parse(saved))
      } catch (err) {
        console.error('Failed to load checklist:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  useEffect(() => {
    if (!apiKeyCopied) return
    const timer = setTimeout(() => setApiKeyCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [apiKeyCopied])

  const codeSnippets = useMemo(() => ({
    vanilla: `<!-- Add the Dashdig widget script -->
<script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js"></script>

<script>
  Dashdig.init({
    apiKey: '${apiKey}',
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

<div id="dashdig-container"></div>`,
    react: `// npm install @dashdig/react

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
        customSlug: 'my-link'
      });
      console.log(result.shortUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleCreateUrl} disabled={loading}>
      {loading ? 'Creating…' : 'Create Short URL'}
    </button>
  );
}`,
    vue: `<!-- npm install @dashdig/vue -->

<template>
  <button @click="createShortUrl" :disabled="loading">
    {{ loading ? 'Creating…' : 'Create Short URL' }}
  </button>
  <p v-if="error">Error: {{ error.message }}</p>
  <p v-if="shortUrl">Short URL: {{ shortUrl }}</p>
</template>

<script setup>
import { ref } from 'vue';
import { useDashdig } from '@dashdig/vue';

const { createUrl, loading, error } = useDashdig({
  apiKey: '${apiKey}'
});

const shortUrl = ref('');

const createShortUrl = async () => {
  const result = await createUrl({
    url: 'https://example.com/long-url',
    customSlug: 'my-link'
  });
  shortUrl.value = result.shortUrl;
};
</script>`,
    angular: `// npm install @dashdig/angular

import { Component } from '@angular/core';
import { DashdigService } from '@dashdig/angular';

@Component({
  selector: 'app-root',
  template: \\
    \`<button (click)="createShortUrl()" [disabled]="loading">\n+        {{ loading ? 'Creating…' : 'Create Short URL' }}\n+      </button>\n+      <p *ngIf="error">Error: {{ error }}</p>\n+      <p *ngIf="shortUrl">Short URL: {{ shortUrl }}</p>\`\n+})
export class AppComponent {
  loading = false;
  error = '';
  shortUrl = '';

  constructor(private readonly dashdig: DashdigService) {}

  async createShortUrl() {
    this.loading = true;
    this.error = '';
    try {
      const result = await this.dashdig.createUrl({
        url: 'https://example.com/long-url',
        customSlug: 'my-link'
      });
      this.shortUrl = result.shortUrl;
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
}`
  }), [apiKey])

  const maskApiKey = (key: string) => {
    if (key.length < 13 || !key.includes('_')) {
      return key
    }
    const prefix = key.substring(0, 9) // "ddg_live_"
    const suffix = key.substring(key.length - 4)
    const masked = '••••••••••••'
    return `${prefix}${masked}${suffix}`
  }

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setApiKeyCopied(true)
      toast.success('API key copied to clipboard!', { duration: 2000 })
    } catch (err) {
      console.error('Failed to copy API key:', err)
      toast.error('Failed to copy API key')
    }
  }

  const handleRegenerateApiKey = async () => {
    setRegenerating(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        toast.error('Not authenticated')
        return
      }

      const response = await fetch(buildApiUrl('api-keys/regenerate'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate API key')
      }

      const data = await response.json()
      if (data.success && data.data?.apiKey) {
        setApiKey(data.data.apiKey)
        toast.success('API key regenerated successfully!', { duration: 3000 })
      } else {
        throw new Error('Invalid response')
      }
    } catch (err) {
      console.error('Error regenerating API key:', err)
      toast.error('Failed to regenerate API key')
    } finally {
      setRegenerating(false)
      setShowRegenerateConfirm(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippets[framework])
      setCopied(true)
      toast.success('Code copied to clipboard!', { duration: 2000 })
    } catch (err) {
      console.error('Failed to copy snippet:', err)
      toast.error('Failed to copy code')
    }
  }

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setChecklist(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashdig-checklist', JSON.stringify(updated))
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              🔌 Embed Dashdig Widget
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Add Dashdig URL shortening functionality to your product in minutes. Choose your framework to grab the integration snippet.
            </p>
          </div>

          {/* API Key Section */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  🔑 Your API Key
                </h2>
                <p className="text-xs text-slate-600">
                  Use this key to authenticate your widget integration
                </p>
              </div>
              <button
                onClick={() => setShowRegenerateConfirm(true)}
                disabled={loading || regenerating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Regenerate API key"
              >
                <svg className={`h-3.5 w-3.5 ${regenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-mono text-sm font-medium text-slate-900">
                  {loading ? 'Loading...' : maskApiKey(apiKey)}
                </p>
              </div>
              <button
                onClick={handleCopyApiKey}
                disabled={loading || apiKey.includes('Loading') || apiKey.includes('Error')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#E85A2A] disabled:cursor-not-allowed disabled:opacity-50"
                title="Copy API key"
              >
                {apiKeyCopied ? (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Code Integration Section */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Framework Tabs */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                💻 Integration Code
              </h2>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { id: 'vanilla', label: 'Vanilla JS', emoji: '📜' },
                    { id: 'react', label: 'React', emoji: '⚛️' },
                    { id: 'vue', label: 'Vue', emoji: '💚' },
                    { id: 'angular', label: 'Angular', emoji: '🅰️' }
                  ] as Array<{ id: FrameworkOption; label: string; emoji: string }>
                ).map(option => (
                  <button
                    key={option.id}
                    onClick={() => setFramework(option.id)}
                    className={`relative px-4 py-2.5 text-sm font-semibold transition-all ${
                      framework === option.id
                        ? 'text-[#FF6B35]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{option.emoji}</span>
                      {option.label}
                    </span>
                    {framework === option.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF6B35]"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="relative p-6">
              <SyntaxHighlighter
                language={framework === 'vanilla' ? 'html' : framework === 'angular' ? 'typescript' : framework}
                style={vscDarkPlus}
                customStyle={{
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  fontSize: '0.875rem',
                  background: '#1E293B',
                  margin: 0,
                  maxHeight: '500px'
                }}
                showLineNumbers
              >
                {codeSnippets[framework]}
              </SyntaxHighlighter>
              <button
                onClick={handleCopy}
                className="absolute right-10 top-10 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md transition hover:bg-slate-50 hover:shadow-lg"
              >
                {copied ? (
                  <>
                    <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Checklist & Tips Sidebar */}
          <div className="flex h-full flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                ✅ Integration Checklist
              </h2>
              <p className="text-xs text-slate-600 mb-4">
                Track your progress as you integrate
              </p>
              <div className="space-y-3">
                {checklist.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 cursor-pointer group p-3 rounded-lg transition-colors ${
                      item.completed ? 'bg-green-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="h-5 w-5 rounded border-slate-300 text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-0 cursor-pointer"
                      />
                      {item.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <span className={`text-sm leading-snug ${
                      item.completed ? 'text-green-700 line-through' : 'text-slate-700'
                    }`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">💡 Progress:</span>{' '}
                  {checklist.filter(i => i.completed).length}/{checklist.length} completed
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <span className="text-lg">📚</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900 mb-1">Need deeper control?</p>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Check the full SDK docs for webhooks, analytics hooks, and automation examples.
                  </p>
                </div>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition"
              >
                View documentation →
              </a>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <span className="text-lg">🔒</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-1">Security reminder</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Never commit your API key to public repositories. Use environment variables in production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regenerate Confirmation Modal */}
        <AnimatePresence>
          {showRegenerateConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowRegenerateConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                    <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Regenerate API Key?</h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  This will invalidate your current API key. Any applications using the old key will stop working. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRegenerateConfirm(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegenerateApiKey}
                    disabled={regenerating}
                    className="flex-1 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {regenerating ? 'Regenerating...' : 'Regenerate'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
