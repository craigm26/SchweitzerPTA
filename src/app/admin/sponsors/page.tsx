import Link from 'next/link';

export default function SponsorManagementPage() {
  const sponsors = [
    {
      id: 1,
      name: "Joe's Pizza & Subs",
      website: 'joespizza.com',
      level: 'Platinum',
      levelColor: 'bg-purple-100 text-purple-600',
      logo: '🍕',
      logoBg: 'bg-green-100',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Main Street Books',
      website: 'mainstbooks.com',
      level: 'Gold',
      levelColor: 'bg-amber-100 text-amber-600',
      logo: '📚',
      logoBg: 'bg-amber-100',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Tech Solutions Inc.',
      website: 'techsolutions.io',
      level: 'Silver',
      levelColor: 'bg-gray-100 text-gray-600',
      logo: '💻',
      logoBg: 'bg-teal-100',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sunny Day Care Center',
      website: 'sunnydaycare.com',
      level: 'Bronze',
      levelColor: 'bg-orange-100 text-orange-600',
      logo: '☀️',
      logoBg: 'bg-amber-200',
      status: 'Active',
    },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link className="hover:text-primary transition-colors" href="/admin">
              Admin
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-medium text-gray-900 dark:text-white">Sponsors</span>
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Sponsor Management
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage partnerships, track contributions, and update sponsor visibility.
              </p>
            </div>
            <Link
              href="/admin/sponsors/new"
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Sponsor
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search sponsors by name..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>All Levels</option>
            <option>Platinum</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Bronze</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2a221a] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Logo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Sponsor Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Website</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Level</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sponsor) => (
                  <tr
                    key={sponsor.id}
                    className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${sponsor.logoBg} flex items-center justify-center text-2xl`}
                      >
                        {sponsor.logo}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#181411] dark:text-white">{sponsor.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{sponsor.website}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${sponsor.levelColor}`}>
                        {sponsor.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-600">
                        {sponsor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            Showing 1 to 4 of 12 results
          </div>
        </div>
      </div>
    </div>
  );
}
