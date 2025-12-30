'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getNews, getEvents, getSponsors, NewsArticle, Event, Sponsor } from '@/lib/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsData, eventsData, sponsorsData] = await Promise.all([
          getNews(),
          getEvents({ upcoming: true }),
          getSponsors({ includeInactive: true }),
        ]);
        setNews(newsData || []);
        setEvents(eventsData || []);
        setSponsors(sponsorsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate stats from real data
  const publishedNews = news.filter((n) => n.status === 'published').length;
  const draftNews = news.filter((n) => n.status === 'draft').length;
  const activeSponsors = sponsors.filter((s) => s.is_active).length;
  const upcomingEvents = events.length;

  const stats = [
    {
      icon: 'article',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      label: 'News Posts',
      value: `${news.length} Total`,
      badge: draftNews > 0 ? `${draftNews} Drafts` : null,
      badgeColor: 'bg-amber-100 text-amber-600',
      link: { href: '/admin/news', label: 'Manage News' },
    },
    {
      icon: 'handshake',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      label: 'Sponsors',
      value: `${activeSponsors} Active`,
      badge: 'Active',
      badgeColor: 'bg-green-100 text-green-600',
      link: { href: '/admin/sponsors', label: 'Manage Sponsors' },
    },
    {
      icon: 'event',
      iconBg: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      label: 'Events',
      value: `${upcomingEvents} Upcoming`,
      badge: 'Upcoming',
      badgeColor: 'bg-blue-100 text-blue-600',
      link: { href: '/events', label: 'View Calendar' },
    },
    {
      icon: 'group',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      label: 'Users',
      value: 'Manage',
      badge: null,
      link: { href: '/admin/users', label: 'User Settings' },
    },
  ];

  const recentDrafts = news
    .filter((n) => n.status === 'draft')
    .slice(0, 3)
    .map((n) => ({
      id: n.id,
      title: n.title,
      author: n.author_name || 'Unknown',
      modified: getRelativeTime(n.updated_at),
      status: 'Draft',
    }));

  const upcomingEventsList = events.slice(0, 3).map((e) => {
    const date = new Date(e.date);
    return {
      id: e.id,
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString().padStart(2, '0'),
      title: e.title,
      time: e.time,
      location: e.location,
    };
  });

  const featuredSponsor = sponsors.filter((s) => s.is_active && s.level === 'gold')[0] ||
    sponsors.filter((s) => s.is_active)[0];

  function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const userName = user?.email?.split('@')[0] || 'Admin';

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Here&apos;s what&apos;s happening at Schweitzer Elementary today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
                </div>
                {stat.badge && (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${stat.badgeColor}`}>{stat.badge}</span>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-[#181411] dark:text-white text-2xl font-bold mb-3">{stat.value}</p>
              <Link
                href={stat.link.href}
                className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
              >
                {stat.link.label} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Recent News Drafts */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-[#181411] dark:text-white text-lg font-bold">Recent News Drafts</h2>
                <Link
                  href="/admin/news/new"
                  className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  New Post
                </Link>
              </div>
              {recentDrafts.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">article</span>
                  <p className="text-gray-500">No drafts yet. Create your first article!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Author</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Last Modified</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDrafts.map((draft) => (
                        <tr key={draft.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                          <td className="px-5 py-4 text-sm font-medium text-[#181411] dark:text-white">{draft.title}</td>
                          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{draft.author}</td>
                          <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{draft.modified}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-600">
                              {draft.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <Link href={`/admin/news/${draft.id}`} className="text-gray-400 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined">edit</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="p-4 text-center border-t border-gray-100 dark:border-gray-800">
                <Link href="/admin/news" className="text-gray-500 hover:text-primary text-sm font-medium">
                  View All News
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  href="/admin/news/new"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-[#181411] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-2xl">post_add</span>
                  <span className="text-sm font-medium text-[#181411] dark:text-white">New Article</span>
                </Link>
                <Link
                  href="/admin/sponsors"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-[#181411] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-amber-500 text-2xl">handshake</span>
                  <span className="text-sm font-medium text-[#181411] dark:text-white">Add Sponsor</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-[#181411] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-purple-500 text-2xl">person_add</span>
                  <span className="text-sm font-medium text-[#181411] dark:text-white">Manage Users</span>
                </Link>
                <Link
                  href="/"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-[#181411] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-teal-500 text-2xl">visibility</span>
                  <span className="text-sm font-medium text-[#181411] dark:text-white">View Site</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Sponsor Spotlight */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#181411] dark:text-white text-lg font-bold">Sponsor Spotlight</h2>
                <Link href="/admin/sponsors" className="text-gray-400 hover:text-gray-600">
                  <span className="material-symbols-outlined">more_horiz</span>
                </Link>
              </div>
              {featuredSponsor ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                    {featuredSponsor.logo ? (
                      <img src={featuredSponsor.logo} alt={featuredSponsor.name} className="max-h-16 max-w-16 object-contain" />
                    ) : (
                      <span className="text-white text-xs font-bold uppercase">{featuredSponsor.level}</span>
                    )}
                  </div>
                  <h3 className="text-[#181411] dark:text-white font-bold text-lg">{featuredSponsor.name}</h3>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2">
                    {featuredSponsor.level} Tier
                  </span>
                  <Link
                    href="/admin/sponsors"
                    className="w-full py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="material-symbols-outlined text-3xl text-gray-300 mb-2">handshake</span>
                  <p className="text-gray-500 text-sm">No sponsors yet</p>
                  <Link href="/admin/sponsors" className="text-primary text-sm font-bold hover:underline">
                    Add a sponsor
                  </Link>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#181411] dark:text-white text-lg font-bold">Upcoming Events</h2>
                <Link href="/events" className="text-primary text-sm font-bold hover:underline">
                  View All
                </Link>
              </div>
              {upcomingEventsList.length === 0 ? (
                <div className="text-center py-4">
                  <span className="material-symbols-outlined text-3xl text-gray-300 mb-2">event</span>
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {upcomingEventsList.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="text-center shrink-0">
                        <div className="text-primary text-xs font-bold">{event.month}</div>
                        <div className="text-[#181411] dark:text-white text-xl font-bold">{event.day}</div>
                      </div>
                      <div>
                        <p className="font-bold text-[#181411] dark:text-white text-sm">{event.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {event.time} • {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
