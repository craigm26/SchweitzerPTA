'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AuctionItem,
  Donor,
  getAuctionItems,
  createAuctionItem,
  updateAuctionItem,
  deleteAuctionItem,
  getDonors,
} from '@/lib/api';

const ITEM_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'live', label: 'Live Auction' },
  { value: 'silent', label: 'Silent Auction' },
];

type ItemType = 'live' | 'silent';

export default function AuctionItemsPage() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | ItemType>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AuctionItem | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    donor_id: null as number | null,
    title: '',
    description: '',
    item_type: 'silent' as ItemType,
    image_urls: [] as string[],
    estimated_value: '',
    restrictions: '',
    quantity: '',
    display_order: '0',
    is_active: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsData, donorsData] = await Promise.all([
          getAuctionItems({ includeInactive: true, limit: 'all' }),
          getDonors({ includeInactive: true }),
        ]);
        setItems(itemsData || []);
        setDonors(donorsData || []);
      } catch (error) {
        console.error('Error fetching auction items:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const donorsById = useMemo(() => {
    return new Map(donors.map((donor) => [donor.id, donor]));
  }, [donors]);

  const filteredItems = items.filter((item) => {
    const donor = item.donor || (item.donor_id ? donorsById.get(item.donor_id) : null);
    const donorName = donor?.name?.toLowerCase() || '';
    const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const donorMatch = donorName.includes(searchQuery.toLowerCase());
    const typeMatch = itemTypeFilter === 'all' || item.item_type === itemTypeFilter;
    return (titleMatch || donorMatch) && typeMatch;
  });

  const openAddModal = () => {
    setFormData({
      donor_id: null,
      title: '',
      description: '',
      item_type: 'silent',
      image_urls: [],
      estimated_value: '',
      restrictions: '',
      quantity: '',
      display_order: '0',
      is_active: true,
    });
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: AuctionItem) => {
    setFormData({
      donor_id: item.donor_id,
      title: item.title,
      description: item.description || '',
      item_type: item.item_type,
      image_urls: item.image_urls || [],
      estimated_value: item.estimated_value?.toString() || '',
      restrictions: item.restrictions || '',
      quantity: item.quantity?.toString() || '',
      display_order: item.display_order?.toString() || '0',
      is_active: item.is_active,
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setActionLoading(-1);

    const payload = {
      donor_id: formData.donor_id,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      item_type: formData.item_type,
      image_urls: formData.image_urls,
      estimated_value: formData.estimated_value ? Number(formData.estimated_value) : null,
      restrictions: formData.restrictions.trim() || null,
      quantity: formData.quantity ? Number(formData.quantity) : null,
      display_order: Number(formData.display_order) || 0,
      is_active: formData.is_active,
    };

    try {
      if (editingItem) {
        const updated = await updateAuctionItem(editingItem.id, payload);
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)));
      } else {
        const created = await createAuctionItem(payload);
        setItems((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving auction item:', error);
      alert('Failed to save auction item');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setActionLoading(id);
    try {
      await deleteAuctionItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting auction item:', error);
      alert('Failed to delete auction item');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (item: AuctionItem) => {
    setActionLoading(item.id);
    try {
      const updated = await updateAuctionItem(item.id, { is_active: !item.is_active });
      setItems((prev) => prev.map((current) => (current.id === item.id ? updated : current)));
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Failed to update item status');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePhotosUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;
    const uploadedUrls: string[] = [];

    setUploadingPhotos(true);
    try {
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          alert('Please upload an image file (JPEG, PNG, GIF, or WebP)');
          continue;
        }
        if (file.size > maxSize) {
          alert('Each file must be less than 10MB');
          continue;
        }

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
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          image_urls: [...prev.image_urls, ...uploadedUrls],
        }));
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, photoIndex) => photoIndex !== index),
    }));
  };

  const selectedDonor = formData.donor_id ? donorsById.get(formData.donor_id) : null;

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading auction items...</p>
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
            <span className="font-medium text-gray-900 dark:text-white">Auction Items</span>
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Auction Items
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage live and silent auction items and link them to sponsors.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Item
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by item name or sponsor..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label htmlFor="auction-item-type-filter" className="sr-only">
              Filter by item type
            </label>
            <select
              id="auction-item-type-filter"
              value={itemTypeFilter}
              onChange={(event) => setItemTypeFilter(event.target.value as 'all' | ItemType)}
              className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {ITEM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2a221a] shadow-sm">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">gavel</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No auction items found</h3>
              <p className="text-gray-500 mb-4">Add your first item to get started.</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Add Item
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#181411]">
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Item
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Type
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Sponsor
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Photos
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const isLoading = actionLoading === item.id;
                      const donor = item.donor || (item.donor_id ? donorsById.get(item.donor_id) : null);

                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors ${
                            isLoading ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {item.image_urls?.[0] ? (
                                <Image
                                  src={item.image_urls[0]}
                                  alt={item.title}
                                  width={48}
                                  height={48}
                                  unoptimized
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-xl text-gray-400">photo</span>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-[#181411] dark:text-white">{item.title}</p>
                                {item.estimated_value !== null && (
                                  <p className="text-xs text-gray-500">Est. ${item.estimated_value}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 capitalize">
                            {item.item_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {donor ? (
                              <div className="flex items-center gap-2">
                                {donor.logo ? (
                                  <Image
                                    src={donor.logo}
                                    alt={donor.name}
                                    width={24}
                                    height={24}
                                    unoptimized
                                    className="w-6 h-6 rounded object-contain"
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-lg text-gray-400">handshake</span>
                                )}
                                <span>{donor.name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {item.image_urls?.length || 0}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleActive(item)}
                              disabled={isLoading}
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                item.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {item.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                disabled={isLoading}
                                className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
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
                Showing {filteredItems.length} of {items.length} items
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">
                {editingItem ? 'Edit Auction Item' : 'Add New Auction Item'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="auction-item-title"
                    className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                  >
                    Item Title *
                  </label>
                  <input
                    id="auction-item-title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auction-item-type"
                    className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                  >
                    Item Type
                  </label>
                  <select
                    id="auction-item-type"
                    value={formData.item_type}
                    onChange={(event) => setFormData({ ...formData, item_type: event.target.value as ItemType })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="silent">Silent Auction</option>
                    <option value="live">Live Auction</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="auction-item-sponsor"
                  className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                >
                  Sponsor
                </label>
                <select
                  id="auction-item-sponsor"
                  value={formData.donor_id ?? ''}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      donor_id: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">No sponsor</option>
                  {donors.map((donor) => (
                    <option key={donor.id} value={donor.id}>
                      {donor.name}
                    </option>
                  ))}
                </select>
                {selectedDonor && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-[#181411]">
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-[#2a221a] border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                      {selectedDonor.logo ? (
                        <Image
                          src={selectedDonor.logo}
                          alt={selectedDonor.name}
                          width={48}
                          height={48}
                          unoptimized
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-xl text-gray-400">handshake</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#181411] dark:text-white">{selectedDonor.name}</p>
                      <p className="text-xs text-gray-500">{selectedDonor.website}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="auction-item-description"
                  className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                >
                  Description
                </label>
                <textarea
                  id="auction-item-description"
                  rows={3}
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Describe the item or experience"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="auction-item-estimated-value"
                    className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                  >
                    Estimated Value
                  </label>
                  <input
                    id="auction-item-estimated-value"
                    type="number"
                    min="0"
                    value={formData.estimated_value}
                    onChange={(event) => setFormData({ ...formData, estimated_value: event.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auction-item-quantity"
                    className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    id="auction-item-quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auction-item-display-order"
                    className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                  >
                    Display Order
                  </label>
                  <input
                    id="auction-item-display-order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(event) => setFormData({ ...formData, display_order: event.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auction-item-restrictions"
                  className="block text-sm font-medium text-[#181411] dark:text-white mb-1"
                >
                  Restrictions or Notes
                </label>
                <textarea
                  id="auction-item-restrictions"
                  rows={2}
                  value={formData.restrictions}
                  onChange={(event) => setFormData({ ...formData, restrictions: event.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Expiration dates, blackout times, etc."
                />
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-2">
                  Item Photos
                </label>
                {formData.image_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-3">
                    {formData.image_urls.map((url, index) => (
                      <div key={url} className="relative group">
                        <Image
                          src={url}
                          alt={`Item photo ${index + 1}`}
                          width={160}
                          height={96}
                          unoptimized
                          className="h-24 w-full rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handlePhotosUpload}
                    className="hidden"
                    id="item-photos-upload"
                  />
                  <label
                    htmlFor="item-photos-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-sm font-medium text-[#181411] dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      uploadingPhotos ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingPhotos ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">upload</span>
                        {formData.image_urls.length > 0 ? 'Add Photos' : 'Upload Photos'}
                      </>
                    )}
                  </label>
                  <span className="text-xs text-gray-500">JPEG, PNG, GIF, WebP (max 10MB each)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(event) => setFormData({ ...formData, is_active: event.target.checked })}
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
                  disabled={actionLoading === -1 || uploadingPhotos}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {actionLoading === -1 ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
