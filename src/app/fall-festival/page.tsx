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
              October 16, 2026 | 6:00pm -8:00pm
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
            work during the event, and clean up afterward. Whether you can take on a
            planning role, help with one specific task, or give us a few hours, there&rsquo;s a
            way to get involved.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Join us at the Fall Festival Planning Meeting!
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-bold">
            Tuesday, September 15 at 5:00 PM
            <br />
            Schweitzer, Location TBD
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Come hear what&rsquo;s planned for Fall Festival, learn where help is needed, and
            find a way to pitch in that works for you. You don&rsquo;t need to be a PTA
            member&mdash;or commit to every event&mdash;to help make Fall Festival a success.
          </p>
          <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            <p>You can help by:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>helping create props for the Spooky Walk</li>
              <li>running a game station</li>
              <li>setting up before the festival</li>
              <li>cleaning up afterward</li>
            </ul>
          </div>

          <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] pt-4">
            Spooky Walk
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            The Spooky Walk is one of the main attractions of Fall Festival and a
            Schweitzer favorite! Creating the experience takes weeks of preparation and a
            team of creative, hands-on volunteers.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Prop-building volunteers are needed ASAP to help us start bringing this
            year&rsquo;s Spooky Walk to life. We&rsquo;ll also need volunteers for setup and
            take-down, lighting and sound support, decorating, and more.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            You don&rsquo;t need any special experience&mdash;just a willingness to help!
            Whether you&rsquo;re creative, handy, tech-savvy, or simply available to lend a
            hand, we need you to make the Spooky Walk happen.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Interested? Contact Marie at 916-221-2384.
          </p>

          <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] pt-4">
            Purchase Fall Festival Tickets - On Sale 10/2
          </h2>
          <div className="relative w-full overflow-hidden h-[900px]">
            <iframe
              title="Donation form powered by Zeffy"
              src="https://www.zeffy.com/embed/ticketing/fall-festival-albert-schweitzer-elementary-school--2026"
              className="absolute inset-0 w-full h-full border-0"
              allowTransparency
            />
          </div>
        </div>
      </div>
    </main>
  );
}
