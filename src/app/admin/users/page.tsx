'use client';

import { useEffect, useState } from 'react';
import { getUsers, updateUser, UserProfile } from '@/lib/api';

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      await updateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as UserProfile['role'] } : u))
      );
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'editor':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-600', 'bg-amber-500', 'bg-pink-400', 'bg-teal-600', 'bg-rose-400', 'bg-purple-500'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const getSignupUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/login?signup=true`;
    }
    return '/login?signup=true';
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getSignupUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

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
              View, edit, and manage user roles for the PTA portal.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-600 focus:ring-4 focus:ring-orange-500/30"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span>Invite New User</span>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[150px]"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="member">Member</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#2a221a]">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">group</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No users found</h3>
              <p className="text-gray-500">
                {users.length === 0 ? 'No users have signed up yet.' : 'No users match your search.'}
              </p>
            </div>
          ) : (
            <>
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
                        Last Login
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const isLoading = actionLoading === user.id;
                      const displayName = user.full_name || user.email?.split('@')[0] || 'Unknown';
                      const initials = displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

                      return (
                        <tr
                          key={user.id}
                          className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors ${
                            isLoading ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full ${getAvatarColor(displayName)} flex items-center justify-center text-white text-sm font-bold`}
                              >
                                {user.avatar_url ? (
                                  <img src={user.avatar_url} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  initials
                                )}
                              </div>
                              <span className="font-medium text-[#181411] dark:text-white">{displayName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                          <td className="px-6 py-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              disabled={isLoading}
                              className={`text-xs font-bold px-2 py-1 rounded border-0 capitalize ${getRoleColor(user.role)}`}
                            >
                              <option value="member">Member</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {getRelativeTime(user.last_login)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
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
                  Showing {filteredUsers.length} of {users.length} users
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">User Details</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div
                className={`w-20 h-20 rounded-full ${getAvatarColor(editingUser.full_name || '')} flex items-center justify-center text-white text-2xl font-bold`}
              >
                {editingUser.avatar_url ? (
                  <img src={editingUser.avatar_url} alt={editingUser.full_name || ''} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  (editingUser.full_name || editingUser.email)?.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg text-[#181411] dark:text-white">
                  {editingUser.full_name || editingUser.email?.split('@')[0]}
                </h4>
                <p className="text-gray-500">{editingUser.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <p className={`inline-block text-sm font-bold px-3 py-1 rounded capitalize ${getRoleColor(editingUser.role)}`}>
                  {editingUser.role}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                <p className="text-[#181411] dark:text-white">{getRelativeTime(editingUser.last_login)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                <p className="text-[#181411] dark:text-white">
                  {new Date(editingUser.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditingUser(null)}
              className="w-full mt-6 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-[#181411] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">Invite New User</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Share this signup link with the person you want to invite to the PTA portal:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getSignupUrl()}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] text-sm text-gray-600 dark:text-gray-300"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-white hover:bg-orange-600'
                  }`}
                >
                  {copied ? (
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-600 text-sm mt-2">Link copied to clipboard!</p>
              )}
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">info</span>
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  <p className="font-medium mb-1">Note</p>
                  <p>New users will have the &quot;Member&quot; role by default. You can change their role after they sign up.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-[#181411] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
