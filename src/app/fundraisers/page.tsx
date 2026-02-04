'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvents, Event } from '@/lib/api';

const FUNDRAISER_CATEGORY = 'fundraiser';

const normalizeCategory = (category?: string | null) => (category || '').trim().toLowerCase();

export default function FundraisersPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = (await getEvents({ upcoming: true })) as Event[];
        const fundraiserEvents = (eventsData || []).filter(
          (event: Event) => normalizeCategory(event.category) === FUNDRAISER_CATEGORY
        );
        setEvents(fundraiserEvents);
      } catch (error) {
        console.error('Error fetching fundraiser data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getDateParts = (dateString: string) => {
    // Parse date string directly to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: day.toString().padStart(2, '0'),
    };
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { day: number | ''; events: boolean; highlight: boolean }[] = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', events: false, highlight: false });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvent = events.some((e) => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      days.push({ day, events: hasEvent, highlight: isToday });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) {
    return (
      <main className="layout-container flex h-full grow flex-col pb-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading fundraisers...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-overlay bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ')]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              {/* this should be the current school year 2025-2026 */}
              <span className="material-symbols-outlined text-sm">event</span> School Year 2025-2026
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Fundraisers
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Support our Wildcats through upcoming fundraising events that benefit our school community.
            </h2>
            <div className="mt-4 flex gap-3">
              <Link
                href="/calendar"
                className="flex items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-orange-600 text-white text-base font-bold transition-all shadow-lg shadow-orange-900/50"
              >
                <span className="mr-2 material-symbols-outlined text-[20px]">calendar_add_on</span>
                Subscribe to Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] w-full">
          {/* Main content area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap gap-3 items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-[#181411] dark:text-white hidden md:block">
                {formatMonthYear(currentMonth)}
              </h3>
            </div>

            {/* Calendar and Events Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Calendar Widget */}
              <div className="xl:col-span-2 bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <span className="material-symbols-outlined text-gray-500">chevron_left</span>
                  </button>
                  <span className="font-bold text-[#181411] dark:text-white">{formatMonthYear(currentMonth)}</span>
                  <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="py-2 text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((d, i) => (
                    <div
                      key={i}
                      className={`py-2 rounded-full relative cursor-pointer transition-colors ${
                        d.highlight
                          ? 'bg-primary text-white font-bold'
                          : d.events
                            ? 'text-primary font-bold hover:bg-primary/10'
                            : d.day
                              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#181411] dark:text-white'
                              : ''
                      }`}
                    >
                      {d.day}
                      {d.events && !d.highlight && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                    <div>
                      <p className="font-medium text-[#181411] dark:text-white">Did you know?</p>
                      <p className="text-xs mt-1">
                        You can sync these events directly to your phone calendar by clicking &quot;Subscribe&quot;.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Cards */}
              <div className="xl:col-span-3 flex flex-col gap-4">
                {events.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-[#2a221a] rounded-xl">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">event_busy</span>
                    <p className="text-gray-500">No fundraisers found.</p>
                  </div>
                ) : (
                  events.map((event) => {
                    const { month, day } = getDateParts(event.date);
                    return (
                      <div
                        key={event.id}
                        className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4"
                      >
                        {/* Date Block */}
                        <div className="flex flex-col items-center justify-center w-16 shrink-0">
                          <span className="text-primary text-xs font-bold uppercase">{month}</span>
                          <span className="text-[#181411] dark:text-white text-2xl font-bold">{day}</span>
                        </div>
                        {/* Event Details */}
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-[#181411] dark:text-white font-bold text-lg">{event.title}</h4>
                            {event.is_featured && (
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-md uppercase">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              {event.time}
                              {event.end_time && ` - ${event.end_time}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">location_on</span> {event.location}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{event.description}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </main>
  );
}
