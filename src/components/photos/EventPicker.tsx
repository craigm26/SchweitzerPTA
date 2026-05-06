'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Event } from '@/lib/api';

type Props = {
  events: Event[];
  value: number | null;
  onChange: (id: number | null) => void;
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

export default function EventPicker({
  events,
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

  const selected = useMemo(
    () => (value !== null ? events.find((e) => e.id === value) || null : null),
    [events, value],
  );

  // Sort events by date desc so "most recent" shows up first when picker opens.
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedEvents.slice(0, 50);
    return sortedEvents
      .filter((e) => {
        const hay = `${e.title} ${e.location} ${e.category || ''} ${e.date || ''}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 50);
  }, [sortedEvents, query]);

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

  // Clamp highlight to current filtered length when rendering instead of storing
  // a stale out-of-range index (avoids cascading-render lint).
  const safeHighlight = filtered.length === 0 ? 0 : Math.min(highlight, filtered.length - 1);

  function handleSelect(ev: Event) {
    onChange(ev.id);
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

  // Display value: when not focused and an event is selected, show its title.
  // When focused/typing, show what the user is typing.
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
            filtered.map((ev, i) => (
              <li key={ev.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === safeHighlight}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => handleSelect(ev)}
                  className={`w-full text-left px-3 py-2 text-sm flex flex-col gap-0.5 ${
                    i === safeHighlight
                      ? 'bg-primary/10 text-gray-900 dark:text-white'
                      : 'text-gray-800 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium truncate">{ev.title}</span>
                  <span className="text-xs text-gray-500 dark:text-white/50">
                    {formatEventDate(ev.date)}
                    {ev.location ? ` · ${ev.location}` : ''}
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
