'use client';

import { useEffect, useMemo, useState } from 'react';
import { getPhotos, getEvents, Photo, Event } from '@/lib/api';
import GalleryGrid from '@/components/photos/GalleryGrid';
import GalleryMasonry from '@/components/photos/GalleryMasonry';
import GalleryByEvent from '@/components/photos/GalleryByEvent';
import PhotoLightbox from '@/components/photos/PhotoLightbox';
import PhotoFilters from '@/components/photos/PhotoFilters';
import { ViewMode } from '@/components/photos/types';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [schoolYear, setSchoolYear] = useState<string>('all');
  const [eventId, setEventId] = useState<number | 'all' | 'none'>('all');
  const [view, setView] = useState<ViewMode>('grid');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [p, e] = await Promise.all([getPhotos({ limit: 500 }), getEvents()]);
        if (cancelled) return;
        setPhotos(p || []);
        setEvents(e || []);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load photos page:', err);
        setError('Could not load photos right now. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const schoolYears = useMemo(() => {
    const set = new Set(photos.map((p) => p.school_year));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [photos]);

  const eventsWithPhotos = useMemo(() => {
    const ids = new Set(photos.map((p) => p.event_id).filter((v): v is number => v !== null));
    return events
      .filter((e) => ids.has(e.id))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .map((e) => ({ id: e.id, title: e.title }));
  }, [photos, events]);

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      if (schoolYear !== 'all' && p.school_year !== schoolYear) return false;
      if (eventId === 'none') return p.event_id === null;
      if (eventId !== 'all' && p.event_id !== eventId) return false;
      return true;
    });
  }, [photos, schoolYear, eventId]);

  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      <div className="px-4 md:px-10 lg:px-20 py-10 flex justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Photos
            </h1>
            <p className="mt-2 text-gray-600 dark:text-white/70">
              Moments from Schweitzer events, organized by school year and event.
            </p>
          </div>

          <PhotoFilters
            schoolYears={schoolYears}
            events={eventsWithPhotos}
            schoolYear={schoolYear}
            eventId={eventId}
            view={view}
            count={filtered.length}
            onSchoolYearChange={setSchoolYear}
            onEventChange={setEventId}
            onViewChange={setView}
          />

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading photos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-6 text-red-700 dark:text-red-200">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] rounded-xl border border-dashed border-gray-200 dark:border-white/15 px-6 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-white/30 mb-3">
                photo_library
              </span>
              <p className="text-gray-700 dark:text-white/80 font-medium">No photos yet</p>
              <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                {photos.length === 0
                  ? 'Check back soon — admins will be uploading photos from upcoming events.'
                  : 'No photos match these filters. Try clearing them.'}
              </p>
            </div>
          ) : view === 'grid' ? (
            <GalleryGrid photos={filtered} onSelect={setLightboxIndex} />
          ) : view === 'masonry' ? (
            <GalleryMasonry photos={filtered} onSelect={setLightboxIndex} />
          ) : (
            <GalleryByEvent photos={filtered} onSelect={setLightboxIndex} />
          )}
        </div>
      </div>

      <PhotoLightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onIndexChange={setLightboxIndex}
      />
    </main>
  );
}
