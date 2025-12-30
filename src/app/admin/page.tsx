import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    {
      icon: 'article',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      label: 'News Posts',
      value: '24 Total',
      badge: '3 Pending',
      badgeColor: 'bg-red-100 text-red-600',
      link: { href: '/admin/news', label: 'Review Drafts' },
    },
    {
      icon: 'handshake',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      label: 'Sponsors',
      value: '12 Active',
      badge: 'Active',
      badgeColor: 'bg-green-100 text-green-600',
      link: { href: '/admin/sponsors', label: 'Manage Sponsors' },
    },
    {
      icon: 'event',
      iconBg: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      label: 'Events',
      value: '5 This Month',
      badge: 'Upcoming',
      badgeColor: 'bg-blue-100 text-blue-600',
      link: { href: '/events', label: 'View Calendar' },
    },
    {
      icon: 'group',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      label: 'Users',
      value: '156 Total',
      badge: null,
      link: { href: '/admin/users', label: 'User Settings' },
    },
  ];

  const recentDrafts = [
    { title: 'Fall Festival Recap', author: 'Sarah Jenkins', modified: '2 hours ago', status: 'Draft' },
    { title: 'November Lunch Menu', author: 'Mike Ross', modified: 'Yesterday', status: 'Review' },
    { title: 'Teacher Appreciation Week', author: 'Lisa Wong', modified: 'Oct 24, 2023', status: 'Draft' },
  ];

  const recentActivity = [
    { user: 'Mike Ross', action: 'published the "Winter Concert" event.', time: '10 minutes ago' },
    { user: 'Sarah Jenkins', action: 'updated sponsor "TechCorp Solutions".', time: '1 hour ago' },
    { user: 'Lisa Wong', action: 'created a new news draft.', time: '3 hours ago' },
  ];

  const upcomingEvents = [
    { month: 'NOV', day: '12', title: 'PTA General Meeting', time: '7:00 PM', location: 'Library' },
    { month: 'NOV', day: '24', title: 'Thanksgiving Feast', time: '11:00 AM', location: 'Cafeteria' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight tracking-tight">
            Welcome back, Sarah!
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Title
                      </th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Author
                      </th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last Modified
                      </th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDrafts.map((draft, index) => (
                      <tr key={index} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                        <td className="px-5 py-4 text-sm font-medium text-[#181411] dark:text-white">{draft.title}</td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{draft.author}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{draft.modified}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              draft.status === 'Draft'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            {draft.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button className="text-gray-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 text-center border-t border-gray-100 dark:border-gray-800">
                <Link href="/admin/news" className="text-gray-500 hover:text-primary text-sm font-medium">
                  View All Drafts
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-teal-600 text-sm">check_circle</span>
                    </div>
                    <div>
                      <p className="text-sm text-[#181411] dark:text-white">
                        <span className="font-bold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Sponsor Spotlight */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#181411] dark:text-white text-lg font-bold">Sponsor Spotlight</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-xl bg-amber-600 flex items-center justify-center mb-4">
                  <span className="text-white text-xs font-bold">GOLD</span>
                </div>
                <h3 className="text-[#181411] dark:text-white font-bold text-lg">Tech Solutions Inc.</h3>
                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2">Gold Tier</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Renewal Date: Dec 15, 2023</p>
                <button className="w-full py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#181411] dark:text-white text-lg font-bold">Upcoming Events</h2>
                <Link href="/events" className="text-primary text-sm font-bold hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex gap-3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
