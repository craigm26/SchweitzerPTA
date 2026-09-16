'use client';

import { useEffect, useMemo, useState } from 'react';
import { getVolunteerEvents, signUpForVolunteerShift, VolunteerEvent, VolunteerShift } from '@/lib/api';
import { linkify } from '@/lib/linkify';

type SignupState = {
  name: string;
  email: string;
  loading: boolean;
  error: string | null;
};

type SignupSuccessPayload = {
  success: boolean;
  shift_id: number;
  spots_filled: number;
  emailSent?: boolean;
  eventTitle?: string | null;
  shiftTitle?: string | null;
  shiftTimeLabel?: string | null;
};

type ShiftEntry = {
  shift: VolunteerShift;
  eventTitle: string;
  roleName: string;
  audience: 'adult' | 'student' | 'other';
  audienceLabel: string | null;
  dateLabel: string | null;
  dateIso: string;
  timeLabel: string | null;
  timeSort: number;
};

type SuccessModalState = {
  volunteerName: string;
  volunteerEmail: string;
  eventTitle: string;
  shiftTitle: string;
  shiftTimeLabel: string;
  emailSent: boolean;
};

function parseTimeParts(time: string | null): { hour: number; minute: number } | null {
  if (!time) return null;
  const match = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return { hour, minute };
}

function formatTimeLabel(time: string | null): string | null {
  const parts = parseTimeParts(time);
  if (!parts) return null;
  const period = parts.hour >= 12 ? 'PM' : 'AM';
  const hour12 = parts.hour % 12 || 12;
  return `${hour12}:${parts.minute.toString().padStart(2, '0')} ${period}`;
}

// This job role always shows first in the shift list, whatever sort is chosen.
const PINNED_ROLE = 'spooky walk set-up';

// This job role always shows last in the shift list, whatever sort is chosen.
const LAST_ROLE = 'fall festival general clean up';

// This job role sits one spot higher than the usual sort would put it.
const MOVE_UP_ONE_ROLE = 'fall festival set up';

// This job role always shows second-to-last, just above the last section.
const SECOND_TO_LAST_ROLE = 'spooky walk clean up';

// This job role always sits right after the Game Station section.
const GAME_STATION_ROLE = 'game station';
const AFTER_GAME_STATION_ROLE = 'spooky walk guide';

// This job role always sits right after the Popcorn Station section.
const POPCORN_STATION_ROLE = 'popcorn station';
const AFTER_POPCORN_STATION_ROLE = 'cotton candy station';

function normalizeRole(roleName: string): string {
  return roleName.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
}

// Friendlier headings for certain job roles.
const ROLE_HEADINGS: Record<string, string> = {};

function roleHeading(roleName: string): string {
  return ROLE_HEADINGS[roleName.trim().toLowerCase()] ?? roleName;
}

// Short descriptions shown under certain job role headings.
const ROLE_DESCRIPTIONS: Record<string, string> = {
  'spooky walk guide': 'Lead groups through the Spooky Walk',
  'spooky walk set up': 'Meet in the Schweitzer Grove',
  'popcorn station': 'Hand out bags of pre-packaged popcorn',
  'cotton candy station': 'Hand out bags of pre-packaged cotton candy',
};

function roleDescription(roleName: string): string | undefined {
  return ROLE_DESCRIPTIONS[normalizeRole(roleName)];
}

// Some shift titles have extra wording after the job role, which would split them
// into a separate section. Anything starting with one of these goes in one section.
const MERGED_ROLE_PREFIXES = ['popcorn station'];

function canonicalRole(roleName: string): string {
  const trimmed = roleName.trim();
  const prefix = MERGED_ROLE_PREFIXES.find((p) => trimmed.toLowerCase().startsWith(p));
  return prefix ? trimmed.slice(0, prefix.length) : roleName;
}

const MONTH_PREFIXES = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

// Shift titles are often written as "October 16 - Entrance Table (5:30pm - 6:45pm) [Adult Volunteer]".
// Pull those pieces apart so the page can group by job role and offer filters.
function parseShiftTitle(title: string) {
  let rest = (title || '').trim();

  let audienceLabel: string | null = null;
  const audienceMatch = rest.match(/\[([^\]]+)\]\s*$/);
  if (audienceMatch) {
    audienceLabel = audienceMatch[1].trim();
    rest = rest.slice(0, audienceMatch.index).trim();
  }

  let timeText: string | null = null;
  const timeMatch = rest.match(/\(([^()]*)\)\s*$/);
  if (timeMatch) {
    timeText = timeMatch[1].trim();
    rest = rest.slice(0, timeMatch.index).trim();
  }

  let dateText: string | null = null;
  const dateMatch = rest.match(
    /^((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:,\s*\d{4})?)\s*[-–—]\s*(.+)$/i
  );
  if (dateMatch) {
    dateText = dateMatch[1].trim();
    rest = dateMatch[2].trim();
  }

  return {
    roleName: rest || (title || '').trim() || 'Volunteer shift',
    audienceLabel,
    timeText,
    dateText,
  };
}

function audienceCategory(label: string | null): 'adult' | 'student' | 'other' {
  if (!label) return 'other';
  if (/student|kid|child/i.test(label)) return 'student';
  if (/adult|parent|grown/i.test(label)) return 'adult';
  return 'other';
}

function isoFromDateText(dateText: string | null, fallbackIso: string): string {
  if (!dateText) return fallbackIso;
  const match = dateText.match(/^([a-z]+)\.?\s+(\d{1,2})(?:,\s*(\d{4}))?$/i);
  if (!match) return fallbackIso;
  const monthIdx = MONTH_PREFIXES.indexOf(match[1].slice(0, 3).toLowerCase());
  if (monthIdx < 0) return fallbackIso;
  const year = match[3] ? Number(match[3]) : Number((fallbackIso || '').slice(0, 4));
  if (!Number.isFinite(year)) return fallbackIso;
  return `${year}-${String(monthIdx + 1).padStart(2, '0')}-${match[2].padStart(2, '0')}`;
}

function minutesFromTime(time: string | null): number | null {
  const parts = parseTimeParts(time);
  if (!parts) return null;
  return parts.hour * 60 + parts.minute;
}

function minutesFromTimeText(timeText: string | null): number | null {
  if (!timeText) return null;
  const match = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const period = match[3]?.toLowerCase();
  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function formatEventDate(date: string): string {
  const [y, m, d] = (date || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function eventDateLabel(event: VolunteerEvent): string | null {
  if (!event.volunteer_hide_date) {
    const formatted = formatEventDate(event.date);
    if (formatted) return formatted;
  }

  const shiftDates = Array.from(
    new Set(
      (event.shifts || [])
        .map((shift) => parseShiftTitle(shift.job_title).dateText)
        .filter((text): text is string => Boolean(text))
    )
  ).sort((a, b) => isoFromDateText(a, event.date).localeCompare(isoFromDateText(b, event.date)));

  if (shiftDates.length === 1) return shiftDates[0];
  if (shiftDates.length > 1) return `${shiftDates[0]} - ${shiftDates[shiftDates.length - 1]}`;

  return formatEventDate(event.date) || null;
}

function renderEventDescription(description: string | null | undefined) {
  if (!description) return null;
  const paragraphs = description.replace(/\r\n/g, '\n').split(/\n\s*\n/);
  const labelLine = /^([A-Z][A-Za-z ]{0,15}):\s+(.+)$/;

  return paragraphs.map((paragraph, idx) => {
    const lines = paragraph.split('\n').map((l) => l.trim()).filter(Boolean);
    const allLabelLines = lines.length > 0 && lines.every((line) => labelLine.test(line));

    if (allLabelLines) {
      return (
        <div
          key={idx}
          className="mt-3 rounded-lg border-l-4 border-primary bg-primary/5 dark:bg-primary/10 px-4 py-3"
        >
          {lines.map((line, lineIdx) => {
            const match = line.match(labelLine)!;
            return (
              <p
                key={lineIdx}
                className="text-sm text-[#181411] dark:text-gray-100"
              >
                <span className="font-bold">{match[1]}:</span>{' '}
                <span>{linkify(match[2])}</span>
              </p>
            );
          })}
        </div>
      );
    }

    return (
      <p
        key={idx}
        className="text-[#181411]/80 dark:text-gray-300 text-base leading-relaxed mt-3 whitespace-pre-line"
      >
        {linkify(paragraph)}
      </p>
    );
  });
}

function ShiftSignup({
  shift,
  eventTitle,
  onSignedUp,
}: {
  shift: VolunteerShift;
  eventTitle: string;
  onSignedUp: (payload: SuccessModalState & { shiftId: number }) => void;
}) {
  const [state, setState] = useState<SignupState>({
    name: '',
    email: '',
    loading: false,
    error: null,
  });

  const isFull = shift.spots_filled >= shift.spots_available;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull || state.loading) return;

    if (!state.name.trim() || !state.email.trim()) {
      setState((prev) => ({ ...prev, error: 'Name and email are required.' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = (await signUpForVolunteerShift({
        shift_id: shift.id,
        name: state.name.trim(),
        email: state.email.trim(),
      })) as SignupSuccessPayload;
      onSignedUp({
        shiftId: shift.id,
        volunteerName: state.name.trim(),
        volunteerEmail: state.email.trim(),
        eventTitle: result.eventTitle || eventTitle,
        shiftTitle: result.shiftTitle || shift.job_title,
        shiftTimeLabel: result.shiftTimeLabel || 'Time flexible',
        emailSent: result.emailSent === true,
      });
      setState({ name: '', email: '', loading: false, error: null });
    } catch (error) {
      console.error('Error signing up:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Signup failed. Please try again.';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
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
          onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
          disabled={isFull}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-sm text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          type="email"
          placeholder="Email"
          value={state.email}
          onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
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
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}

export default function VolunteerPage() {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState<SuccessModalState | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'role' | 'date' | 'time'>('role');

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

  const entries = useMemo<ShiftEntry[]>(() => {
    const list: ShiftEntry[] = [];
    events.forEach((event) => {
      event.shifts.forEach((shift) => {
        const parsed = parseShiftTitle(shift.job_title);
        const formattedShiftStart = formatTimeLabel(shift.start_time);
        const formattedShiftEnd = formatTimeLabel(shift.end_time);
        const timeLabel =
          shift.start_time || shift.end_time
            ? `${formattedShiftStart || 'Time TBD'}${formattedShiftEnd ? ` - ${formattedShiftEnd}` : ''}`
            : parsed.timeText;
        const dateLabel = parsed.dateText
          ? parsed.dateText
          : event.volunteer_hide_date
            ? null
            : formatEventDate(event.date) || null;

        list.push({
          shift,
          eventTitle: event.title,
          roleName: canonicalRole(parsed.roleName),
          audience: audienceCategory(parsed.audienceLabel),
          audienceLabel: parsed.audienceLabel,
          dateLabel,
          dateIso: isoFromDateText(parsed.dateText, event.date),
          timeLabel,
          timeSort:
            minutesFromTime(shift.start_time) ??
            minutesFromTimeText(parsed.timeText) ??
            Number.MAX_SAFE_INTEGER,
        });
      });
    });
    return list;
  }, [events]);

  const roleOptions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.roleName))).sort((a, b) => a.localeCompare(b)),
    [entries]
  );

  const dateOptions = useMemo(() => {
    const byLabel = new Map<string, string>();
    entries.forEach((e) => {
      if (e.dateLabel && !byLabel.has(e.dateLabel)) byLabel.set(e.dateLabel, e.dateIso);
    });
    return Array.from(byLabel.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([label]) => label);
  }, [entries]);

  const hasOtherAudience = useMemo(() => entries.some((e) => e.audience === 'other'), [entries]);

  const groups = useMemo(() => {
    const matching = entries.filter(
      (e) =>
        (roleFilter === 'all' || e.roleName === roleFilter) &&
        (dateFilter === 'all' || e.dateLabel === dateFilter) &&
        (audienceFilter === 'all' || e.audience === audienceFilter)
    );

    const byRole = new Map<string, ShiftEntry[]>();
    matching.forEach((entry) => {
      const bucket = byRole.get(entry.roleName);
      if (bucket) bucket.push(entry);
      else byRole.set(entry.roleName, [entry]);
    });

    const list = Array.from(byRole.entries()).map(([roleName, groupEntries]) => {
      const sorted = [...groupEntries].sort(
        (a, b) => a.dateIso.localeCompare(b.dateIso) || a.timeSort - b.timeSort
      );
      return {
        roleName,
        entries: sorted,
        earliestDate: sorted[0]?.dateIso ?? '',
        earliestTime: Math.min(...sorted.map((e) => e.timeSort)),
      };
    });

    list.sort((a, b) => {
      // Keep the Spooky Walk Set-Up group pinned to the top of the page.
      const aPinned = a.roleName.trim().toLowerCase() === PINNED_ROLE;
      const bPinned = b.roleName.trim().toLowerCase() === PINNED_ROLE;
      if (aPinned !== bPinned) return aPinned ? -1 : 1;

      // Keep the Fall Festival General Clean Up group pinned to the bottom of the page.
      const aLast = a.roleName.trim().toLowerCase() === LAST_ROLE;
      const bLast = b.roleName.trim().toLowerCase() === LAST_ROLE;
      if (aLast !== bLast) return aLast ? 1 : -1;

      // Keep the Spooky Walk Clean Up group just above that last group.
      const aSecondLast = normalizeRole(a.roleName) === SECOND_TO_LAST_ROLE;
      const bSecondLast = normalizeRole(b.roleName) === SECOND_TO_LAST_ROLE;
      if (aSecondLast !== bSecondLast) return aSecondLast ? 1 : -1;

      if (sortBy === 'date') {
        return a.earliestDate.localeCompare(b.earliestDate) || a.roleName.localeCompare(b.roleName);
      }
      if (sortBy === 'time') {
        return a.earliestTime - b.earliestTime || a.roleName.localeCompare(b.roleName);
      }
      return a.roleName.localeCompare(b.roleName);
    });

    // Slide the Fall Festival Set Up group up one spot (but never above the pinned group).
    const moveUpIdx = list.findIndex((g) => normalizeRole(g.roleName) === MOVE_UP_ONE_ROLE);
    if (moveUpIdx > 0 && list[moveUpIdx - 1].roleName.trim().toLowerCase() !== PINNED_ROLE) {
      const above = list[moveUpIdx - 1];
      list[moveUpIdx - 1] = list[moveUpIdx];
      list[moveUpIdx] = above;
    }

    // Slide the Spooky Walk Guide group so it sits right after the Game Station group.
    const guideIdx = list.findIndex((g) => normalizeRole(g.roleName).startsWith(AFTER_GAME_STATION_ROLE));
    const gameStationIdx = list.findIndex((g) => normalizeRole(g.roleName).startsWith(GAME_STATION_ROLE));
    if (guideIdx >= 0 && gameStationIdx >= 0 && guideIdx !== gameStationIdx + 1) {
      const [guide] = list.splice(guideIdx, 1);
      const target = list.findIndex((g) => normalizeRole(g.roleName).startsWith(GAME_STATION_ROLE));
      list.splice(target + 1, 0, guide);
    }

    // Slide the Cotton Candy Station group so it sits right after the Popcorn Station group.
    const cottonCandyIdx = list.findIndex((g) =>
      normalizeRole(g.roleName).startsWith(AFTER_POPCORN_STATION_ROLE)
    );
    const popcornIdx = list.findIndex((g) => normalizeRole(g.roleName).startsWith(POPCORN_STATION_ROLE));
    if (cottonCandyIdx >= 0 && popcornIdx >= 0 && cottonCandyIdx !== popcornIdx + 1) {
      const [cottonCandy] = list.splice(cottonCandyIdx, 1);
      const target = list.findIndex((g) => normalizeRole(g.roleName).startsWith(POPCORN_STATION_ROLE));
      list.splice(target + 1, 0, cottonCandy);
    }

    return list;
  }, [entries, roleFilter, dateFilter, audienceFilter, sortBy]);

  const shownCount = groups.reduce((total, group) => total + group.entries.length, 0);
  const selectClass =
    'px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-sm font-normal normal-case tracking-normal text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50';

  const handleSignedUp = (payload: SuccessModalState & { shiftId: number }) => {
    setEvents((prev) =>
      prev.map((event) => ({
        ...event,
        shifts: event.shifts.map((shift) =>
          shift.id === payload.shiftId ? { ...shift, spots_filled: shift.spots_filled + 1 } : shift
        ),
      }))
    );
    setSuccessModal({
      volunteerName: payload.volunteerName,
      volunteerEmail: payload.volunteerEmail,
      eventTitle: payload.eventTitle,
      shiftTitle: payload.shiftTitle,
      shiftTimeLabel: payload.shiftTimeLabel,
      emailSent: payload.emailSent,
    });
  };

  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
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
            <>
              <div className="flex flex-col gap-1">
                {events.map((event) => {
                  const eventDate = eventDateLabel(event);
                  return (
                    <div key={event.id} className="flex flex-wrap items-baseline gap-x-3">
                      <h2 className="text-[#181411] dark:text-white text-2xl font-bold">
                        {event.title}
                      </h2>
                      {eventDate && (
                        <span className="text-base font-bold text-primary">{eventDate}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Job role
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">All job roles</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Date
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">All dates</option>
                      {dateOptions.map((date) => (
                        <option key={date} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Volunteer type
                    <select
                      value={audienceFilter}
                      onChange={(e) => setAudienceFilter(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">Adult &amp; student</option>
                      <option value="adult">Adult volunteers</option>
                      <option value="student">Student volunteers</option>
                      {hasOtherAudience && <option value="other">Not specified</option>}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Sort by
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'role' | 'date' | 'time')}
                      className={selectClass}
                    >
                      <option value="role">Job role name (A–Z)</option>
                      <option value="date">Date (soonest first)</option>
                      <option value="time">Start time (earliest first)</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {shownCount} of {entries.length} shifts
                  </p>
                  {(roleFilter !== 'all' || dateFilter !== 'all' || audienceFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoleFilter('all');
                        setDateFilter('all');
                        setAudienceFilter('all');
                      }}
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {groups.length === 0 ? (
                <div className="bg-white dark:bg-[#2a221a] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                  <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-2">
                    No shifts match those choices
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try a different date, volunteer type, or job role.
                  </p>
                </div>
              ) : (
                groups.map((group) => (
                  <section
                    key={group.roleName}
                    className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-[#181411] dark:text-white text-xl font-bold">
                        {roleHeading(group.roleName)}
                      </h3>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                        {group.entries.length} {group.entries.length === 1 ? 'shift' : 'shifts'}
                      </span>
                    </div>

                    {roleDescription(group.roleName) && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {roleDescription(group.roleName)}
                      </p>
                    )}

                    <div className="flex flex-col gap-4 mt-4">
                      {group.entries.map((entry) => (
                        <div
                          key={entry.shift.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3"
                        >
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="text-[#181411] dark:text-white font-bold">
                                {entry.timeLabel || group.roleName}
                              </h4>
                              <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">
                                {entry.shift.spots_filled}/{entry.shift.spots_available} spots filled
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {entry.audienceLabel && (
                                <span
                                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    entry.audience === 'student'
                                      ? 'bg-blue-100 text-blue-700'
                                      : entry.audience === 'adult'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {entry.audienceLabel}
                                </span>
                              )}
                            </div>
                            {entry.shift.shift_description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {entry.shift.shift_description}
                              </p>
                            )}
                          </div>
                          <ShiftSignup
                            shift={entry.shift}
                            eventTitle={entry.eventTitle}
                            onSignedUp={handleSignedUp}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#2a221a]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#181411] dark:text-white">Thanks for volunteering!</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  We received your signup for <span className="font-semibold">{successModal.eventTitle}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessModal(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#181411]"
                aria-label="Close acknowledgement"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-[#181411] dark:text-gray-200">
              <p><span className="font-semibold">Volunteer:</span> {successModal.volunteerName}</p>
              <p><span className="font-semibold">Email:</span> {successModal.volunteerEmail}</p>
              <p><span className="font-semibold">Shift:</span> {successModal.shiftTitle}</p>
              <p><span className="font-semibold">Time:</span> {successModal.shiftTimeLabel}</p>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {successModal.emailSent
                ? 'A confirmation email is on its way, and the PTA inbox was copied.'
                : 'Your signup was saved, but the confirmation email could not be sent. The PTA still received your response.'}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSuccessModal(null)}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
