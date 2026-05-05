'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/analytics', label: 'Analytics', icon: 'monitoring' },
    { href: '/admin/news', label: 'News Management', icon: 'article' },
    { href: '/admin/calendar', label: 'Calendar Management', icon: 'calendar_month' },
    { href: '/admin/events', label: 'Event Management', icon: 'event' },
    { href: '/admin/photos', label: 'Photo Management', icon: 'photo_library' },
    { href: '/admin/fundraisers', label: 'Fundraiser Management', icon: 'campaign' },
    { href: '/admin/volunteers', label: 'Volunteer Management', icon: 'volunteer_activism' },
    { href: '/admin/donors', label: 'Donor Management', icon: 'handshake' },
    { href: '/admin/auction-items', label: 'Auction Items', icon: 'gavel' },
    { href: '/admin/subscribers', label: 'Subscribers', icon: 'mail' },
    { href: '/admin/documents', label: 'Document Management', icon: 'folder_open' },
    { href: '/admin/users', label: 'User Management', icon: 'group' },
  ];

  useEffect(() => {
    // close mobile drawer when route changes (incl. back/forward nav)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('admin-sidebar-collapsed');
      // one-shot read of persisted UI state on mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === '1') setCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0');
      } catch {}
      return next;
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  const sidebarWidth = collapsed ? 'md:w-20' : 'md:w-64';
  const mainOffset = collapsed ? 'md:ml-20' : 'md:ml-64';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#181411]">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-[#181411] text-white flex flex-col shrink-0 w-72 ${sidebarWidth} transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo / collapse / close */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
          <Link
            href="/admin"
            className={`flex items-center gap-3 min-w-0 ${collapsed ? 'md:justify-center md:w-full' : ''}`}
          >
            <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">pets</span>
            </div>
            <div className={`min-w-0 ${collapsed ? 'md:hidden' : ''}`}>
              <h1 className="font-bold text-lg leading-tight truncate">Schweitzer PTA</h1>
              <span className="text-primary text-xs font-bold uppercase tracking-wider">Admin Panel</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={toggleCollapsed}
            className={`hidden md:inline-flex p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors ${
              collapsed ? 'md:hidden' : ''
            }`}
            title="Collapse menu"
            aria-label="Collapse menu"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Expand button when collapsed (desktop only) */}
        {collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden md:inline-flex justify-center items-center mx-auto mt-2 p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Expand menu"
            aria-label="Expand menu"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 py-3 text-sm font-medium transition-colors ${
                  collapsed ? 'md:justify-center md:px-0 px-6' : 'px-6'
                } ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
                <span className={`truncate ${collapsed ? 'md:hidden' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-white/10">
          <Link
            href="/admin/settings"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? 'Settings' : undefined}
            className={`flex items-center gap-3 py-4 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors ${
              collapsed ? 'md:justify-center md:px-0 px-6' : 'px-6'
            }`}
          >
            <span className="material-symbols-outlined text-xl shrink-0">settings</span>
            <span className={collapsed ? 'md:hidden' : ''}>Settings</span>
          </Link>
        </div>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          {loading ? (
            <div className={`flex items-center gap-3 ${collapsed ? 'md:justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse shrink-0"></div>
              <div className={`flex-1 min-w-0 ${collapsed ? 'md:hidden' : ''}`}>
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
              </div>
            </div>
          ) : (
            <div className={`flex items-center gap-3 ${collapsed ? 'md:flex-col md:gap-2' : ''}`}>
              <div
                className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center shrink-0"
                title={collapsed ? profile?.full_name || profile?.email || 'User' : undefined}
              >
                <span className="text-amber-800 font-bold">
                  {getInitials(profile?.full_name || profile?.email)}
                </span>
              </div>
              <div className={`flex-1 min-w-0 ${collapsed ? 'md:hidden' : ''}`}>
                <p className="font-medium text-sm truncate">
                  {profile?.full_name || profile?.email || 'User'}
                </p>
                <p className="text-white/50 text-xs">{getRoleDisplay(profile?.role)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/50 hover:text-white transition-colors shrink-0"
                title="Log out"
                aria-label="Log out"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 min-w-0 ml-0 ${mainOffset} transition-[margin] duration-300`}>
        {/* Top Bar */}
        <header className="bg-white dark:bg-[#221910] border-b border-gray-200 dark:border-gray-800 px-3 sm:px-6 py-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-md text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <nav className="flex items-center gap-2 text-sm min-w-0 shrink-0">
              <Link href="/" className="text-gray-500 hover:text-primary hidden sm:inline">
                Home
              </Link>
              <span className="text-gray-400 hidden sm:inline">›</span>
              <span className="text-primary font-medium truncate">Dashboard</span>
            </nav>

            <div className="relative flex-1 max-w-md mx-auto hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search news, users, or sponsors..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="ml-auto md:hidden">
              {!loading && (
                <div
                  className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center"
                  title={profile?.full_name || profile?.email || 'User'}
                >
                  <span className="text-amber-800 font-bold text-sm">
                    {getInitials(profile?.full_name || profile?.email)}
                  </span>
                </div>
              )}
            </div>
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
