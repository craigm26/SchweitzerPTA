'use client';

import Image from 'next/image';
import { Photo, photoUrl } from '@/lib/api';

type Props = {
  photos: Photo[];
  onSelect: (index: number) => void;
};

export default function GalleryMasonry({ photos, onSelect }: Props) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
      {photos.map((p, i) => {
        const aspect = p.height && p.width ? p.height / p.width : 1;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(i)}
            className="group relative mb-3 block w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-[#2a221a] break-inside-avoid focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ aspectRatio: `${p.width} / ${p.height || 1}` }}
            aria-label={p.alt_text || p.caption || `Photo ${i + 1}`}
          >
            <Image
              src={photoUrl(p.thumb_path)}
              alt={p.alt_text || p.caption || ''}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ ['--aspect' as string]: aspect }}
            />
            {(p.caption || p.event) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {p.caption && <p className="text-white text-xs leading-tight line-clamp-2">{p.caption}</p>}
                {p.event && <p className="text-white/80 text-[11px] mt-0.5 truncate">{p.event.title}</p>}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
