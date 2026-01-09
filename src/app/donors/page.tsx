'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDonors, Donor } from '@/lib/api';

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDonors();
        setDonors(data || []);
      } catch (error) {
        console.error('Error fetching donors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading donors...</p>
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
                Thank You to Our Community Donors
              </h1>
              <p className="text-lg font-normal text-gray-600 dark:text-gray-300">
                Your generous support empowers our students and teachers to achieve great things. Together, we make
                Schweitzer Elementary a wonderful place to learn and grow. Go Wildcats!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <a 
                  href="mailto:AlbertSchweitzerPTA@gmail.com" 
                  className="flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5"
                >
                  Email AlbertSchweitzerPTA@gmail.com
                </a>
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

      {/* Donors List */}
      <div className="w-full max-w-6xl px-4 pb-20 pt-10 lg:px-8">
        {donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white dark:bg-[#2a221a] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-28 h-28 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {donor.logo ? (
                    <img src={donor.logo} alt={donor.name} className="max-h-20 max-w-20 object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-gray-300 group-hover:text-primary transition-colors">
                      volunteer_activism
                    </span>
                  )}
                </div>
                <h3 className="text-[#181411] dark:text-white font-bold text-xl mb-3">{donor.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {donor.description || 'Proud supporter of Schweitzer Elementary and our Wildcat community.'}
                </p>
                {donor.website && (
                  <a
                    href={donor.website.startsWith('http') ? donor.website : `https://${donor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-primary font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    Visit Website <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-7xl text-gray-300 mb-4 animate-pulse">volunteer_activism</span>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">No donors listed yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We&apos;re getting ready to showcase our amazing community partners. Be the first to support our school!
            </p>
            <Link 
              href="/about" 
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-all"
            >
              Learn How to Donate
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="w-full bg-[#181411] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Wildcat Community
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Interested in supporting Schweitzer Elementary?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Your contributions directly fund field trips, classroom supplies, and community events that make our school special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/volunteer"
              className="flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-all"
            >
              Make a Donation
            </Link>
            <Link
              href="/about"
              className="flex h-12 items-center justify-center rounded-xl bg-gray-800 border border-gray-700 px-8 text-base font-bold text-white hover:bg-gray-700 transition-colors"
            >
              Contact PTA Board
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}