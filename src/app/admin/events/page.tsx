'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getEvents, createEvent, updateEvent, deleteEvent, Event } from '@/lib/api';

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    end_date: '',
    time: '',
    end_time: '',
    location: '',
    category: 'general',
    image: '',
    pdf_url: '',
    pdf_filename: '',
    pdf_thumbnail_url: '',
    is_featured: false,
    is_all_day: false,
  });

  const pdfInputRef = useRef<HTMLInputElement>(null);
  // Bumped on every modal close so a late-arriving upload response can't
  // pollute the form state of a subsequently opened modal.
  const pdfUploadSessionRef = useRef(0);
  const [pdfUploading, setPdfUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(-1);

    const dataToSubmit = {
      ...formData,
      time: formData.is_all_day ? null : (formData.time || null),
      end_time: formData.is_all_day ? null : (formData.end_time || null),
      end_date: formData.end_date || null,
      pdf_url: formData.pdf_url || null,
      pdf_filename: formData.pdf_filename || null,
      pdf_thumbnail_url: formData.pdf_thumbnail_url || null,
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, dataToSubmit);
        setEvents((prev) =>
          prev.map((e) => (e.id === editingEvent.id ? { ...e, ...dataToSubmit } as Event : e))
        );
      } else {
        const newEvent = await createEvent(dataToSubmit);
        setEvents((prev) => [...prev, newEvent]);
        fetchEvents();
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
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleFeatured = async (event: Event) => {
    setActionLoading(event.id);
    try {
      await updateEvent(event.id, { is_featured: !event.is_featured });
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, is_featured: !e.is_featured } : e))
      );
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      return;
    }

    const session = pdfUploadSessionRef.current;
    setPdfUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/events/upload-flyer', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }
      const { pdf_url, pdf_filename, pdf_thumbnail_url } = await res.json();
      if (session !== pdfUploadSessionRef.current) return;
      setFormData((prev) => ({
        ...prev,
        pdf_url: pdf_url || '',
        pdf_filename: pdf_filename || '',
        pdf_thumbnail_url: pdf_thumbnail_url || '',
      }));
    } catch (error) {
      console.error('Error uploading flyer:', error);
      if (session !== pdfUploadSessionRef.current) return;
      alert(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      if (session === pdfUploadSessionRef.current) {
        setPdfUploading(false);
      }
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  const handlePdfRemove = () => {
    setFormData((prev) => ({
      ...prev,
      pdf_url: '',
      pdf_filename: '',
      pdf_thumbnail_url: '',
    }));
    if (pdfInputRef.current) pdfInputRef.current.value = '';
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
      category: 'general',
      image: '',
      pdf_url: '',
      pdf_filename: '',
      pdf_thumbnail_url: '',
      is_featured: false,
      is_all_day: false,
    });
    setEditingEvent(null);
    setShowAddModal(true);
  };

  const openEditModal = (event: Event) => {
    const isValidTime = event.time && /^\d{2}:\d{2}(:\d{2})?$/.test(event.time);
    const isAllDay = !isValidTime || event.is_all_day;
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      end_date: event.end_date || '',
      time: isValidTime && event.time ? event.time : '',
      end_time: event.end_time && /^\d{2}:\d{2}(:\d{2})?$/.test(event.end_time) ? event.end_time : '',
      location: event.location,
      category: event.category || 'general',
      image: event.image || '',
      pdf_url: event.pdf_url || '',
      pdf_filename: event.pdf_filename || '',
      pdf_thumbnail_url: event.pdf_thumbnail_url || '',
      is_featured: event.is_featured,
      is_all_day: isAllDay,
    });
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const closeModal = () => {
    pdfUploadSessionRef.current += 1;
    setShowAddModal(false);
    setEditingEvent(null);
    setPdfUploading(false);
  };

  const getPacificTimeZoneLabel = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return 'PT';
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      timeZoneName: 'short',
    }).formatToParts(date);
    return parts.find((part) => part.type === 'timeZoneName')?.value ?? 'PT';
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

  const formatEventTimeRange = (event: Event) => {
    if (event.is_all_day || !event.time) return 'All Day';
    const tzLabel = getPacificTimeZoneLabel(event.date);
    const start = formatTime12Hour(event.time);
    if (event.end_time) {
      return `${start} - ${formatTime12Hour(event.end_time)} ${tzLabel}`;
    }
    return `${start} ${tzLabel}`;
  };

  const getEventEndDate = (event: Event) => {
    if (event.end_date && event.end_date >= event.date) return event.end_date;
    return event.date;
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'workshop': return 'bg-blue-100 text-blue-600';
      case 'fundraiser': return 'bg-green-100 text-green-600';
      case 'social': return 'bg-purple-100 text-purple-600';
      case 'community': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

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
                Manage events displayed on the public events page.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Event
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search events by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Categories</option>
            <option value="workshop">Workshop</option>
            <option value="fundraiser">Fundraiser</option>
            <option value="social">Social</option>
            <option value="community">Community</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2a221a] shadow-sm">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">event_busy</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No events found</h3>
              <p className="text-gray-500 mb-4">Create your first event to get started.</p>
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
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Event Details</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Featured</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => {
                      const isLoading = actionLoading === event.id;
                      const endDate = getEventEndDate(event);
                      const isPast = new Date() > new Date(endDate + 'T23:59:59');

                      return (
                        <tr
                          key={event.id}
                          className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#181411] transition-colors ${isLoading ? 'opacity-50' : ''} ${isPast ? 'bg-gray-50/50 dark:bg-[#181411]/50' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className={`font-bold ${isPast ? 'text-gray-500' : 'text-[#181411] dark:text-white'}`}>
                                {(() => {
                                  const [y, m, d] = event.date.split('-').map(Number);
                                  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                })()}
                                {event.end_date && event.end_date !== event.date && (
                                  <span className="font-normal"> – {(() => {
                                    const [y, m, d] = event.end_date.split('-').map(Number);
                                    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                  })()}</span>
                                )}
                              </span>
                              <span className="text-sm text-gray-500">{formatEventTimeRange(event)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className={`font-medium ${isPast ? 'text-gray-500' : 'text-[#181411] dark:text-white'}`}>{event.title}</span>
                              <span className="text-xs text-gray-500 max-w-xs truncate">{event.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{event.location}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${getCategoryColor(event.category)}`}>
                              {event.category || 'general'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleFeatured(event)}
                              disabled={isLoading}
                              className={`text-2xl transition-colors ${event.is_featured ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-gray-400'}`}
                              title={event.is_featured ? 'Remove from featured' : 'Mark as featured'}
                            >
                              ★
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(event)}
                                disabled={isLoading}
                                className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                disabled={isLoading}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Delete"
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
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
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
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Spring Community Fair"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. School Gymnasium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="evt_is_all_day"
                  checked={formData.is_all_day}
                  onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="evt_is_all_day" className="text-sm font-medium text-[#181411] dark:text-white">
                  All Day Event
                </label>
              </div>

              <div className={`grid grid-cols-2 gap-4 transition-opacity ${formData.is_all_day ? 'opacity-40 pointer-events-none' : ''}`}>
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
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-2">
                  Flyer (PDF, optional)
                </label>
                {formData.pdf_url ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20">
                    {formData.pdf_thumbnail_url ? (
                      <img
                        src={formData.pdf_thumbnail_url}
                        alt=""
                        className="w-16 h-20 object-cover rounded border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-20 flex items-center justify-center rounded border border-gray-200 bg-white">
                        <span className="material-symbols-outlined text-3xl text-gray-400">picture_as_pdf</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#181411] dark:text-white truncate">
                        {formData.pdf_filename || 'Flyer'}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <label className="text-xs text-primary font-bold cursor-pointer hover:underline">
                          Replace
                          <input
                            ref={pdfInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfSelect}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handlePdfRemove}
                          className="text-xs text-red-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfSelect}
                      className="hidden"
                      id="pdf-flyer-upload"
                    />
                    <label
                      htmlFor="pdf-flyer-upload"
                      className={`cursor-pointer ${pdfUploading ? 'pointer-events-none' : ''}`}
                    >
                      {pdfUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-xs text-gray-500">Uploading and rendering preview...</p>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-3xl text-gray-400">upload_file</span>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            Click to upload a flyer (PDF, max 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="fundraiser">Fundraiser</option>
                    <option value="social">Social</option>
                    <option value="community">Community</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://example.com/image.jpg"
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
                  placeholder="Details about the event..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="evt_is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="evt_is_featured" className="text-sm text-[#181411] dark:text-white">
                  Feature this event (show on homepage)
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
                  {actionLoading === -1 ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
