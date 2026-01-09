'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
      });
    }
  }, [profile, user]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-4xl flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-yellow-600 mb-4">warning</span>
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">Not Logged In</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">You need to be logged in to access settings.</p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">login</span>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          full_name: profileForm.full_name,
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'site', label: 'Site Settings', icon: 'settings' },
    { id: 'about', label: 'About', icon: 'info' },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Logged In Status Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900/20 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {profile?.full_name || 'No name set'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-xs text-primary font-medium capitalize">{profile?.role || 'member'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link className="hover:text-primary transition-colors" href="/admin">
              Admin
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-medium text-gray-900 dark:text-white">Settings</span>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Settings
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your account and site preferences.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#2a221a] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {activeTab === 'profile' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>

              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed here.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</p>
                      <p className="text-sm text-gray-500 capitalize">{profile?.role || 'Member'}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</p>
                      <p className="text-sm text-gray-500">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'site' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Site Settings</h3>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-[#181411] rounded-lg">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-2xl text-primary">school</span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Schweitzer Elementary PTA</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Website for the Albert Schweitzer Elementary School Parent Teacher Association
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-gray-500">link</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Site URL</span>
                    </div>
                    <p className="text-sm text-gray-500">schweitzerpta.com</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-gray-500">cloud</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hosting</span>
                    </div>
                    <p className="text-sm text-gray-500">Vercel</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-gray-500">database</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database</span>
                    </div>
                    <p className="text-sm text-gray-500">Supabase</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-gray-500">code</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Framework</span>
                    </div>
                    <p className="text-sm text-gray-500">Next.js 16 + React 19</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">About This Site</h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-white">school</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Schweitzer Elementary PTA</h4>
                    <p className="text-gray-500">Official PTA Website</p>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <p>
                    This website serves the Albert Schweitzer Elementary School community, providing information
                    about PTA events, news, volunteer opportunities, and donor recognition.
                  </p>
                  <p>
                    Built with modern web technologies to provide a fast, accessible experience for all
                    families and community members.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h5>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#181411] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <span className="material-symbols-outlined text-lg">home</span>
                      View Homepage
                    </Link>
                    <Link
                      href="/calendar"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#181411] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <span className="material-symbols-outlined text-lg">calendar_month</span>
                      Calendar
                    </Link>
                    <Link
                      href="/volunteer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#181411] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                      Volunteer
                    </Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
                  <p>&copy; {new Date().getFullYear()} Schweitzer Elementary PTA. All rights reserved.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
