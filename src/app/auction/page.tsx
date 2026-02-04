'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAuctionItems, getDonors, AuctionItem, Donor } from '@/lib/api';

const getYouTubeId = (url?: string | null) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const searchId = parsed.searchParams.get('v');
      if (searchId) return searchId;
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1] || null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1] || null;
      }
    }
  } catch {
    return null;
  }
  return null;
};

export default function AuctionPage() {
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donorsLoading, setDonorsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [itemsResult, donorsResult] = await Promise.allSettled([
        getAuctionItems({ limit: 'all' }),
        getDonors({ limit: 12 }),
      ]);

      if (itemsResult.status === 'fulfilled') {
        setAuctionItems(itemsResult.value || []);
      } else {
        console.error('Error fetching auction items:', itemsResult.reason);
      }

      if (donorsResult.status === 'fulfilled') {
        setDonors(donorsResult.value || []);
      } else {
        console.error('Error fetching donors:', donorsResult.reason);
      }

      setDonorsLoading(false);
    }
    fetchData();
  }, []);

  const liveItems = auctionItems.filter((item) => item.item_type === 'live');
  const silentItems = auctionItems.filter((item) => item.item_type === 'silent');
  const raffleItems = auctionItems.filter((item) => item.item_type === 'raffle');
  return (
    <main className="layout-container flex h-full grow flex-col pb-20 bg-[#f9f6f2] dark:bg-[#14100c]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#181411]">
        <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ')] bg-center bg-cover opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#181411]"></div>
        <div className="relative px-4 md:px-10 lg:px-20 py-16 md:py-20">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
            <div className="flex flex-col gap-4 max-w-3xl">
              <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                9th Annual Adult-Only Dinner & Silent Auction
              </h1>
              <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-2xl">
                March 14, 2026 | Dinner, live bidding, and silent auction highlights.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white">
                <p className="text-xs uppercase text-white/60">Date</p>
                <p className="text-lg font-bold">March 14, 2026</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white">
                <p className="text-xs uppercase text-white/60">Audience</p>
                <p className="text-lg font-bold">Adult-Only Evening</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white">
                <p className="text-xs uppercase text-white/60">Highlights</p>
                <p className="text-lg font-bold">Dinner + Auction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-12 flex justify-center">
        <div className="flex flex-col max-w-[1200px] w-full gap-12">
          {/* About Section */}
          <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start bg-white/90 dark:bg-[#1c150f] rounded-3xl p-8 md:p-10 shadow-xl border border-white/60 dark:border-white/5 -mt-16">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Event Overview</p>
                <h2 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight">
                  About the Event
                </h2>
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-4">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Hosted by</p>
                  <p className="text-lg font-bold text-[#181411] dark:text-white">Schweitzer PTA</p>
                </div>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-4">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Audience</p>
                  <p className="text-lg font-bold text-[#181411] dark:text-white">Adult-Only</p>
                </div>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-4">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Purpose</p>
                  <p className="text-lg font-bold text-[#181411] dark:text-white">Support Students</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/auction-image.png"
                  alt="9th Annual Adult-Only Dinner & Silent Auction"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-orange-500/10 dark:from-primary/10 dark:via-[#1c150f] dark:to-orange-500/10 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">celebration</span>
                  What to Expect
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[#181411]/80 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    Dinner and community celebration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    Live and silent auctions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    Poker and Blackjack tables
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    Every bid supports student programs
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tickets Section */}
          <section id="tickets" className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Tickets & Donations</p>
              <h2 className="text-[#181411] dark:text-white text-2xl md:text-3xl font-bold leading-tight">
                Reserve your seat
              </h2>
              <p className="text-[#181411]/80 dark:text-gray-300 text-base leading-relaxed">
                Purchase tickets or make a direct contribution to support our classrooms, arts, and campus programs.
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-base">lock</span>
                Ticketing powered by Zeffy
              </div>
            </div>
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c150f] shadow-lg overflow-hidden">
              <div className="relative h-[640px] w-full">
                <iframe
                  title="Donation form powered by Zeffy"
                  className="absolute inset-0 h-full w-full border-0"
                  src="https://www.zeffy.com/embed/ticketing/boardwalk-bash-and-benefit-night"
                  allow="payment"
                  allowTransparency
                />
              </div>
            </div>
          </section>
          {/* Raffle Items Section - A lot like the auction items section, but for raffle items */}
          <section id="raffle-items" className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Raffle Highlights</p>
              <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                Preview a few of the items available this year.
              </p>
            </div>
          </section>
          {/* Raffle Items Section - A lot like the auction items section, but for raffle items */}
          <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1c150f] p-6 md:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">
                      Raffle Items
                    </h3>
                    <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                      Grab raffle tickets for a chance to win these prizes.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase">
                      Raffle
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{raffleItems.length} items</span>
                  </div>
                </div>
                {raffleItems.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#221910] p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300">local_activity</span>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Raffle items will be announced soon.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {raffleItems.map((item) => {
                      const youtubeId = getYouTubeId(item.youtube_url);
                      return (
                        <div
                          key={item.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="relative">
                            {youtubeId ? (
                              <div className="aspect-video bg-black">
                                <iframe
                                  title={`${item.title} video`}
                                  src={`https://www.youtube.com/embed/${youtubeId}`}
                                  className="h-full w-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                />
                              </div>
                            ) : item.image_urls?.[0] ? (
                              <img
                                src={item.image_urls[0]}
                                alt={item.title}
                                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="h-44 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-gray-400">local_activity</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-[#181411] shadow-sm">
                              <span className="material-symbols-outlined text-sm">local_activity</span>
                              Raffle
                            </div>
                            {item.estimated_value !== null && (
                              <div className="absolute top-3 right-3 rounded-full bg-[#181411]/80 text-white text-xs font-semibold px-2 py-1">
                                Est. ${Number(item.estimated_value).toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-3 p-5">
                            <h4 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {item.description}
                              </p>
                            )}
                            {youtubeId && item.image_urls?.[0] && (
                              <img
                                src={item.image_urls[0]}
                                alt={`${item.title} preview`}
                                className="h-20 w-full rounded-lg object-cover"
                              />
                            )}
                            <div className="mt-auto flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              {item.donor?.name ? (
                                <div className="flex items-center gap-2">
                                  {item.donor.logo ? (
                                    <img
                                      src={item.donor.logo}
                                      alt={item.donor.name}
                                      className="w-6 h-6 rounded object-contain"
                                    />
                                  ) : (
                                    <span className="material-symbols-outlined text-base">handshake</span>
                                  )}
                                  <span>{item.donor.name}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Sponsor TBD</span>
                              )}
                              {item.quantity ? (
                                <span className="text-xs font-semibold text-primary">Qty {item.quantity}</span>
                              ) : null}
                            </div>
                            {item.donor?.website && (
                              <a
                                href={item.donor.website.startsWith('http') ? item.donor.website : `https://${item.donor.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1"
                              >
                                Sponsor Website <span className="material-symbols-outlined text-sm">open_in_new</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

          {/* Auction Items Section */}
          <section id="auction-items" className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Auction Highlights</p>
              <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                Preview a few of the packages and experiences available this year.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1c150f] p-6 md:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">
                      Live Auction Items
                    </h3>
                    <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                      Exclusive live experiences and premier packages.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase">
                      Live
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{liveItems.length} items</span>
                  </div>
                </div>
                {liveItems.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#221910] p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300">gavel</span>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Live auction items will be announced soon.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveItems.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex flex-1 flex-col gap-3 p-5">
                          <h4 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            
                            {item.quantity ? (
                              <span className="text-xs font-semibold text-primary">Qty {item.quantity}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1c150f] p-6 md:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">
                      Silent Auction Items
                    </h3>
                    <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                      A preview of items and experiences up for bid.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase">
                      Silent
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{silentItems.length} items</span>
                  </div>
                </div>
                {silentItems.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#221910] p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300">redeem</span>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Silent auction items will be posted here soon.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {silentItems.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex flex-1 flex-col gap-3 p-5">
                          <h4 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            {item.donor?.name ? (
                              <div className="flex items-center gap-2">
                                {item.donor.logo ? (
                                  <img
                                    src={item.donor.logo}
                                    alt={item.donor.name}
                                    className="w-6 h-6 rounded object-contain"
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-base">handshake</span>
                                )}
                                <span>{item.donor.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">Sponsor TBD</span>
                            )}
                            {item.quantity ? (
                              <span className="text-xs font-semibold text-primary">Qty {item.quantity}</span>
                            ) : null}
                          </div>
                          {item.donor?.website && (
                            <a
                              href={item.donor.website.startsWith('http') ? item.donor.website : `https://${item.donor.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              Sponsor Website <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              
            </div>
          </section>
 
          {/* Impact Section */}
          <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-white/90 dark:bg-[#1c150f] p-8 md:p-10 shadow-lg">
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl"></div>
            <div className="relative flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">trending_up</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Impact</p>
                  <h3 className="text-[#181411] dark:text-white text-2xl font-bold">How Your Support Helps</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">class</span>
                  </div>
                  <h4 className="mt-3 text-[#181411] dark:text-white font-bold">Classroom Stipends</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Direct funding for teachers to enhance their classrooms
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">directions_bus</span>
                  </div>
                  <h4 className="mt-3 text-[#181411] dark:text-white font-bold">Field Trips</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Educational experiences beyond the classroom
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">theater_comedy</span>
                  </div>
                  <h4 className="mt-3 text-[#181411] dark:text-white font-bold">Performing Arts</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Supporting music, drama, and arts programs
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">computer</span>
                  </div>
                  <h4 className="mt-3 text-[#181411] dark:text-white font-bold">Technology</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Upgrading campus technology and equipment
                  </p>
                </div>
              </div>
            </div>
          </section>



          {/* Donations Section */}
          <section id="how-to-help" className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-[#1c150f] shadow-lg">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-6 md:px-8 md:py-7">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">How You Can Help</p>
                  <h2 className="text-[#181411] dark:text-white text-2xl md:text-3xl font-bold leading-tight">
                    Donate to the auction
                  </h2>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Give an item, experience, or contribution to support our students.
                  </p>
                </div>
                <span className="material-symbols-outlined text-3xl text-primary">expand_more</span>
              </summary>
              <div className="px-6 pb-8 md:px-8">
                <div className="flex flex-col gap-4 text-[#181411]/80 dark:text-gray-300">
                  <p className="text-base leading-relaxed">
                    We kindly ask you to consider donating an item, experience, gift certificate, or
                    direct contribution for this year&apos;s event. Your generosity strengthens our auction offerings and
                    provides valuable visibility among families and community members who appreciate
                    supporters of their local schools.
                  </p>
                </div>

                {/* Donation Types Grid */}
                <section className="mt-8 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
                    <h3 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">
                      We Are Seeking
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">gavel</span>
                      </div>
                      <h4 className="mt-3 text-[#181411] dark:text-white text-lg font-bold leading-tight">
                        Silent Auction Donations
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                        Products, services, gift certificates, experiences
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">shopping_basket</span>
                      </div>
                      <h4 className="mt-3 text-[#181411] dark:text-white text-lg font-bold leading-tight">
                        Local-Themed Baskets
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                        Restaurants, wellness, pets, family fun, and local favorites
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">card_giftcard</span>
                      </div>
                      <h4 className="mt-3 text-[#181411] dark:text-white text-lg font-bold leading-tight">
                        Gift Cards
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                        From local businesses and popular retailers
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">cake</span>
                      </div>
                      <h4 className="mt-3 text-[#181411] dark:text-white text-lg font-bold leading-tight">
                        Dessert Table Donations
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                        Homemade or store-bought desserts for the event
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">local_bar</span>
                      </div>
                      <h4 className="mt-3 text-[#181411] dark:text-white text-lg font-bold leading-tight">
                        Beverage Donations
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                        Wine, craft beer, spirits, mocktail supplies, unopened and store-bought
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                      </div>
                      <h4 className="mt-3 text-[#181411] dark:text-white text-lg font-bold leading-tight">
                        Community Donations
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                        Help offset food, decor, and entertainment costs
                      </p>
                    </div>
                  </div>
                </section>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tax Information */}
                  <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-orange-500/10 dark:from-primary/10 dark:via-[#1c150f] dark:to-orange-500/10 p-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-3xl">receipt</span>
                      <h3 className="text-[#181411] dark:text-white text-xl font-bold">Tax Deduction Information</h3>
                    </div>
                    <p className="mt-3 text-[#181411]/80 dark:text-gray-300">
                      As a nonprofit organization, all contributions are tax-deductible.
                    </p>
                    <div className="mt-4 bg-white dark:bg-[#181411] rounded-lg p-4 border border-primary/20">
                      <p className="text-[#181411] dark:text-white font-bold">
                        Tax ID #94-6174418
                      </p>
                    </div>
                  </section>

                  {/* Mailing Information */}
                  <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#221910] p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                      <h3 className="text-[#181411] dark:text-white text-xl font-bold">Donation Mailing Information</h3>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 text-[#181411]/80 dark:text-gray-300">
                      <p className="font-semibold text-[#181411] dark:text-white">Albert Schweitzer Elementary School PTA</p>
                      <p>Attn: Andrea Ellery, PTA</p>
                      <p>4350 Glenridge Drive</p>
                      <p>Carmichael, CA 95608</p>
                    </div>
                  </section>
                </div>
              </div>
            </details>
          </section>

          {/* Header for thanking our donors H2 size like other headers */}
          
          <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">
            Thank you Donors!
          </h2>

          {/* Donors List */}
          <div className="w-full max-w-6xl px-4 pb-20 pt-10 lg:px-8">
            {donorsLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">Loading donors...</p>
                </div>
              </div>
            ) : donors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {donors.map((donor) => (
                  <div
                    key={donor.id}
                    className="bg-white dark:bg-[#2a221a] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="w-28 h-28 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {donor.logo ? (
                        <Image
                          src={donor.logo}
                          alt={donor.name}
                          width={80}
                          height={80}
                          sizes="80px"
                          className="max-h-20 max-w-20 object-contain"
                        />
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
          <section className="rounded-3xl bg-gradient-to-r from-primary to-orange-500 p-8 md:p-12 text-center shadow-xl">
            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">volunteer_activism</span>
              </div>
              <h2 className="text-white text-3xl md:text-4xl font-bold">Ready to Donate?</h2>
              <p className="text-white/90 text-lg">
                Have questions or want to discuss your donation? We&apos;d love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:AlbertSchweitzerPTA@gmail.com"
                  className="bg-[#181411] hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="#tickets"
                  className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Get Tickets
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}