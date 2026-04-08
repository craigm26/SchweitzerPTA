'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createEvent, deleteEvent, Event, getEvents, updateEvent } from '@/lib/api';

const sortEvents = (events: Event[]) =>
  [...events].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    if (aDate !== bDate) return aDate - bDate;
    return b.id - a.id;
  });

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    end_date: '',
    time: '',
    end_time: '',
    location: '',
    category: 'meeting',
    image: '',
    is_featured: false,
    is_all_day: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data = await getEvents();
      setEvents(sortEvents(data || []));
    } catch (error) {
      console.error('Error fetching events:', error);
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
      uploadFormData.append('bucket', 'event-images');

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

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      end_date: formData.end_date || null,
      time: formData.is_all_day ? null : formData.time || null,
      end_time: formData.is_all_day ? null : formData.end_time || null,
      location: formData.location.trim(),
      category: formData.category,
      image: formData.image.trim() || undefined,
      is_featured: formData.is_featured,
      is_all_day: formData.is_all_day,
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        setEvents((prev) =>
          sortEvents(prev.map((item) => (item.id === editingEvent.id ? { ...item, ...payload } as Event : item)))
        );
      } else {
        const newEvent = await createEvent(payload);
        setEvents((prev) => sortEvents([newEvent, ...prev]));
      }
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    setActionLoading(id);
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setActionLoading(null);
    }
  };

  const formatTime12Hour = (time: string) => {
    const match = time.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
    if (!match) return time;
    const hour = Number(match[1]);
    const minute = match[2];
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  const formatEventSchedule = (event: Event) => {
    const startDate = new Date(`${event.date}T12:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (event.is_all_day || !event.time) {
      return event.end_date && event.end_date !== event.date ? `${startDate} onwards • All Day` : `${startDate} • All Day`;
    }

    const startTime = formatTime12Hour(event.time);
    const endTime = event.end_time ? ` - ${formatTime12Hour(event.end_time)}` : '';
    return `${startDate} • ${startTime}${endTime}`;
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      end_date: '',
      time: '18:00',
      end_time: '',
      location: '',
      category: 'meeting',
      image: '',
      is_featured: false,
      is_all_day: false,
    });
    setEditingEvent(null);
    setImagePreview(null);
    setShowAddModal(true);
  };

  const openEditModal = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      end_date: event.end_date || '',
      time: event.time || '',
      end_time: event.end_time || '',
      location: event.location,
      category: event.category || 'general',
      image: event.image || '',
      is_featured: event.is_featured,
      is_all_day: event.is_all_day,
    });
    setEditingEvent(event);
    setImagePreview(event.image || null);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      end_date: '',
      time: '',
      end_time: '',
      location: '',
      category: 'meeting',
      image: '',
      is_featured: false,
      is_all_day: false,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      (event.category || '').toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link className="hover:text-primary transition-colors" href="/admin">
              Admin
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-medium text-gray-900 dark:text-white">Events</span>
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Event Management
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage event visibility, images, schedule details, and front-end presentation.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add Event
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2a221a] shadow-sm">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">event_busy</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No events found</h3>
              <p className="text-gray-500 mb-4">Add your first event to get started.</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Add Event
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
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Schedule</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Featured</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => {
                      const isRowLoading = actionLoading === event.id;

                      return (
                        <tr
                          key={event.id}
                          className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors ${
                            isRowLoading ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                              {event.image ? (
                                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-2xl text-gray-400">photo</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#181411] dark:text-white">
                            <div className="flex flex-col gap-1">
                              <span>{event.title}</span>
                              <span className="line-clamp-1 text-xs text-gray-500">{event.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {formatEventSchedule(event)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {event.location}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 capitalize">
                            {event.category || 'general'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                event.is_featured ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {event.is_featured ? 'Featured' : 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(event)}
                                disabled={isRowLoading}
                                className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
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
                Showing {filteredEvents.length} of {events.length} events
              </div>
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
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
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-2">Photo</label>

                {(imagePreview || formData.image) && (
                  <div className="mb-3 relative inline-block">
                    <div className="w-24 h-24 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={imagePreview || formData.image}
                        alt="Event preview"
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
                    id="event-photo-upload"
                  />
                  <label
                    htmlFor="event-photo-upload"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="School Cafeteria"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="fundraiser">Fundraiser</option>
                    <option value="social">Social</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    min={formData.date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_all_day"
                  checked={formData.is_all_day}
                  onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_all_day" className="text-sm text-[#181411] dark:text-white">
                  All Day Event
                </label>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${formData.is_all_day ? 'opacity-40 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    disabled={formData.is_all_day}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    disabled={formData.is_all_day}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
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
                  placeholder="Description for the event block..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_featured" className="text-sm text-[#181411] dark:text-white">
                  Feature this event
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
                  {actionLoading === -1 ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
