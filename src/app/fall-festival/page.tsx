'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Photos for the rotating banner. To use the Fall Festival photos, copy the
// picture files into the site's "public" folder and change the src below to
// match their file names (for example: '/fall-festival/photo-1.jpg').
const bannerPhotos = [
  { src: '/apex-fun-run.png', alt: 'Students having fun at a Schweitzer PTA event' },
  { src: '/auction-image.png', alt: 'Families gathered at a Schweitzer PTA event' },
  {
    src: '/AlbertSchweitzerElementaryLogo.png',
    alt: 'Albert Schweitzer Elementary wildcat logo',
  },
];

function PhotoBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((index) => (index + 1) % bannerPhotos.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[180px] md:h-[240px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
      {bannerPhotos.map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          className={`object-cover transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {bannerPhotos.map((photo, index) => (
          <span
            key={photo.src}
            className={`h-2 w-2 rounded-full ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FallFestivalPage() {
  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Fall Festival
            </h1>
            <p className="text-white text-lg md:text-xl font-bold">
              October 16, 2026
            </p>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Our biggest family night of the year — games, food, and fun for the whole
              Schweitzer community.
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[900px] w-full gap-6">
          <PhotoBanner />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            About the Fall Festival
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            The Fall Festival brings the Schweitzer community together for an evening of food,
            games, treats, and fun. Fall Festival will be held on Friday, October 16th on
            campus. More details will be posted here soon.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Check back for updates, and watch our Events page and social media for
            announcements.
          </p>
        </div>
      </div>
    </main>
  );
}
