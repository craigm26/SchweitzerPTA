'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  createFundraiserEvent,
  deleteFundraiserEvent,
  FundraiserEvent,
  getFundraisers,
  updateFundraiserEvent,
} from '@/lib/api';

export default function FundraiserManagementPage() {
  const [fundraisers, setFundraisers] = useState<FundraiserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFundraiser, setEditingFundraiser] = useState<FundraiserEvent | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    is_active: true,
  });

  useEffect(() => {
    fetchFundraisers();
  }, []);

  async function fetchFundraisers() {
    try {
      const data = await getFundraisers({ includeInactive: true });
      setFundraisers(data || []);
    } catch (error) {
      console.error('Error fetching fundraisers:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'auction-item-photos');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(-1);

    try {
      if (editingFundraiser) {
        await updateFundraiserEvent(editingFundraiser.id, formData);
        setFundraisers((prev) =>
          prev.map((item) =>
            item.id === editingFundraiser.id ? { ...item, ...formData } as FundraiserEvent : item
          )
        );
      } else {
        const newFundraiser = await createFundraiserEvent(formData);
        setFundraisers((prev) => [newFundraiser, ...prev]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving fundraiser:', error);
      alert('Failed to save fundraiser');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fundraiser?')) return;

    setActionLoading(id);
    try {
      await deleteFundraiserEvent(id);
      setFundraisers((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting fundraiser:', error);
      alert('Failed to delete fundraiser');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (fundraiser: FundraiserEvent) => {
    setActionLoading(fundraiser.id);
    try {
      await updateFundraiserEvent(fundraiser.id, { is_active: !fundraiser.is_active });
      setFundraisers((prev) =>
        prev.map((item) =>
          item.id === fundraiser.id ? { ...item, is_active: !item.is_active } : item
        )
      );
    } catch (error) {
      console.error('Error updating fundraiser status:', error);
      alert('Failed to update fundraiser status');
    } finally {
      setActionLoading(null);
    }
  };

  const openAddModal = () => {
    setFormData({ title: '', description: '', image: '', is_active: true });
    setEditingFundraiser(null);
    setImagePreview(null);
    setShowAddModal(true);
  };

  const openEditModal = (fundraiser: FundraiserEvent) => {
    setFormData({
      title: fundraiser.title,
      description: fundraiser.description,
      image: fundraiser.image || '',
      is_active: fundraiser.is_active,
    });
    setEditingFundraiser(fundraiser);
    setImagePreview(fundraiser.image || null);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingFundraiser(null);
    setFormData({ title: '', description: '', image: '', is_active: true });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const query = searchQuery.toLowerCase();
    return (
      fundraiser.title.toLowerCase().includes(query) ||
      fundraiser.description.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading fundraisers...</p>
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
            <span className="font-medium text-gray-900 dark:text-white">Fundraisers</span>
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Fundraiser Management
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage fundraiser visibility, photos, and descriptions.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add Fundraiser
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search fundraisers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2a221a] shadow-sm">
          {filteredFundraisers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">campaign</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No fundraisers found</h3>
              <p className="text-gray-500 mb-4">Add your first fundraiser to get started.</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Add Fundraiser
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Photo</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFundraisers.map((fundraiser) => {
                      const isRowLoading = actionLoading === fundraiser.id;

                      return (
                        <tr
                          key={fundraiser.id}
                          className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors ${
                            isRowLoading ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                              {fundraiser.image ? (
                                <img src={fundraiser.image} alt={fundraiser.title} className="h-full w-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-2xl text-gray-400">photo</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#181411] dark:text-white">
                            {fundraiser.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            <span className="line-clamp-2">{fundraiser.description}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleActive(fundraiser)}
                              disabled={isRowLoading}
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                fundraiser.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {fundraiser.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(fundraiser)}
                                disabled={isRowLoading}
                                className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(fundraiser.id)}
                                disabled={isRowLoading}
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
                Showing {filteredFundraisers.length} of {fundraisers.length} fundraisers
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
                {editingFundraiser ? 'Edit Fundraiser' : 'Add New Fundraiser'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Fundraiser title"
                />
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-2">Photo</label>

                {(imagePreview || formData.image) && (
                  <div className="mb-3 relative inline-block">
                    <div className="w-24 h-24 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={imagePreview || formData.image}
                        alt="Fundraiser preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="fundraiser-photo-upload"
                  />
                  <label
                    htmlFor="fundraiser-photo-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-sm font-medium text-[#181411] dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">upload</span>
                        {formData.image ? 'Change Photo' : 'Upload Photo'}
                      </>
                    )}
                  </label>
                  <span className="text-xs text-gray-500">JPEG, PNG, GIF, WebP (max 10MB)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Description for the fundraiser block..."
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
                  disabled={actionLoading === -1 || uploadingImage}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {actionLoading === -1 ? 'Saving...' : editingFundraiser ? 'Update' : 'Add Fundraiser'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
