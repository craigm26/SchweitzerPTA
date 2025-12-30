export default function AdminDashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight tracking-tight">
            Welcome back, Sarah!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Here's what's happening at Schweitzer Elementary today.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dashboard cards */}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Recent News Drafts */}
            {/* Recent Activity */}
          </div>
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Sponsor Spotlight */}
            {/* Upcoming Events */}
          </div>
        </div>
      </div>
    </div>
  );
}
