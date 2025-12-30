export default function UserManagementPage() {
  const users = [
    {
      id: 1,
      name: 'Jane Doe',
      avatar: 'JD',
      avatarBg: 'bg-blue-600',
      email: 'jane.doe@schweitzer.edu',
      role: 'Administrator',
      roleColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-600',
      lastLogin: '2 hours ago',
    },
    {
      id: 2,
      name: 'John Smith',
      avatar: 'JS',
      avatarBg: 'bg-amber-500',
      email: 'john.smith@schweitzer.edu',
      role: 'Editor',
      roleColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-600',
      lastLogin: '1 day ago',
    },
    {
      id: 3,
      name: 'Emily Chen',
      avatar: 'EC',
      avatarBg: 'bg-pink-400',
      email: 'emily.chen@example.com',
      role: 'Editor',
      roleColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      status: 'Invited',
      statusColor: 'bg-purple-100 text-purple-600',
      lastLogin: 'Never',
    },
    {
      id: 4,
      name: 'Michael Brown',
      avatar: 'MB',
      avatarBg: 'bg-teal-600',
      email: 'm.brown@example.com',
      role: 'Administrator',
      roleColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-600',
      lastLogin: '3 days ago',
    },
    {
      id: 5,
      name: 'Sarah Wilson',
      avatar: 'SW',
      avatarBg: 'bg-rose-400',
      email: 's.wilson@example.com',
      role: 'Editor',
      roleColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-600',
      lastLogin: '1 week ago',
    },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight text-[#181411] dark:text-white md:text-4xl">
              User &amp; Role Management
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400">
              View, edit, and invite administrators to the PTA portal.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-600 focus:ring-4 focus:ring-orange-500/30">
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span>Invite New Administrator</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[150px]">
            <option>All Roles</option>
            <option>Administrator</option>
            <option>Editor</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#2a221a]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${user.avatarBg} flex items-center justify-center text-white text-sm font-bold`}
                        >
                          {user.avatar}
                        </div>
                        <span className="font-medium text-[#181411] dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${user.roleColor}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${user.statusColor}`}>{user.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {user.status === 'Invited' && (
                          <button className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span className="material-symbols-outlined text-lg">send</span>
                          </button>
                        )}
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
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-bold">1-5</span> of <span className="font-bold">42</span> users
            </div>
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
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                8
              </button>
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
