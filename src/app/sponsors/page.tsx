'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSponsors, Sponsor } from '@/lib/api';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSponsors();
        setSponsors(data || []);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Group sponsors by level
  const platinumSponsors = sponsors.filter((s) => s.level === 'platinum');
  const goldSponsors = sponsors.filter((s) => s.level === 'gold');
  const silverSponsors = sponsors.filter((s) => s.level === 'silver');
  const bronzeSponsors = sponsors.filter((s) => s.level === 'bronze');

  if (loading) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading sponsors...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full px-4 py-12 md:py-20 lg:px-8 bg-gradient-to-b from-white to-[#fdf8f4] dark:from-[#181411] dark:to-[#221910]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col-reverse gap-10 md:flex-row md:items-center md:gap-16">
            <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-[#181411] dark:text-white md:text-5xl lg:text-6xl">
                Thank You to Our Community Partners
              </h1>
              <p className="text-lg font-normal text-gray-600 dark:text-gray-300">
                Your generous support empowers our students and teachers to achieve great things. Together, we make
                Schweitzer Elementary a wonderful place to learn and grow. Go Wildcats!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <button className="flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5">
                  Become a Sponsor
                </button>
                <button className="flex h-12 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-8 text-base font-bold text-[#181411] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  View Benefits
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbguZ_2vXCEsCZAg_vcEZZ-rXrM7Ksz9P30FWJZUICgZgoaZ6s5fD1t7pIUSIXiSioOMmZSMe65bFWismAKCoinZDhNyY6H-f67EYXgzojCTaGEv2dvcIFnI5frdoWyKXsFeXZuGye1qc_FgBA3WSoGB6wwk_2xIOKShbUSKEEkuIPeuGgIhQT2vlIaQJNKR2wkQ8MCxR6s1hhXcAOcUXWb7diwiJ7Hpt8MHaYbyFcnxbFUTWIlPiHQljN4I2v2F-a128PDoHgSZah')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Tiers */}
      <div className="w-full max-w-6xl px-4 pb-20 pt-10 lg:px-8">
        {/* Platinum Level */}
        {platinumSponsors.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💎</span>
              <div>
                <h2 className="text-[#181411] dark:text-white text-2xl font-bold">Platinum Level - Wildcat Legends</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Our most distinguished partners.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platinumSponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#2a221a] rounded-xl border-2 border-purple-300 dark:border-purple-600 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center mb-4">
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="max-h-16 max-w-16 object-contain" />
                    ) : (
                      <span className="text-4xl">💎</span>
                    )}
                  </div>
                  <h3 className="text-[#181411] dark:text-white font-bold text-lg mb-2">{sponsor.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{sponsor.description || 'Proud supporter of Schweitzer Elementary.'}</p>
                  <span className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    Visit Website <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Gold Level */}
        {goldSponsors.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏆</span>
              <div>
                <h2 className="text-[#181411] dark:text-white text-2xl font-bold">Gold Level - Wildcat Champions</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Our premier partners making the biggest impact.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goldSponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#2a221a] rounded-xl border-2 border-amber-300 dark:border-amber-600 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center mb-4">
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="max-h-16 max-w-16 object-contain" />
                    ) : (
                      <span className="text-4xl">🏆</span>
                    )}
                  </div>
                  <h3 className="text-[#181411] dark:text-white font-bold text-lg mb-2">{sponsor.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{sponsor.description || 'Proud supporter of Schweitzer Elementary.'}</p>
                  <span className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    Visit Website <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Silver Level */}
        {silverSponsors.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🥈</span>
              <h2 className="text-[#181411] dark:text-white text-xl font-bold">Silver Level - Pride Partners</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {silverSponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl aspect-[4/3] flex items-center justify-center p-4 hover:scale-105 transition-transform cursor-pointer"
                >
                  {sponsor.logo ? (
                    <img src={sponsor.logo} alt={sponsor.name} className="max-h-12 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-800 dark:text-white font-bold text-sm text-center drop-shadow-md">{sponsor.name}</span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Bronze Level */}
        {bronzeSponsors.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🥉</span>
              <h2 className="text-[#181411] dark:text-white text-xl font-bold">Bronze Level - Paw Pals</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {bronzeSponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-square flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all cursor-pointer"
                >
                  {sponsor.logo ? (
                    <img src={sponsor.logo} alt={sponsor.name} className="max-h-8 max-w-full object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-gray-400">storefront</span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {sponsors.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">volunteer_activism</span>
            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No sponsors yet</h3>
            <p className="text-gray-500">Be the first to support our school!</p>
          </div>
        )}
      </div>

      {/* Become a Sponsor CTA */}
      <section className="w-full bg-[#181411] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Join the Community
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Interested in supporting Schweitzer Elementary?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Become a sponsor today and connect your business with our amazing community of families, teachers, and
            staff. We offer various sponsorship levels to fit your budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-all">
              Download Sponsor Packet
            </button>
            <Link
              href="/about"
              className="flex h-12 items-center justify-center rounded-xl bg-gray-800 border border-gray-700 px-8 text-base font-bold text-white hover:bg-gray-700 transition-colors"
            >
              Contact Sponsorship Chair
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
