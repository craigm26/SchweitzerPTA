'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';

const VISITOR_KEY = 'pta_visitor_id';
const SESSION_KEY = 'pta_session_id';

function ensureId(storage: Storage, key: string): string {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const generated =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
  storage.setItem(key, generated);
  return generated;
}

export default function FirstPartyAnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const pathWithQuery = useMemo(() => pathname, [pathname]);

  useEffect(() => {
    // Respect browser do-not-track preference.
    if (navigator.doNotTrack === '1') return;

    // Avoid duplicate fire in development and hydration edge cases.
    if (!pathWithQuery || lastTrackedPath.current === pathWithQuery) return;
    lastTrackedPath.current = pathWithQuery;

    const visitorId = ensureId(localStorage, VISITOR_KEY);
    const sessionId = ensureId(sessionStorage, SESSION_KEY);

    const payload = JSON.stringify({
      path: pathWithQuery,
      referrer: document.referrer || null,
      visitorId,
      sessionId,
    });

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Silently ignore analytics write failures.
    });
  }, [pathWithQuery]);

  return null;
}
