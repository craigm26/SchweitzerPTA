'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getVolunteerEvents, signUpForVolunteerShift, VolunteerEvent, VolunteerShift } from '@/lib/api';

type SignupState = {
  name: string;
  email: string;
  loading: boolean;
  error: string | null;
  success: boolean;
};

function ShiftSignup({
  shift,
  onSignedUp,
}: {
  shift: VolunteerShift;
  onSignedUp: (shiftId: number) => void;
}) {
  const [state, setState] = useState<SignupState>({
    name: '',
    email: '',
    loading: false,
    error: null,
    success: false,
  });

  const isFull = shift.spots_filled >= shift.spots_available;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull || state.loading) return;

    if (!state.name.trim() || !state.email.trim()) {
      setState((prev) => ({ ...prev, error: 'Name and email are required.', success: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null, success: false }));
    try {
      await signUpForVolunteerShift({
        shift_id: shift.id,
        name: state.name.trim(),
        email: state.email.trim(),
      });
      setState({ name: '', email: '', loading: false, error: null, success: true });
      onSignedUp(shift.id);
    } catch (error) {
      console.error('Error signing up:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Signup failed. Please try again.',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Name"
          value={state.name}
          onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value, success: false }))}
          disabled={isFull}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-sm text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          type="email"
          placeholder="Email"
          value={state.email}
          onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value, success: false }))}
          disabled={isFull}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-sm text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isFull || state.loading}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isFull ? 'Shift Full' : state.loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {state.success && <span className="text-sm text-green-600">Thanks for signing up!</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}

export default function VolunteerPage() {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const eventImageLoader = ({ src }: { src: string }) => src;

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getVolunteerEvents({ upcoming: true });
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching volunteer events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

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

  const handleSignedUp = (shiftId: number) => {
    setEvents((prev) =>
      prev.map((event) => ({
        ...event,
        shifts: event.shifts.map((shift) =>
          shift.id === shiftId ? { ...shift, spots_filled: shift.spots_filled + 1 } : shift
        ),
      }))
    );
  };

  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20"></div>
          <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Volunteer
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Help make Schweitzer Elementary the best it can be
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[1100px] w-full gap-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading volunteer opportunities...</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">volunteer_activism</span>
              <h2 className="text-[#181411] dark:text-white text-2xl font-bold mb-2">No volunteer shifts yet</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for upcoming events that need volunteers.
              </p>
            </div>
          ) : (
            events.map((event) => {
              const eventTime = event.time
                ? `${formatTime(event.time)}${event.end_time ? ` - ${formatTime(event.end_time)}` : ''}`
                : event.is_all_day
                  ? 'All day'
                  : '';

              return (
                <section
                  key={event.id}
                  className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <h2 className="text-[#181411] dark:text-white text-2xl font-bold">
                          {event.title}
                        </h2>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">event</span>
                            {formatEventDate(event.date)}
                          </span>
                          {eventTime && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              {eventTime}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {event.location}
                          </span>
                        </div>
                        <p className="text-[#181411]/80 dark:text-gray-300 text-base leading-relaxed mt-3">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        <h3 className="text-[#181411] dark:text-white text-lg font-bold">Volunteer Needs</h3>
                        {event.shifts.length === 0 ? (
                          <div className="text-sm text-gray-500">No shifts posted yet.</div>
                        ) : (
                          event.shifts.map((shift) => {
                            const timeLabel =
                              shift.start_time || shift.end_time
                                ? `${formatTime(shift.start_time)}${shift.end_time ? ` - ${formatTime(shift.end_time)}` : ''}`
                                : 'Time flexible';
                            return (
                              <div
                                key={shift.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3"
                              >
                                <div>
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h4 className="text-[#181411] dark:text-white font-bold">
                                      {shift.job_title}
                                    </h4>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">
                                      {shift.spots_filled}/{shift.spots_available} spots filled
                                    </span>
                                  </div>
                                  {shift.shift_description && (
                                    <p className="text-sm text-gray-500 mt-1">{shift.shift_description}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">Time: {timeLabel}</p>
                                </div>
                                <ShiftSignup shift={shift} onSignedUp={handleSignedUp} />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <div className="lg:w-80 shrink-0">
                      <div className="bg-gray-50 dark:bg-[#181411] rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-full flex items-center justify-center">
                        {event.image ? (
                          <Image
                            loader={eventImageLoader}
                            src={event.image}
                            alt={`${event.title} event`}
                            width={400}
                            height={260}
                            sizes="(min-width: 1024px) 320px, 100vw"
                            unoptimized
                            className="rounded-lg object-cover w-full h-full max-h-[260px]"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <span className="material-symbols-outlined text-5xl">image</span>
                            <p className="text-sm mt-2">Event photo coming soon</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
