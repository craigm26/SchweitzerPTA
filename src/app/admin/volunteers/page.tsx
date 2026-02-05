'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  createVolunteerSignup,
  createVolunteerShift,
  deleteVolunteerSignup,
  deleteVolunteerShift,
  getVolunteerEvents,
  updateVolunteerSignup,
  updateEvent,
  updateVolunteerShift,
  VolunteerEvent,
  VolunteerShift,
} from '@/lib/api';

type ShiftFormState = {
  event_id: number;
  job_title: string;
  shift_description: string;
  start_time: string;
  end_time: string;
  spots_available: number;
  is_active: boolean;
};

export default function VolunteerManagementPage() {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [signupStatusFilter, setSignupStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [signupForms, setSignupForms] = useState<
    Record<number, { name: string; email: string; allowOverbook: boolean; loading: boolean; error: string | null }>
  >({});
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState<VolunteerShift | null>(null);
  const [formData, setFormData] = useState<ShiftFormState>({
    event_id: 0,
    job_title: '',
    shift_description: '',
    start_time: '',
    end_time: '',
    spots_available: 1,
    is_active: true,
  });

  useEffect(() => {
    fetchVolunteerEvents();
  }, []);

  async function fetchVolunteerEvents() {
    try {
      const data = await getVolunteerEvents({
        includeInactive: true,
        includeInactiveShifts: true,
        includeSignups: true,
        upcoming: true,
      });
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching volunteer events:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatEventDate = (date: string) => {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleToggleEventActive = async (event: VolunteerEvent) => {
    const loadingKey = `event-${event.id}`;
    setActionLoading(loadingKey);
    try {
      await updateEvent(event.id, { volunteer_active: !event.volunteer_active });
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id ? { ...item, volunteer_active: !item.volunteer_active } : item
        )
      );
    } catch (error) {
      console.error('Error updating event visibility:', error);
      alert('Failed to update event visibility');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleShiftActive = async (shift: VolunteerShift) => {
    const loadingKey = `shift-${shift.id}`;
    setActionLoading(loadingKey);
    try {
      const updated = await updateVolunteerShift(shift.id, { is_active: !shift.is_active });
      setEvents((prev) =>
        prev.map((event) =>
          event.id === updated.event_id
            ? {
                ...event,
                shifts: event.shifts.map((item) => (item.id === updated.id ? updated : item)),
              }
            : event
        )
      );
    } catch (error) {
      console.error('Error updating shift:', error);
      alert('Failed to update shift');
    } finally {
      setActionLoading(null);
    }
  };

  const openAddShiftModal = (eventId?: number) => {
    setEditingShift(null);
    setFormData({
      event_id: eventId || events[0]?.id || 0,
      job_title: '',
      shift_description: '',
      start_time: '',
      end_time: '',
      spots_available: 1,
      is_active: true,
    });
    setShowShiftModal(true);
  };

  const openEditShiftModal = (shift: VolunteerShift) => {
    setEditingShift(shift);
    setFormData({
      event_id: shift.event_id,
      job_title: shift.job_title,
      shift_description: shift.shift_description || '',
      start_time: shift.start_time || '',
      end_time: shift.end_time || '',
      spots_available: shift.spots_available,
      is_active: shift.is_active,
    });
    setShowShiftModal(true);
  };

  const closeShiftModal = () => {
    setShowShiftModal(false);
    setEditingShift(null);
  };

  const handleShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event_id) {
      alert('Please select an event');
      return;
    }

    setActionLoading('shift-save');
    const payload = {
      event_id: formData.event_id,
      job_title: formData.job_title,
      shift_description: formData.shift_description || null,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      spots_available: Number(formData.spots_available),
      is_active: formData.is_active,
    };

    try {
      if (editingShift) {
        const updated = await updateVolunteerShift(editingShift.id, payload);
        setEvents((prev) =>
          prev.map((event) =>
            event.id === updated.event_id
              ? {
                  ...event,
                  shifts: event.shifts.map((item) => (item.id === updated.id ? updated : item)),
                }
              : event
          )
        );
      } else {
        const created = await createVolunteerShift(payload);
        setEvents((prev) =>
          prev.map((event) =>
            event.id === created.event_id ? { ...event, shifts: [...event.shifts, created] } : event
          )
        );
      }
      closeShiftModal();
    } catch (error) {
      console.error('Error saving shift:', error);
      alert('Failed to save shift');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteShift = async (shift: VolunteerShift) => {
    if (!confirm('Are you sure you want to delete this shift?')) return;

    const loadingKey = `shift-${shift.id}`;
    setActionLoading(loadingKey);
    try {
      await deleteVolunteerShift(shift.id);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === shift.event_id
            ? { ...event, shifts: event.shifts.filter((item) => item.id !== shift.id) }
            : event
        )
      );
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('Failed to delete shift');
    } finally {
      setActionLoading(null);
    }
  };

  const getSignupForm = (shiftId: number) =>
    signupForms[shiftId] || { name: '', email: '', allowOverbook: false, loading: false, error: null };

  const handleSignupFieldChange = (shiftId: number, field: 'name' | 'email', value: string) => {
    const current = getSignupForm(shiftId);
    setSignupForms((prev) => ({
      ...prev,
      [shiftId]: { ...current, [field]: value, error: null },
    }));
  };

  const handleSignupOverbookChange = (shiftId: number, value: boolean) => {
    const current = getSignupForm(shiftId);
    setSignupForms((prev) => ({
      ...prev,
      [shiftId]: { ...current, allowOverbook: value, error: null },
    }));
  };

  const handleAddSignup = async (shiftId: number) => {
    const current = getSignupForm(shiftId);
    if (!current.name.trim() || !current.email.trim()) {
      setSignupForms((prev) => ({
        ...prev,
        [shiftId]: { ...current, error: 'Name and email are required.' },
      }));
      return;
    }

    setSignupForms((prev) => ({
      ...prev,
      [shiftId]: { ...current, loading: true, error: null },
    }));

    try {
      const result = await createVolunteerSignup({
        shift_id: shiftId,
        name: current.name.trim(),
        email: current.email.trim(),
        allow_overbook: current.allowOverbook,
      });

      setEvents((prev) =>
        prev.map((event) => ({
          ...event,
          shifts: event.shifts.map((shift) =>
            shift.id === shiftId
              ? {
                  ...shift,
                  spots_filled: result.spots_filled ?? shift.spots_filled,
                  signups: [...(shift.signups || []), result.signup],
                }
              : shift
          ),
        }))
      );

      setSignupForms((prev) => ({
        ...prev,
        [shiftId]: { name: '', email: '', allowOverbook: false, loading: false, error: null },
      }));
    } catch (error) {
      console.error('Error adding signup:', error);
      setSignupForms((prev) => ({
        ...prev,
        [shiftId]: { ...current, loading: false, error: 'Failed to add signup.' },
      }));
    }
  };

  const handleRemoveSignup = async (shiftId: number, signupId: number) => {
    if (!confirm('Remove this volunteer from the shift?')) return;

    const loadingKey = `signup-${signupId}`;
    setActionLoading(loadingKey);
    try {
      const result = await deleteVolunteerSignup(signupId);
      setEvents((prev) =>
        prev.map((event) => ({
          ...event,
          shifts: event.shifts.map((shift) =>
            shift.id === shiftId
              ? {
                  ...shift,
                  spots_filled: result.spots_filled ?? shift.spots_filled,
                  signups: (shift.signups || []).filter((signup) => signup.id !== signupId),
                }
              : shift
          ),
        }))
      );
    } catch (error) {
      console.error('Error removing signup:', error);
      alert('Failed to remove signup');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateSignupStatus = async (
    shiftId: number,
    signupId: number,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    const loadingKey = `signup-${signupId}`;
    setActionLoading(loadingKey);
    try {
      const result = await updateVolunteerSignup(signupId, { status });
      setEvents((prev) =>
        prev.map((event) => ({
          ...event,
          shifts: event.shifts.map((shift) =>
            shift.id === shiftId
              ? {
                  ...shift,
                  spots_filled: result.spots_filled ?? shift.spots_filled,
                  signups: (shift.signups || []).map((signup) =>
                    signup.id === signupId ? result.signup : signup
                  ),
                }
              : shift
          ),
        }))
      );
    } catch (error) {
      console.error('Error updating signup status:', error);
      alert('Failed to update signup status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading volunteer events...</p>
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
            <span className="font-medium text-gray-900 dark:text-white">Volunteers</span>
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Volunteer Management
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Assign volunteer shifts to events and track open spots.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Signup status</label>
                <select
                  value={signupStatusFilter}
                  onChange={(e) =>
                    setSignupStatusFilter(e.target.value as 'all' | 'pending' | 'confirmed' | 'cancelled')
                  }
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] px-3 py-2 text-sm text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={() => openAddShiftModal()}
                className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span className="material-symbols-outlined">add</span>
                Add Shift
              </button>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#2a221a] rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">volunteer_activism</span>
            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No upcoming events</h3>
            <p className="text-gray-500 mb-4">Create an event first, then add volunteer shifts.</p>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <span className="material-symbols-outlined">event</span>
              Manage Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#181411] dark:text-white">{event.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">event</span>
                          {formatEventDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {event.location}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 max-w-2xl">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleToggleEventActive(event)}
                        disabled={actionLoading === `event-${event.id}`}
                        className={`text-xs font-bold px-3 py-2 rounded-lg ${
                          event.volunteer_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {event.volunteer_active ? 'Visible to Volunteers' : 'Hidden from Volunteers'}
                      </button>
                      <button
                        onClick={() => openAddShiftModal(event.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-bold text-[#181411] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        Add Shift
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    {event.shifts.length === 0 ? (
                      <div className="text-sm text-gray-500">No volunteer shifts yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                              <th className="py-2 pr-4">Job Title</th>
                              <th className="py-2 pr-4">Time Slot</th>
                              <th className="py-2 pr-4">Spots</th>
                              <th className="py-2 pr-4">Active</th>
                              <th className="py-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.shifts.map((shift) => {
                              const timeLabel =
                                shift.start_time || shift.end_time
                                  ? `${formatTime(shift.start_time)}${shift.end_time ? ` - ${formatTime(shift.end_time)}` : ''}`
                                  : 'Time flexible';
                              const signups = shift.signups || [];
                              const signupForm = getSignupForm(shift.id);
                              const isFull = shift.spots_filled >= shift.spots_available;
                              const filteredSignups =
                                signupStatusFilter === 'all'
                                  ? signups
                                  : signups.filter(
                                      (signup) => (signup.status || 'pending') === signupStatusFilter
                                    );

                              return (
                                <Fragment key={shift.id}>
                                  <tr className="border-t border-gray-100 dark:border-gray-700">
                                    <td className="py-3 pr-4">
                                      <div className="font-medium text-[#181411] dark:text-white">{shift.job_title}</div>
                                      {shift.shift_description && (
                                        <div className="text-xs text-gray-500">{shift.shift_description}</div>
                                      )}
                                    </td>
                                    <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-300">{timeLabel}</td>
                                    <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-300">
                                      {shift.spots_filled}/{shift.spots_available}
                                    </td>
                                    <td className="py-3 pr-4">
                                      <button
                                        onClick={() => handleToggleShiftActive(shift)}
                                        disabled={actionLoading === `shift-${shift.id}`}
                                        className={`text-xs font-bold px-2 py-1 rounded ${
                                          shift.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}
                                      >
                                        {shift.is_active ? 'Active' : 'Inactive'}
                                      </button>
                                    </td>
                                    <td className="py-3">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => openEditShiftModal(shift)}
                                          className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                          title="Edit"
                                        >
                                          <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteShift(shift)}
                                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                          title="Delete"
                                        >
                                          <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <td colSpan={5} className="pb-4 pr-4 text-xs text-gray-500">
                                      <span className="font-semibold text-gray-600 dark:text-gray-300">Signups:</span>{' '}
                                      {signups.length === 0 ? (
                                        <span>No signups yet.</span>
                                      ) : filteredSignups.length === 0 ? (
                                        <span>No signups match the current filter.</span>
                                      ) : (
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                          {filteredSignups.map((signup) => (
                                            <div
                                              key={signup.id}
                                              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#181411] px-3 py-2"
                                            >
                                              <div className="flex items-start justify-between gap-2">
                                                <div>
                                                  <div className="font-medium text-[#181411] dark:text-white">
                                                    {signup.name}
                                                  </div>
                                                  <div className="text-xs text-gray-500">{signup.email}</div>
                                                </div>
                                                <button
                                                  onClick={() => handleRemoveSignup(shift.id, signup.id)}
                                                  disabled={actionLoading === `signup-${signup.id}`}
                                                  className="text-xs font-semibold text-red-500 hover:text-red-600"
                                                  title="Remove signup"
                                                >
                                                  Remove
                                                </button>
                                              </div>
                                              <div className="mt-2 flex items-center gap-2">
                                                <label className="text-[11px] font-semibold text-gray-500">Status</label>
                                                <select
                                                  value={signup.status || 'pending'}
                                                  onChange={(e) =>
                                                    handleUpdateSignupStatus(
                                                      shift.id,
                                                      signup.id,
                                                      e.target.value as 'pending' | 'confirmed' | 'cancelled'
                                                    )
                                                  }
                                                  disabled={actionLoading === `signup-${signup.id}`}
                                                  className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] px-2 py-1 text-[11px] text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                >
                                                  <option value="pending">Pending</option>
                                                  <option value="confirmed">Confirmed</option>
                                                  <option value="cancelled">Cancelled</option>
                                                </select>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      <div className="mt-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] p-3">
                                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                          Add volunteer manually
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                          <input
                                            type="text"
                                            placeholder="Name"
                                            value={signupForm.name}
                                            onChange={(e) => handleSignupFieldChange(shift.id, 'name', e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-xs text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                          />
                                          <input
                                            type="email"
                                            placeholder="Email"
                                            value={signupForm.email}
                                            onChange={(e) => handleSignupFieldChange(shift.id, 'email', e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-xs text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                          />
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                          <input
                                            id={`allow_overbook_${shift.id}`}
                                            type="checkbox"
                                            checked={signupForm.allowOverbook}
                                            onChange={(e) => handleSignupOverbookChange(shift.id, e.target.checked)}
                                            className="rounded border-gray-300"
                                          />
                                          <label htmlFor={`allow_overbook_${shift.id}`}>
                                            Allow overbooking
                                          </label>
                                        </div>
                                        <div className="mt-2 flex items-center gap-3">
                                          <button
                                            type="button"
                                            onClick={() => handleAddSignup(shift.id)}
                                            disabled={signupForm.loading || (isFull && !signupForm.allowOverbook)}
                                            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                                          >
                                            {isFull && !signupForm.allowOverbook
                                              ? 'Shift Full'
                                              : signupForm.loading
                                                ? 'Adding...'
                                                : 'Add Volunteer'}
                                          </button>
                                          {signupForm.error && (
                                            <span className="text-xs text-red-500">{signupForm.error}</span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#181411] dark:text-white">
                {editingShift ? 'Edit Shift' : 'Add New Shift'}
              </h3>
              <button onClick={closeShiftModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleShiftSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Event *</label>
                <select
                  required
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" disabled>
                    Select an event
                  </option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Check-in helper"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Shift Description</label>
                <textarea
                  rows={3}
                  value={formData.shift_description}
                  onChange={(e) => setFormData({ ...formData, shift_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Optional details for volunteers..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-1">
                    Spots Available *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.spots_available}
                    onChange={(e) => setFormData({ ...formData, spots_available: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center gap-2 mt-7">
                  <input
                    type="checkbox"
                    id="shift_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="shift_active" className="text-sm text-[#181411] dark:text-white">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeShiftModal}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-[#181411] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'shift-save'}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {actionLoading === 'shift-save' ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
