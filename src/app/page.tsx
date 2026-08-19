'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubscribeMessage('');
    setSubscribeError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'home_page',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubscribeError(result.error || 'Unable to subscribe right now. Please try again.');
        return;
      }

      if (result.alreadySubscribed) {
        setSubscribeMessage('You are already subscribed. Thanks for staying connected!');
      } else {
        setSubscribeMessage('Thanks for subscribing! You will receive future announcements.');
      }
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscribe request failed:', error);
      setSubscribeError('Unable to subscribe right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="layout-container flex flex-col w-full mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 gap-8">
      <a
        href="https://jointotem.com/ca/carmichael/albert-schweitzer-elementary-pta?utm_source=totem&utm_medium=qr&utm_campaign=print"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-primary hover:bg-orange-600 transition-colors px-6 py-6 text-center text-white shadow-lg sm:flex-row sm:gap-6"
      >
        <Image
          src="/AlbertSchweitzerElementaryLogo.png"
          alt="Albert Schweitzer Elementary wildcat logo"
          width={80}
          height={80}
          className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
        />
        <span className="block">
          <span className="block text-2xl sm:text-3xl font-black tracking-wide">
            CLICK HERE TO JOIN PTA TODAY
          </span>
          <span className="mt-2 block text-sm sm:text-base font-medium">
            Membership is $11 for the year and helps support our school.
          </span>
          <span className="block text-sm sm:text-base font-medium">
            There are lots of ways to get involved &mdash; choose what works for
            you!
          </span>
        </span>
      </a>
      <section className="w-full">
        <div className="@container">
          <div className="flex flex-col-reverse gap-6 pt-0 pb-4 lg:pb-10 @[864px]:flex-row @[864px]:items-center">
            <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 flex-1">
              <div className="flex flex-col gap-4 text-left">
                <h1 className="text-[#181411] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em] @[480px]:text-4xl lg:text-5xl">
                  Welcome Albert Schweitzer Families, Friends, and Wildcat Supporters!
                </h1>
                <div className="text-[#181411]/80 dark:text-gray-300 text-base font-normal leading-relaxed space-y-4">
                  <p>
                    The Albert Schweitzer Elementary PTA is our school community working together to
                    support students, teachers, and families. Our goal is simple: to help create a fun,
                    inclusive, and well-rounded
                    environment where every student can thrive both inside and outside the classroom.
                  </p>
                  <p className="mb-2">PTA Goals:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Support student learning</li>
                    <li>Fund programs &amp; improvements</li>
                    <li>Plan &amp; support school events</li>
                    <li>Build a strong school community</li>
                  </ul>
                  <p>
                    Through our efforts, we organize engaging school events, raise funds for essential
                    programs, and build strong connections between families and staff. Everything we do is
                    focused on helping our Wildcats learn, grow, and succeed.
                  </p>
                  <div>
                    <p className="mb-2">PTA Sponsored Events/Items include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 sm:columns-2 sm:gap-8">
                      <li>School Calendars</li>
                      <li>Teacher Stipends</li>
                      <li>Spirit Wear</li>
                      <li>Fall Festival</li>
                      <li>Cocoa and Crafts</li>
                      <li>Teacher and Staff Appreciation</li>
                      <li>5th Grade Camp Support</li>
                      <li>Family Fun Dance</li>
                      <li>Starstruck Shirts</li>
                      <li>Muffins for Mom</li>
                      <li>Donuts for Dad</li>
                      <li>Fun Run</li>
                      <li>School Upgrades</li>
                      <li>and More!</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2">PTA Sponsored Projects include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>School Mural (planned for 2026-2027 School Year)</li>
                      <li>New technology and lighting for MP Room (2025-2026 School Year)</li>
                      <li>New library furniture (2024-2025 School Year)</li>
                    </ul>
                  </div>
                  <p>
                    Our PTA meets on the first Tuesday of each month at 5:00 p.m. in the Schweitzer
                    Elementary School Library. Meetings are open to everyone, and we encourage all parents,
                    guardians, and staff to attend. Whether you&apos;re looking to stay informed, share ideas,
                    or get more involved, we&apos;d love to have you join us.
                  </p>
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
              <form onSubmit={handleSubscribe} className="max-w-xl">
                <label
                  htmlFor="newsletter-email"
                  className="block text-sm font-semibold text-[#181411] dark:text-gray-100 mb-2"
                >
                  Subscribe for newsletters and announcements
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 rounded-lg border border-[#e6e0db] dark:border-gray-700 bg-white dark:bg-[#181411] px-4 h-12 text-[#181411] dark:text-white placeholder:text-[#181411]/50 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-6 rounded-lg font-bold bg-background-light dark:bg-white/10 border border-[#e6e0db] dark:border-white/20 text-[#181411] dark:text-white hover:bg-[#e6e0db] dark:hover:bg-white/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {subscribeMessage && (
                  <p className="mt-2 text-sm font-medium text-green-700 dark:text-green-400">{subscribeMessage}</p>
                )}
                {subscribeError && (
                  <p className="mt-2 text-sm font-medium text-red-700 dark:text-red-400">{subscribeError}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
