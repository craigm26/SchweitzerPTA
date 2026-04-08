'use client';

import { useEffect, useState } from 'react';
import { getEvents, Event } from '@/lib/api';

const sortEvents = (events: Event[]) =>
  [...events].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    if (aDate !== bDate) return aDate - bDate;
    return a.id - b.id;
  });

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = (await getEvents({ upcoming: true })) as Event[];
        setEvents(sortEvents(eventsData || []));
      } catch (error) {
        console.error('Error fetching events data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightbox(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

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

  const formatEventDate = (event: Event) => {
    const start = new Date(`${event.date}T12:00:00`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (event.end_date && event.end_date !== event.date) {
      const end = new Date(`${event.end_date}T12:00:00`).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      return `${start} - ${end}`;
    }

    return start;
  };

  const formatEventTimeRange = (event: Event) => {
    if (event.is_all_day || !event.time) return 'All Day';
    const tzLabel = getPacificTimeZoneLabel(event.date);
    const start = formatTime12Hour(event.time);
    if (event.end_time) {
      const end = formatTime12Hour(event.end_time);
      return `${start} - ${end} ${tzLabel}`;
    }
    return `${start} ${tzLabel}`;
  };

  if (loading) {
    return (
      <main className="layout-container flex h-full grow flex-col pb-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-overlay bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ')]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Upcoming Events
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Stay connected with upcoming PTA meetings, school celebrations, volunteer opportunities, and community events.
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-20 py-10 flex justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#2a221a] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">event_busy</span>
              <p className="text-gray-500">No upcoming events right now.</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
                  {event.image ? (
                    <button
                      type="button"
                      onClick={() => setLightbox({ src: event.image as string, alt: event.title })}
                      className="relative h-56 md:h-full w-full bg-gray-100 dark:bg-[#1f1a14] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`View full image for ${event.title}`}
                      title="View full image"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
                    </button>
                  ) : (
                    <div className="relative h-56 md:h-full bg-gray-100 dark:bg-[#1f1a14] flex items-center justify-center text-sm text-gray-400">
                      No photo available
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-bold text-[#181411] dark:text-white">
                        {event.title}
                      </h3>
                      {event.is_featured && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-md uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        <span>{formatEventDate(event)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        <span>{formatEventTimeRange(event)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span>{event.location}</span>
                      </div>
                      {event.category && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">label</span>
                          <span className="capitalize">{event.category}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100"
              aria-label="Close image"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </main>
  );
}