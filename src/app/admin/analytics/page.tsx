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
  const teamIdLooksLikeSlug = analytics.debug?.teamIdLooksLikeSlug === true;

  async function loadAnalytics() {
    setLoading(true);
    try {
      const data = await getDashboardAnalytics({ debug: true });
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
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#181411] dark:text-white text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Internal dashboard view for Vercel traffic metrics and debug details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadAnalytics}
            className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Refresh
          </button>
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
                {loading ? 'Loading...' : analytics.source === 'vercel' ? 'Vercel' : 'Unavailable'}
              </span>
            </p>
            {analytics.note && <p className="text-amber-600 dark:text-amber-400">Note: {analytics.note}</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Debug Details</h2>
          {teamIdLooksLikeSlug && (
            <p className="mb-3 text-sm text-amber-600 dark:text-amber-400">
              Team ID appears to be a slug/name. Use the actual Vercel Team ID (usually starts with{' '}
              <code className="px-1 rounded bg-amber-50 dark:bg-amber-900/30">team_</code>) or remove
              <code className="px-1 rounded bg-amber-50 dark:bg-amber-900/30"> VERCEL_TEAM_ID</code> if not needed.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Access token present:</span>{' '}
              {analytics.debug?.hasAccessToken ? 'Yes' : 'No'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Project ID:</span> {analytics.debug?.projectId || 'n/a'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Team ID:</span> {analytics.debug?.teamId || 'none'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Vercel API Status:</span>{' '}
              {analytics.debug?.vercelStatus ? analytics.debug.vercelStatus : 'n/a'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Range (days):</span> {analytics.debug?.rangeDays ?? 30}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Endpoint:</span> {analytics.debug?.endpointPath || '/v1/web/analytics'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
