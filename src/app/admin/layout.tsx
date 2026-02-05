'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading, signOut } = useAuth();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/news', label: 'News Management', icon: 'article' },
    { href: '/admin/events', label: 'Event Management', icon: 'calendar_month' },
    { href: '/admin/fundraisers', label: 'Fundraiser Management', icon: 'campaign' },
    { href: '/admin/volunteers', label: 'Volunteer Management', icon: 'volunteer_activism' },
    { href: '/admin/donors', label: 'Donor Management', icon: 'handshake' },
    { href: '/admin/auction-items', label: 'Auction Items', icon: 'gavel' },
    { href: '/admin/documents', label: 'Document Management', icon: 'folder_open' },
    { href: '/admin/users', label: 'User Management', icon: 'group' },
  ];

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // Get initials for avatar
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name
  const getRoleDisplay = (role: string | undefined) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'editor':
        return 'Editor';
      default:
        return 'Member';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#181411]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#181411] text-white flex flex-col shrink-0 fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">pets</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Schweitzer PTA</h1>
              <span className="text-primary text-xs font-bold uppercase tracking-wider">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-white/10">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            Settings
          </Link>
        </div>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                <span className="text-amber-800 font-bold">
                  {getInitials(profile?.full_name || profile?.email)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {profile?.full_name || profile?.email || 'User'}
                </p>
                <p className="text-white/50 text-xs">{getRoleDisplay(profile?.role)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/50 hover:text-white transition-colors"
                title="Log out"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white dark:bg-[#221910] border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-primary">
                Home
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-primary font-medium">Dashboard</span>
            </nav>

            {/* Search */}
            <div className="relative max-w-md w-full mx-8">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search news, users, or sponsors..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div></div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
