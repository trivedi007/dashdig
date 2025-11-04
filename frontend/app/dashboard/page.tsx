'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import SmartLinkCreator from '../../src/components/SmartLinkCreator'
import { useUrls, useCreateUrl } from '../../lib/hooks/useUrls'

interface CreatePayload {
  originalUrl: string
  slug: string
  mode: 'smart' | 'random'
}

export default function DashboardHome() {
  const { data, isLoading, error } = useUrls()
  const createUrl = useCreateUrl()
  const [creating, setCreating] = useState(false)

  const urls = data?.urls ?? []
  const totalClicks = data?.totalClicks ?? 0

  const activeLinks = urls.filter(url => url.clicks > 0).length
  const avgClicks = urls.length ? Math.round(totalClicks / urls.length) : 0
  const recentUrls = [...urls]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const handleCreateLink = async ({ originalUrl, slug }: CreatePayload) => {
    if (creating) return
    if (!originalUrl || !slug) {
      toast.error('Please provide a URL and slug')
      return
    }

    setCreating(true)
    const dismiss = toast.loading('Creating short link...')
    try {
      await createUrl.mutateAsync({ url: originalUrl, customSlug: slug })
      toast.success('Short link created!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create link'
      toast.error(message)
    } finally {
      toast.dismiss(dismiss)
      setCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#FF6B35] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-lg font-semibold text-red-600">Unable to load dashboard data</p>
          <p className="mt-2 text-sm text-red-500">Please refresh the page or try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 rounded-lg bg-orange-100 px-3 py-1.5 text-sm font-semibold text-[#FF6B35]">
              🚀 Welcome back
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Build smarter short links
            </h1>
            <p className="mt-3 max-w-xl text-base text-slate-600 leading-relaxed">
              Generate human-friendly slugs, monitor performance, and integrate Dashdig across your stack — all in one modern workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/urls"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E85A2A]"
              >
                Manage URLs →
              </Link>
              <Link
                href="/dashboard/overview"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#FF6B35] hover:text-[#FF6B35]"
              >
                View analytics
              </Link>
            </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Links</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{urls.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Clicks</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Links</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{activeLinks}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Clicks</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{avgClicks}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {creating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/90">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF6B35] border-t-transparent" />
                Creating link…
              </div>
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-900 mb-4">Create Your Link</h2>
          <SmartLinkCreator onCreateLink={handleCreateLink} baseUrl="https://dashdig.com" />
        </div>
        <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Integration guide</h2>
            <p className="text-sm text-slate-600 mb-4">
              Drop our widget into your site or connect via API to automate branded links in minutes.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">🧩</span>
                <span>Use the widget snippets tailored for Vanilla JS, React, Vue, or Angular.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">🔐</span>
                <span>Keep your API key secure — find it in the widget tab for easy copy/paste.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">📊</span>
                <span>Monitor performance in the analytics section to optimise campaigns.</span>
              </li>
            </ul>
          </div>
          <Link
            href="/dashboard/widget"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E85A2A]"
          >
            Explore widget options →
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent links</h2>
            <p className="text-sm text-slate-600">Your latest short links and their engagement.</p>
          </div>
          <Link
            href="/dashboard/urls"
            className="text-sm font-semibold text-[#FF6B35] hover:text-[#E85A2A] transition"
          >
            View all →
          </Link>
        </div>

        {recentUrls.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            You haven&apos;t created any links yet. Start with the smart creator above!
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {recentUrls.map(url => (
              <div key={url._id} className="grid gap-4 px-6 py-4 sm:grid-cols-[minmax(0,1fr)_auto_140px] sm:items-center hover:bg-slate-50 transition">
                <div className="min-w-0">
                  <Link href={`/analytics/${url.shortCode}`} className="font-mono text-sm font-semibold text-[#FF6B35] hover:text-[#E85A2A]">
                    {url.shortCode}
                  </Link>
                  <p className="truncate text-sm text-slate-600 mt-0.5">{url.originalUrl}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Created {new Date(url.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="text-base">📊</span>
                  <span>{url.clicks.toLocaleString()} clicks</span>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={url.shortUrl || '#'}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#FF6B35] hover:bg-orange-50 hover:text-[#FF6B35]"
                  >
                    Visit link
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
