'use client';

import Image from 'next/image';
import { Photo, photoUrl } from '@/lib/api';

type Props = {
  photos: Photo[];
  onSelect: (index: number) => void;
};

export default function GalleryGrid({ photos, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
      {photos.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(i)}
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#2a221a] focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={p.alt_text || p.caption || `Photo ${i + 1}`}
        >
          <Image
            src={photoUrl(p.thumb_path)}
            alt={p.alt_text || p.caption || ''}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {(p.caption || p.event) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity text-left">
              {p.caption && (
                <p className="text-white text-xs leading-snug line-clamp-2">{p.caption}</p>
              )}
              {p.event && (
                <p className="text-white/80 text-[11px] mt-0.5 truncate">{p.event.title}</p>
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
