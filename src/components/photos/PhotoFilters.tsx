'use client';

import { ViewMode } from './types';

type Props = {
  schoolYears: string[];
  events: { id: number; title: string }[];
  schoolYear: string;
  eventId: number | 'all' | 'none';
  view: ViewMode;
  count: number;
  onSchoolYearChange: (v: string) => void;
  onEventChange: (v: number | 'all' | 'none') => void;
  onViewChange: (v: ViewMode) => void;
};

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: string }[] = [
  { value: 'grid', label: 'Grid', icon: 'grid_view' },
  { value: 'masonry', label: 'Masonry', icon: 'view_quilt' },
  { value: 'by-event', label: 'By event', icon: 'event' },
];

export default function PhotoFilters({
  schoolYears,
  events,
  schoolYear,
  eventId,
  view,
  count,
  onSchoolYearChange,
  onEventChange,
  onViewChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-gray-500 dark:text-white/60 font-medium uppercase tracking-wide">School year</span>
          <select
            value={schoolYear}
            onChange={(e) => onSchoolYearChange(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All years</option>
            {schoolYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="text-gray-500 dark:text-white/60 font-medium uppercase tracking-wide">Event</span>
          <select
            value={eventId === 'all' ? 'all' : eventId === 'none' ? 'none' : String(eventId)}
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'all') onEventChange('all');
              else if (v === 'none') onEventChange('none');
              else onEventChange(Number(v));
            }}
            className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-w-[12rem]"
          >
            <option value="all">All events</option>
            <option value="none">Untagged</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </label>

        <span className="text-sm text-gray-500 dark:text-white/60 self-end mb-2">
          {count} photo{count === 1 ? '' : 's'}
        </span>
      </div>

      <div className="inline-flex rounded-lg border border-gray-200 dark:border-white/15 overflow-hidden self-start md:self-end">
        {VIEW_OPTIONS.map((opt) => {
          const active = view === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onViewChange(opt.value)}
              className={`flex items-center gap-1 px-3 h-10 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-[#2a221a] text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
              aria-pressed={active}
            >
              <span className="material-symbols-outlined text-lg">{opt.icon}</span>
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
