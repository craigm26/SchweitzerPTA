'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getPhotos,
  getEvents,
  getCalendarEvents,
  photoUrl,
  Photo,
  Event,
  CalendarEvent,
} from '@/lib/api';

// Photos tagged to this event on the Photos page show up in the collage below.
const COLLAGE_EVENT_TITLE = 'Fall Festival 2025';
const COLLAGE_MAX_PHOTOS = 8;

function FallFestivalCollage() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [allPhotos, events, calendarEvents]: [Photo[], Event[], CalendarEvent[]] =
          await Promise.all([getPhotos({ limit: 500 }), getEvents(), getCalendarEvents()]);
        if (cancelled) return;

        const wanted = COLLAGE_EVENT_TITLE.trim().toLowerCase();
        const eventIds = new Set(
          (events || []).filter((e) => e.title?.trim().toLowerCase() === wanted).map((e) => e.id)
        );
        const calendarEventIds = new Set(
          (calendarEvents || [])
            .filter((e) => e.title?.trim().toLowerCase() === wanted)
            .map((e) => e.id)
        );

        setPhotos(
          (allPhotos || [])
            .filter(
              (p) =>
                (p.event_id !== null && eventIds.has(p.event_id)) ||
                (p.calendar_event_id !== null && calendarEventIds.has(p.calendar_event_id))
            )
            .slice(0, COLLAGE_MAX_PHOTOS)
        );
      } catch (err) {
        console.error('Could not load Fall Festival photos:', err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (photos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {photos.map((p) => (
          <div
            key={p.id}
            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#2a221a]"
          >
            <Image
              src={photoUrl(p.thumb_path)}
              alt={p.alt_text || p.caption || 'Fall Festival photo'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 220px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <Link
        href="/photos"
        className="text-sm font-medium text-primary hover:underline self-start"
      >
        See more photos
      </Link>
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
          <FallFestivalCollage />
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Fall Festival is one of Schweitzer&rsquo;s biggest and most-loved events of the
            year&mdash;and it takes a lot of helping hands to make it happen!
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            We&rsquo;re looking for volunteers who can help plan, prepare, set up,
            volunteer during the event, and clean up afterward. Whether you can take on a
            planning role, help with one specific task, or give us a few hours, there&rsquo;s a
            way to get involved.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Want to learn more? Join us at our first PTA meeting of the year!
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-bold">
            Tuesday, September 1 at 5:00 PM
            <br />
            Schweitzer School Library
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Come hear what&rsquo;s planned for Fall Festival, learn where help is needed, and
            find a way to pitch in that works for you. You don&rsquo;t need to be a PTA Board
            member&mdash;or commit to every event&mdash;to help make Fall Festival a success.
          </p>
        </div>
      </div>
    </main>
  );
}
