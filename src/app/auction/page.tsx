'use client';

import Link from 'next/link';
import Button from '@/components/Button';

export default function AuctionPage() {
  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">gavel</span> Annual Fundraiser
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              9th Annual Adult-Only Dinner & Silent Auction
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              March 14, 2026
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[1200px] w-full gap-8">
          {/* About Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight">
                About the Event
              </h2>
              <div className="flex flex-col gap-4 text-[#181411]/80 dark:text-gray-300">
                <p className="text-base leading-relaxed">
                  Albert Schweitzer Elementary School is proud to host our 9th Annual Adult-Only Dinner
                  & Silent Auction on March 14, 2026.
                </p>
                <p className="text-base leading-relaxed">
                  Each year, our auction raises essential funds that directly enhance student learning –
                  supporting classroom stipends, field trips, performing arts, campus improvements, and
                  technology upgrades.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <div
                className="w-full aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0eL0H-mVWQQ9PJlC3xqXx8JmC3xqXx8JmC3xqXx8JmC3xqXx8Jm")',
                  backgroundColor: '#f27f0d20',
                }}
              >
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
                  <span className="material-symbols-outlined text-8xl text-primary/60">celebration</span>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl p-8 md:p-12 border border-primary/20">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">trending_up</span>
                <h3 className="text-[#181411] dark:text-white text-2xl font-bold">How Your Support Helps</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">class</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Classroom Stipends</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Direct funding for teachers to enhance their classrooms
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">directions_bus</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Field Trips</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Educational experiences beyond the classroom
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">theater_comedy</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Performing Arts</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Supporting music, drama, and arts programs
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">computer</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Technology</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Upgrading campus technology and equipment
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-xl bg-gradient-to-r from-primary to-orange-500 p-8 md:p-12 text-center">
            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">volunteer_activism</span>
              </div>
              <h2 className="text-white text-3xl font-bold">Want to Contribute?</h2>
              <p className="text-white/90 text-lg">
                Your donations make this event possible. Consider donating an item, experience, gift certificate, or sponsorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/donations">
                  <Button size="large" variant="secondary">
                    Learn About Donations
                  </Button>
                </Link>
                <a
                  href="mailto:AlbertSchweitzerPTA@gmail.com"
                  className="bg-[#181411] hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

