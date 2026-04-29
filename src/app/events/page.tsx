'use client';

import { useEffect, useState } from 'react';
import { getEvents, Event } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = await getEvents({ upcoming: true });
        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error fetching events data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getDateParts = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: day.toString().padStart(2, '0'),
    };
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
    if (event.is_all_day || !event.time) {
      return 'All Day';
    }
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
      {/* Hero */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Upcoming Events
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Browse upcoming PTA meetings, school spirit days, and community fundraisers. Subscribe to get
              event updates delivered straight to your inbox.
            </h2>
            <div className="mt-4 flex gap-3">
              <button className="flex cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-orange-600 text-white text-base font-bold transition-all shadow-lg shadow-orange-900/50">
                <span className="mr-2 material-symbols-outlined text-[20px]">notifications_active</span>
                Subscribe to Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-10 flex justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#2a221a] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">event_busy</span>
              <p className="text-gray-500">No upcoming events.</p>
            </div>
          ) : (
            events.map((event) => {
              const { month, day } = getDateParts(event.date);
              const thumbnail = event.pdf_thumbnail_url || event.image;
              const hasPdf = !!event.pdf_url;

              return (
                <div
                  key={event.id}
                  className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
                    {thumbnail ? (
                      hasPdf ? (
                        <a
                          href={event.pdf_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative h-56 md:h-full w-full bg-gray-100 dark:bg-[#1f1a14] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          title="Open flyer (PDF)"
                          aria-label={`Open flyer PDF for ${event.title}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbnail}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
                        </a>
                      ) : (
                        <div className="relative h-56 md:h-full w-full bg-gray-100 dark:bg-[#1f1a14] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbnail}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )
                    ) : (
                      <div className="relative h-56 md:h-full bg-gray-100 dark:bg-[#1f1a14] flex items-center justify-center text-sm text-gray-400">
                        No flyer available
                      </div>
                    )}
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center min-w-14 px-2 py-1 rounded-md bg-primary/10">
                            <span className="text-primary text-xs font-bold uppercase">{month}</span>
                            <span className="text-[#181411] dark:text-white text-xl font-bold leading-none">
                              {day}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-[#181411] dark:text-white">
                            {event.title}
                          </h3>
                        </div>
                        {event.is_featured && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-md uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {formatEventTimeRange(event)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {event.location}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed whitespace-pre-line">
                        {event.description}
                      </p>
                      {hasPdf && (
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={event.pdf_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary font-bold hover:bg-primary/20 transition-colors"
                            title={event.pdf_filename || 'View flyer'}
                          >
                            View Flyer (PDF)
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
