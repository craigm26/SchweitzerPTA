'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNews, updateNews, deleteNews, NewsArticle } from '@/lib/api';

export default function NewsManagementPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      // Fetch all statuses for admin view
      const data = await getNews();
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      await updateNews(id, { status: newStatus });
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus as NewsArticle['status'] } : a))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    setActionLoading(id);
    try {
      await deleteNews(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map((a) => a.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Calculate stats
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const scheduledCount = articles.filter((a) => a.status === 'scheduled').length;
  const archivedCount = articles.filter((a) => a.status === 'archived').length;

  const stats = [
    { icon: 'check_circle', label: 'Published', value: publishedCount.toString(), color: 'text-green-500' },
    { icon: 'edit_note', label: 'Drafts', value: draftCount.toString(), color: 'text-amber-500' },
    { icon: 'schedule', label: 'Scheduled', value: scheduledCount.toString(), color: 'text-blue-500' },
    { icon: 'inventory_2', label: 'Archived', value: archivedCount.toString(), color: 'text-gray-500' },
  ];

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-600';
      case 'draft':
        return 'bg-amber-100 text-amber-600';
      case 'scheduled':
        return 'bg-blue-100 text-blue-600';
      case 'archived':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Editor View
              </span>
            </div>
            <h1 className="text-[#181411] dark:text-white text-3xl md:text-4xl font-black tracking-tight">
              News Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal max-w-2xl">
              Create, edit, and manage school announcements and sponsor shoutouts for the Wildcat community.
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Create New Article</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#2a221a] rounded-xl p-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</span>
              </div>
              <p className="text-[#181411] dark:text-white text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Filter by:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Status: All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#2a221a] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">article</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">Create your first article to get started.</p>
              <Link
                href="/admin/news/new"
                className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Create Article
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => {
                      const { date, time } = formatDate(article.updated_at);
                      const isLoading = actionLoading === article.id;

                      return (
                        <tr
                          key={article.id}
                          className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors ${
                            isLoading ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedArticles.includes(article.id)}
                              onChange={() => toggleSelect(article.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-[#181411] dark:text-white text-sm line-clamp-1">
                                {article.title}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-1">
                                {article.excerpt || article.content?.substring(0, 60)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800">
                                {article.author_name?.substring(0, 2).toUpperCase() || '??'}
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {article.author_name || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-[#181411] dark:text-white">{date}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={article.status}
                              onChange={(e) => handleStatusChange(article.id, e.target.value)}
                              disabled={isLoading}
                              className={`text-xs font-bold px-2 py-1 rounded border-0 ${getStatusColor(article.status)}`}
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/news/${article.id}`}
                                className="p-1 text-gray-400 hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(article.id)}
                                disabled={isLoading}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredArticles.length} of {articles.length} articles
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
