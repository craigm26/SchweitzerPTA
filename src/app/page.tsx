'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="layout-container flex flex-col w-full mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 gap-8">
      <section className="w-full">
        <div className="@container">
          <div className="flex flex-col-reverse gap-6 py-4 lg:py-10 @[864px]:flex-row @[864px]:items-center">
            <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 flex-1">
              <div className="flex flex-col gap-4 text-left">
                <h1 className="text-[#181411] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl lg:text-6xl">
                  Welcome Albert Schweitzer Families, Friends, and Wildcat Supporters!
                </h1>
                <div className="text-[#181411]/80 dark:text-gray-300 text-base font-normal leading-relaxed max-w-xl space-y-4">
                  <p>
                    The Albert Schweitzer Elementary PTA is a dedicated and enthusiastic group of parents
                    and teachers who work together to support and enrich every Wildcat&apos;s school
                    experience. Our goal is simple: help create a fun, inclusive, and well-rounded
                    environment where students can thrive both inside and outside the classroom.
                  </p>
                  <p>
                    Through our efforts, we organize engaging school events, raise funds for essential
                    programs, and build strong connections between families and staff. Everything we do is
                    focused on helping our Wildcats learn, grow, and succeed.
                  </p>
                  <div>
                    <p className="mb-2">PTA Sponsored Events/Items include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>School Calendars</li>
                      <li>Teacher Stipends</li>
                      <li>Classroom Field Trips</li>
                      <li>Fall Festival</li>
                      <li>Cocoa and Crafts</li>
                      <li>Teacher and Staff Appreciation</li>
                      <li>5th Grade Campership</li>
                      <li>School Family Dance</li>
                      <li>Starstruck Shirts (A school-wide dance program where each class learns a routine and performs in a showcase)</li>
                      
                      <li>Auction</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2">PTA Sponsored Projects include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>New School Mural (in planning)</li>
                      <li>New technology and lighting for MP Room</li>
                      <li>New library furniture</li>
                    </ul>
                  </div>
                  <p>
                    None of this would be possible without our amazing community. Whether you have an
                    hour to spare, a skill to share, or want to be involved throughout the year, your time and
                    ideas truly make a difference. There&apos;s a place for everyone in our PTA, and we&apos;d love to
                    have you join us.
                  </p>
                  <p>
                    If you&apos;re interested in volunteering, getting involved, or learning more about what we do,
                    please reach out to us at{' '}
                    <a href="mailto:AlbertSchweitzerPTA@gmail.com" className="text-primary font-bold hover:underline">
                      AlbertSchweitzerPTA@gmail.com
                    </a>.
                  </p>
                  <p className="font-semibold">
                    Thank you for supporting Albert Schweitzer Elementary and our incredible Wildcats.
                  </p>
                  <p className="font-bold text-primary">
                    Once a Wildcat, always a Wildcat!
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button size="large">Join the PTA</Button>
                </Link>
              </div>
            </div>
            <div className="w-full flex-1 rounded-xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800 relative group flex items-center justify-center min-h-[400px]">
              <Image
                src="/AlbertSchweitzerElementaryLogo.png"
                alt="Albert Schweitzer Elementary School Mascot"
                width={800}
                height={600}
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 text-white font-bold text-xl drop-shadow-md flex items-center gap-2 pointer-events-none">
                <span className="material-symbols-outlined">campaign</span> Go Wildcats!
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
