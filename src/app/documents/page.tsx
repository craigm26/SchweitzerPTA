'use client';

import { useEffect, useState } from 'react';

interface Document {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  category: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: 'newsletters', label: 'Newsletters', icon: 'newspaper' },
  { value: 'forms', label: 'Forms', icon: 'assignment' },
  { value: 'policies', label: 'Policies', icon: 'policy' },
  { value: 'meeting-minutes', label: 'Meeting Minutes', icon: 'groups' },
  { value: 'flyers', label: 'Flyers', icon: 'campaign' },
  { value: 'other', label: 'Other', icon: 'folder' },
];

const FILE_TYPE_ICONS: Record<string, string> = {
  'application/pdf': 'picture_as_pdf',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'application/msword': 'description',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'description',
  'application/vnd.ms-excel': 'table_chart',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'table_chart',
  'application/vnd.ms-powerpoint': 'slideshow',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'slideshow',
  'text/plain': 'article',
};

const FILE_TYPE_COLORS: Record<string, string> = {
  'application/pdf': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'image/jpeg': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'image/png': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'image/gif': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'image/webp': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'application/msword': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'application/vnd.ms-excel': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'application/vnd.ms-powerpoint': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'text/plain': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFileIcon = (fileType: string) => {
    return FILE_TYPE_ICONS[fileType] || 'insert_drive_file';
  };

  const getFileColor = (fileType: string) => {
    return FILE_TYPE_COLORS[fileType] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  const getCategoryLabel = (category: string | null) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat?.label || 'Other';
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('word')) return 'Word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'Excel';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'PowerPoint';
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType === 'text/plain') return 'Text';
    return 'File';
  };

  // Filter and group documents by category
  const filteredDocuments = documents.filter((doc) => {
    if (categoryFilter === 'all') return true;
    return doc.category === categoryFilter;
  });

  // Count documents per category
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = documents.filter((d) => d.category === cat.value).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading documents...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-orange-50 to-amber-50 dark:from-primary/20 dark:via-[#2a221a] dark:to-[#1a1410] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <span className="material-symbols-outlined text-lg">folder_open</span>
              Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#181411] dark:text-white mb-4">
              Document Library
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access important PTA documents, forms, newsletters, and meeting minutes all in one place.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar - Category Filter */}
          <aside className="mb-8 lg:mb-0">
            <div className="sticky top-24 bg-white dark:bg-[#2a221a] rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <h3 className="font-bold text-[#181411] dark:text-white mb-4">Categories</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">folder</span>
                    All Documents
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    categoryFilter === 'all' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {documents.length}
                  </span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === cat.value
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                      {cat.label}
                    </span>
                    {categoryCounts[cat.value] > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        categoryFilter === cat.value ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {categoryCounts[cat.value]}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {filteredDocuments.length === 0 ? (
              <div className="bg-white dark:bg-[#2a221a] rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">folder_off</span>
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No documents found</h3>
                <p className="text-gray-500">
                  {categoryFilter === 'all'
                    ? 'No documents have been uploaded yet.'
                    : `No documents in the ${getCategoryLabel(categoryFilter)} category.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results count */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                  {categoryFilter !== 'all' && ` in ${getCategoryLabel(categoryFilter)}`}
                </p>

                {/* Document List */}
                <div className="grid gap-4">
                  {filteredDocuments.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white dark:bg-[#2a221a] rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* File Icon */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${getFileColor(doc.file_type)}`}>
                          <span className="material-symbols-outlined text-2xl">
                            {getFileIcon(doc.file_type)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-[#181411] dark:text-white group-hover:text-primary transition-colors">
                                {doc.title}
                              </h3>
                              {doc.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors shrink-0">
                              download
                            </span>
                          </div>

                          {/* Meta info */}
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">calendar_today</span>
                              {formatDate(doc.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">description</span>
                              {getFileTypeLabel(doc.file_type)}
                            </span>
                            {doc.file_size && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">data_usage</span>
                                {formatFileSize(doc.file_size)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
