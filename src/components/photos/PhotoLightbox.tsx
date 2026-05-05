'use client';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Photo, photoUrl } from '@/lib/api';

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export default function PhotoLightbox({ photos, index, onClose, onIndexChange }: Props) {
  const slides = photos.map((p) => ({
    src: photoUrl(p.medium_path),
    width: p.width,
    height: p.height,
    alt: p.alt_text || p.caption || '',
    description: p.caption || undefined,
  }));

  return (
    <Lightbox
      open={index >= 0}
      close={onClose}
      slides={slides}
      index={Math.max(0, index)}
      on={{ view: ({ index: i }) => onIndexChange(i) }}
    />
  );
}
