'use client';

import { useEffect, useMemo, useState } from 'react';
import { getNewsletterSubscriptions, NewsletterSubscription } from '@/lib/api';

export default function SubscriberManagementPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    void fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    setFeedback('');
    try {
      const data = await getNewsletterSubscriptions();
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      setFeedback('Could not load subscribers. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }

  const filteredSubscribers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return subscribers;
    return subscribers.filter(
      (subscriber) =>
        subscriber.email.toLowerCase().includes(normalized) ||
        (subscriber.source || '').toLowerCase().includes(normalized)
    );
  }, [query, subscribers]);

  const emailList = useMemo(() => filteredSubscribers.map((s) => s.email), [filteredSubscribers]);

  const csvContent = useMemo(() => {
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = filteredSubscribers.map((s) =>
      [escapeCell(s.email), escapeCell(s.source || ''), escapeCell(s.created_at)].join(',')
    );
    return ['email,source,created_at', ...rows].join('\n');
  }, [filteredSubscribers]);

  async function handleCopyEmails() {
    try {
      await navigator.clipboard.writeText(emailList.join(', '));
      setFeedback(`Copied ${emailList.length} email${emailList.length === 1 ? '' : 's'} to clipboard.`);
    } catch (error) {
      console.error('Failed to copy email list:', error);
      setFeedback('Unable to copy to clipboard. Please check browser clipboard permissions.');
    }
  }

  async function handleCopyCsv() {
    try {
      await navigator.clipboard.writeText(csvContent);
      setFeedback('Copied CSV to clipboard.');
    } catch (error) {
      console.error('Failed to copy CSV:', error);
      setFeedback('Unable to copy CSV. Please check browser clipboard permissions.');
    }
  }

  function handleDownloadCsv() {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'newsletter-subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setFeedback('CSV downloaded.');
  }

  const newestSubscriptionDate = subscribers[0]?.created_at;

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#181411] dark:text-white text-3xl md:text-4xl font-black tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-3xl">
            View and export your subscriber list for sending announcements in your preferred email tool.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Subscribers</p>
            <p className="text-3xl font-bold text-[#181411] dark:text-white">{subscribers.length}</p>
          </div>
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Filtered Results</p>
            <p className="text-3xl font-bold text-[#181411] dark:text-white">{filteredSubscribers.length}</p>
          </div>
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Newest Signup</p>
            <p className="text-sm font-semibold text-[#181411] dark:text-white mt-2">
              {newestSubscriptionDate
                ? new Date(newestSubscriptionDate).toLocaleString()
                : 'No subscribers yet'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by email or source..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyEmails}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors"
              >
                Copy Emails
              </button>
              <button
                type="button"
                onClick={handleCopyCsv}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors"
              >
                Copy CSV
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => void fetchSubscribers()}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
          {feedback && <p className="text-sm text-gray-600 dark:text-gray-300">{feedback}</p>}
        </div>

        <div className="bg-white dark:bg-[#2a221a] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {filteredSubscribers.length === 0 ? (
            <div className="p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">mail</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No subscribers found</h3>
              <p className="text-gray-500">Try changing your filter or check back after new signups.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subscribed At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#181411] dark:text-white">{subscriber.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {subscriber.source || 'unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(subscriber.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
