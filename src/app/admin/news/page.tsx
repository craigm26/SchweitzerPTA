import Link from 'next/link';

export default function NewsManagementPage() {
  const stats = [
    { icon: 'check_circle', label: 'Published', value: '12', color: 'text-green-500' },
    { icon: 'edit_note', label: 'Drafts', value: '3', color: 'text-amber-500' },
    { icon: 'schedule', label: 'Scheduled', value: '1', color: 'text-blue-500' },
    { icon: 'inventory_2', label: 'Archived', value: '26', color: 'text-gray-500' },
  ];

  const articles = [
    {
      id: 1,
      title: 'Fall Festival 2023 Recap: A Wildcat S...',
      excerpt: 'Thank you to everyone who came out to sup...',
      author: { name: 'Jane Doe', avatar: 'JD' },
      modified: { date: 'Oct 12, 2023', time: '10:42 AM' },
      status: 'Published',
      statusColor: 'bg-green-100 text-green-600',
      sponsor: 'Main Street Pizza',
    },
    {
      id: 2,
      title: 'Teacher Appreciation Lunch',
      excerpt: 'Sign up to bring a dish for our wonderful tea...',
      author: { name: 'John Smith', avatar: 'JS' },
      modified: { date: 'Oct 15, 2023', time: '2:15 PM' },
      status: 'Draft',
      statusColor: 'bg-amber-100 text-amber-600',
      sponsor: null,
    },
    {
      id: 3,
      title: 'Winter Break Schedule & Reminders',
      excerpt: 'Important dates for the upcoming winter br...',
      author: { name: 'PTA Admin', avatar: 'PT' },
      modified: { date: 'Nov 01, 2023', time: '9:00 AM' },
      status: 'Scheduled',
      statusColor: 'bg-blue-100 text-blue-600',
      sponsor: 'Local Credit Union',
    },
    {
      id: 4,
      title: 'Spring Fundraiser Kickoff: Wildcats ...',
      excerpt: 'Our biggest fundraiser of the year is here!',
      author: { name: 'Jane Doe', avatar: 'JD' },
      modified: { date: 'Nov 10, 2023', time: '11:30 AM' },
      status: 'Draft',
      statusColor: 'bg-amber-100 text-amber-600',
      sponsor: 'Elite Motors',
    },
    {
      id: 5,
      title: 'Volunteer Appreciation Breakfast',
      excerpt: 'A huge thank you to all our volunteers.',
      author: { name: 'Principal', avatar: 'PR' },
      modified: { date: 'Sep 20, 2023', time: '8:15 AM' },
      status: 'Archived',
      statusColor: 'bg-gray-100 text-gray-600',
      sponsor: null,
    },
  ];

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
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Filter by:</span>
            <select className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Status: All</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Scheduled</option>
              <option>Archived</option>
            </select>
            <select className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Date: All Time</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#2a221a] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
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
                    Sponsor
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#181411] dark:text-white text-sm">{article.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{article.excerpt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800">
                          {article.author.avatar}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{article.author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-[#181411] dark:text-white">{article.modified.date}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{article.modified.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${article.statusColor}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {article.sponsor ? (
                        <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                          {article.sponsor}
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">Rows per page: 10</div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                2
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                3
              </button>
              <span className="text-gray-400">...</span>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
