'use client';

import Image from 'next/image';
import { Photo, photoUrl } from '@/lib/api';

type Props = {
  photos: Photo[];
  onSelect: (index: number) => void;
};

type Group = {
  key: string;
  title: string;
  date: string | null;
  schoolYear: string;
  photos: { photo: Photo; flatIndex: number }[];
};

function groupByEvent(photos: Photo[]): Group[] {
  const map = new Map<string, Group>();
  photos.forEach((photo, flatIndex) => {
    // Distinct keys per source so an event id 5 in `events` doesn't collide
    // with calendar_event id 5.
    let key: string;
    let title: string;
    let date: string | null;
    if (photo.event_id !== null) {
      key = `e:${photo.event_id}`;
      title = photo.event?.title || 'Untagged';
      date = photo.event?.date || null;
    } else if (photo.calendar_event_id !== null) {
      key = `c:${photo.calendar_event_id}`;
      title = photo.calendar_event?.title || 'Untagged';
      date = photo.calendar_event?.date || null;
    } else {
      key = `u:${photo.school_year}`;
      title = 'Untagged';
      date = null;
    }
    let g = map.get(key);
    if (!g) {
      g = { key, title, date, schoolYear: photo.school_year, photos: [] };
      map.set(key, g);
    }
    g.photos.push({ photo, flatIndex });
  });
  // Sort groups: dated events newest-first, untagged groups last.
  return Array.from(map.values()).sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return b.schoolYear.localeCompare(a.schoolYear);
  });
}

export default function GalleryByEvent({ photos, onSelect }: Props) {
  const groups = groupByEvent(photos);
  return (
    <div className="flex flex-col gap-10">
      {groups.map((g) => (
        <section key={g.key}>
          <header className="mb-3 flex items-baseline justify-between gap-3 border-b border-gray-200 dark:border-white/10 pb-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{g.title}</h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              {g.schoolYear}{g.date ? ` · ${new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''} · {g.photos.length}
            </p>
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {g.photos.map(({ photo, flatIndex }) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelect(flatIndex)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#2a221a] focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={photo.alt_text || photo.caption || photo.event?.title || photo.calendar_event?.title || `Photo ${flatIndex + 1}`}
              >
                <Image
                  src={photoUrl(photo.thumb_path)}
                  alt={photo.alt_text || photo.caption || ''}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity text-left">
                    <p className="text-white text-xs leading-snug line-clamp-2">{photo.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
