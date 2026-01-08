'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDonors, createDonor, updateDonor, deleteDonor, Donor } from '@/lib/api';

export default function DonorManagementPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logo: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  async function fetchDonors() {
    try {
      const data = await getDonors({ includeInactive: true });
      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(-1);

    try {
      if (editingDonor) {
        await updateDonor(editingDonor.id, formData);
        setDonors((prev) =>
          prev.map((d) => (d.id === editingDonor.id ? { ...d, ...formData } as Donor : d))
        );
      } else {
        const newDonor = await createDonor(formData);
        setDonors((prev) => [newDonor, ...prev]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving donor:', error);
      alert('Failed to save donor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;

    setActionLoading(id);
    try {
      await deleteDonor(id);
      setDonors((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Error deleting donor:', error);
      alert('Failed to delete donor');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (donor: Donor) => {
    setActionLoading(donor.id);
    try {
      await updateDonor(donor.id, { is_active: !donor.is_active });
      setDonors((prev) =>
        prev.map((d) => (d.id === donor.id ? { ...d, is_active: !d.is_active } : d))
      );
    } catch (error) {
      console.error('Error updating donor:', error);
      alert('Failed to update donor');
    } finally {
      setActionLoading(null);
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', website: '', logo: '', description: '', is_active: true });
    setEditingDonor(null);
    setShowAddModal(true);
  };

  const openEditModal = (donor: Donor) => {
    setFormData({
      name: donor.name,
      website: donor.website,
      logo: donor.logo || '',
      description: donor.description || '',
      is_active: donor.is_active,
    });
    setEditingDonor(donor);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingDonor(null);
    setFormData({ name: '', website: '', logo: '', description: '', is_active: true });
  };

  // Filter donors
  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading donors...</p>
        </div>
      </div>
    );
  }

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
            <span className="font-medium text-gray-900 dark:text-white">Donors</span>
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Donor Management
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage partnerships, track contributions, and update donor visibility.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Donor
            </button>
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
              placeholder="Search donors by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2a221a] shadow-sm">
          {filteredDonors.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">handshake</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No donors found</h3>
              <p className="text-gray-500 mb-4">Add your first donor to get started.</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Add Donor
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Logo</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Donor Name
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Website</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonors.map((donor) => {
                      const isLoading = actionLoading === donor.id;

                      return (
                        <tr
                          key={donor.id}
                          className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors ${
                            isLoading ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {donor.logo ? (
                                <img src={donor.logo} alt={donor.name} className="max-h-10 max-w-10 object-contain" />
                              ) : (
                                <span className="material-symbols-outlined text-2xl text-gray-400">storefront</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#181411] dark:text-white">{donor.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {donor.website ? (
                              <a
                                href={donor.website.startsWith('http') ? donor.website : `https://${donor.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {donor.website.replace(/^https?:\/\//, '')}
                              </a>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleActive(donor)}
                              disabled={isLoading}
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                donor.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {donor.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(donor)}
                                disabled={isLoading}
                                className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(donor.id)}
                                disabled={isLoading}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredDonors.length} of {donors.length} donors
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">
                {editingDonor ? 'Edit Donor' : 'Add New Donor'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Brief description of the donor..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm text-[#181411] dark:text-white">
                  Active (visible on website)
                </label>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-[#181411] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === -1}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {actionLoading === -1 ? 'Saving...' : editingDonor ? 'Update' : 'Add Donor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
