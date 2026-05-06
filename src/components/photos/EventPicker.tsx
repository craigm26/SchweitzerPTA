'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PhotoEventRefValue, PhotoEventSource } from '@/lib/api';

// A combined option for the picker. The admin photos page assembles these
// from both events (special PDF events) and calendar_events (school
// calendar) so a single dropdown covers either source.
export type EventPickerOption = {
  source: PhotoEventSource;
  id: number;
  title: string;
  date: string | null;
  location?: string | null;
  category?: string | null;
};

type Props = {
  options: EventPickerOption[];
  value: PhotoEventRefValue | null;
  onChange: (value: PhotoEventRefValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function formatEventDate(d: string | null | undefined): string {
  if (!d) return '';
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function sourceLabel(source: PhotoEventSource): string {
  return source === 'calendar_events' ? 'Calendar' : 'Event';
}

function optionKey(o: { source: PhotoEventSource; id: number }): string {
  return `${o.source}:${o.id}`;
}

export default function EventPicker({
  options,
  value,
  onChange,
  placeholder = 'Search events…',
  disabled = false,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = useMemo(() => {
    if (!value) return null;
    return options.find((o) => o.source === value.source && o.id === value.id) || null;
  }, [options, value]);

  // Sort by date desc so most-recent shows first; nulls drop to the end.
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedOptions.slice(0, 50);
    return sortedOptions
      .filter((o) => {
        const hay = `${o.title} ${o.location || ''} ${o.category || ''} ${o.date || ''} ${sourceLabel(o.source)}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 50);
  }, [sortedOptions, query]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const safeHighlight = filtered.length === 0 ? 0 : Math.min(highlight, filtered.length - 1);

  function handleSelect(opt: EventPickerOption) {
    onChange({ source: opt.source, id: opt.id });
    setQuery('');
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setQuery('');
    inputRef.current?.focus();
    setOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight(Math.min(filtered.length - 1, safeHighlight + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(Math.max(0, safeHighlight - 1));
    } else if (e.key === 'Enter') {
      if (open && filtered[safeHighlight]) {
        e.preventDefault();
        handleSelect(filtered[safeHighlight]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    } else if (e.key === 'Backspace' && !query && selected) {
      e.preventDefault();
      handleClear();
    }
  }

  const displayValue = open ? query : selected ? `${selected.title}` : query;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div
        className={`flex items-center h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-2 focus-within:ring-2 focus-within:ring-primary ${
          disabled ? 'opacity-60' : ''
        }`}
      >
        <span className="material-symbols-outlined text-base text-gray-400 dark:text-white/40 mr-1">
          search
        </span>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected ? '' : placeholder}
          className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
        />
        {selected && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-1 p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white"
            title="Clear event"
            aria-label="Clear event"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>

      {open && !disabled && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] shadow-lg"
          role="listbox"
        >
          <li>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className="w-full text-left px-3 py-2 text-sm text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/10"
            >
              — No event —
            </button>
          </li>
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-gray-500 dark:text-white/50">
              No events match &ldquo;{query}&rdquo;.
            </li>
          ) : (
            filtered.map((opt, i) => (
              <li key={optionKey(opt)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === safeHighlight}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2 text-sm flex flex-col gap-0.5 ${
                    i === safeHighlight
                      ? 'bg-primary/10 text-gray-900 dark:text-white'
                      : 'text-gray-800 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium truncate flex items-center gap-2">
                    {opt.title}
                    <span
                      className={`text-[10px] uppercase tracking-wide font-medium px-1.5 py-0.5 rounded ${
                        opt.source === 'calendar_events'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                      }`}
                    >
                      {sourceLabel(opt.source)}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500 dark:text-white/50">
                    {formatEventDate(opt.date)}
                    {opt.location ? ` · ${opt.location}` : ''}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
