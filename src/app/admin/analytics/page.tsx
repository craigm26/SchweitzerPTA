'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardAnalytics, getDashboardAnalytics } from '@/lib/api';

const VERCEL_ANALYTICS_URL = 'https://vercel.com/craig-merrys-projects/schweitzer-pta/analytics';

const emptyAnalytics: DashboardAnalytics = {
  visitors: null,
  pageViews: null,
  bounceRate: null,
  topPage: null,
  source: 'unavailable',
  timeframe: {
    key: '30d',
    label: 'Last 30 Days',
    periodDaysForSnapshot: 30,
  },
  breakdown: {
    devices: [],
    browsers: [],
    pages: [],
  },
};

function formatNumber(value: number | null) {
  if (value === null) return '--';
  return new Intl.NumberFormat('en-US').format(value);
}

function formatPercent(value: number | null) {
  if (value === null) return '--';
  const asPercent = value <= 1 ? value * 100 : value;
  return `${asPercent.toFixed(1)}%`;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [importVisitors, setImportVisitors] = useState('');
  const [importPageViews, setImportPageViews] = useState('');
  const [importBounceRate, setImportBounceRate] = useState('');
  const [importTopPage, setImportTopPage] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const data = await getDashboardAnalytics({ debug: true, timeframe });
      setAnalytics(data);
      setLastUpdated(new Date().toLocaleString());
    } catch {
      setAnalytics({
        ...emptyAnalytics,
        note: 'Failed to fetch analytics from /api/analytics.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  async function importSnapshot() {
    setImportStatus(null);
    const visitors = Number(importVisitors);
    const pageViews = Number(importPageViews);
    const bounceRate = importBounceRate.trim() === '' ? null : Number(importBounceRate);

    if (!Number.isFinite(visitors) || visitors < 0 || !Number.isInteger(visitors)) {
      setImportStatus('Visitors must be a non-negative whole number.');
      return;
    }
    if (!Number.isFinite(pageViews) || pageViews < 0 || !Number.isInteger(pageViews)) {
      setImportStatus('Page views must be a non-negative whole number.');
      return;
    }
    if (bounceRate !== null && (!Number.isFinite(bounceRate) || bounceRate < 0 || bounceRate > 100)) {
      setImportStatus('Bounce rate must be between 0 and 100.');
      return;
    }

    const timeframeToDays: Record<'24h' | '7d' | '30d' | '90d', number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };

    const res = await fetch('/api/analytics/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        periodDays: timeframeToDays[timeframe],
        visitors,
        pageViews,
        bounceRate,
        topPage: importTopPage.trim() || null,
        source: 'vercel_import',
      }),
    });

    if (!res.ok) {
      const errorBody = (await res.json().catch(() => ({}))) as { error?: string };
      setImportStatus(errorBody.error || 'Import failed.');
      return;
    }

    setImportStatus('Imported successfully.');
    await loadAnalytics();
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#181411] dark:text-white text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Internal first-party analytics from Supabase, with Vercel dashboard link for comparison.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadAnalytics}
            className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Refresh
          </button>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '24h' | '7d' | '30d' | '90d')}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Link
            href={VERCEL_ANALYTICS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-primary text-sm font-bold hover:underline"
          >
            Open Vercel Analytics
          </Link>
          {lastUpdated && <span className="text-xs text-gray-500">Last updated: {lastUpdated}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Visitors (30 Days)</p>
            <p className="text-[#181411] dark:text-white text-2xl font-bold">{formatNumber(analytics.visitors)}</p>
          </div>
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Page Views (30 Days)</p>
            <p className="text-[#181411] dark:text-white text-2xl font-bold">{formatNumber(analytics.pageViews)}</p>
          </div>
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Bounce Rate</p>
            <p className="text-[#181411] dark:text-white text-2xl font-bold">{formatPercent(analytics.bounceRate)}</p>
          </div>
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Top Page</p>
            <p className="text-[#181411] dark:text-white text-lg font-bold break-all">{analytics.topPage || '--'}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Status</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>
              Source:{' '}
              <span className="font-semibold">
                {loading ? 'Loading...' : analytics.source === 'first_party' ? 'First-Party (Supabase)' : 'Unavailable'}
              </span>
            </p>
            {analytics.note && <p className="text-amber-600 dark:text-amber-400">Note: {analytics.note}</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-3">
            Import Vercel Snapshot ({analytics.timeframe?.label || 'Selected Timeframe'})
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Copy summary values from Vercel Analytics and import them as a baseline for the selected timeframe.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="number"
              min={0}
              step={1}
              placeholder="Visitors"
              value={importVisitors}
              onChange={(e) => setImportVisitors(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm"
            />
            <input
              type="number"
              min={0}
              step={1}
              placeholder="Page Views"
              value={importPageViews}
              onChange={(e) => setImportPageViews(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm"
            />
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              placeholder="Bounce Rate (%)"
              value={importBounceRate}
              onChange={(e) => setImportBounceRate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm"
            />
            <input
              type="text"
              placeholder="Top Page (optional)"
              value={importTopPage}
              onChange={(e) => setImportTopPage(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={importSnapshot}
              className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Import Snapshot
            </button>
            {importStatus && <span className="text-sm text-gray-600 dark:text-gray-300">{importStatus}</span>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Top Pages</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2 pr-4 text-gray-500 dark:text-gray-400">Path</th>
                  <th className="text-left py-2 pr-4 text-gray-500 dark:text-gray-400">Title</th>
                  <th className="text-right py-2 text-gray-500 dark:text-gray-400">Visits</th>
                </tr>
              </thead>
              <tbody>
                {analytics.breakdown?.pages?.length ? (
                  analytics.breakdown.pages.map((page) => (
                    <tr key={page.path} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <td className="py-2 pr-4 font-medium text-[#181411] dark:text-white">{page.path}</td>
                      <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{page.title || '--'}</td>
                      <td className="py-2 text-right text-gray-700 dark:text-gray-200">{page.visits}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-3 text-gray-500 dark:text-gray-400">
                      No page data yet for this timeframe.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Device Types</h2>
            <div className="space-y-2 text-sm">
              {analytics.breakdown?.devices?.length ? (
                analytics.breakdown.devices.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{item.name}</span>
                    <span className="font-semibold text-[#181411] dark:text-white">{item.visits}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No device data yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Browsers</h2>
            <div className="space-y-2 text-sm">
              {analytics.breakdown?.browsers?.length ? (
                analytics.breakdown.browsers.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                    <span className="font-semibold text-[#181411] dark:text-white">{item.visits}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No browser data yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Debug Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Events in range:</span> {analytics.debug?.eventsInWindow ?? 0}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Sessions in range:</span> {analytics.debug?.sessionsInWindow ?? 0}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Bounce sessions:</span> {analytics.debug?.bounceSessions ?? 0}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Data source:</span> {analytics.debug?.dataSource || 'n/a'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Range (days):</span> {analytics.debug?.rangeDays ?? 30}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Endpoint:</span> /api/analytics
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Imported visitors:</span>{' '}
              {analytics.debug?.importedSnapshotVisitors ?? 'n/a'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Imported page views:</span>{' '}
              {analytics.debug?.importedSnapshotPageViews ?? 'n/a'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Imported bounce rate:</span>{' '}
              {analytics.debug?.importedSnapshotBounceRate ?? 'n/a'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
