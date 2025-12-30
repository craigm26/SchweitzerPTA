'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNews, getEvents, getSponsors, NewsArticle, Event, Sponsor } from '@/lib/api';

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsData, eventsData, sponsorsData] = await Promise.all([
          getNews({ status: 'published' }),
          getEvents({ upcoming: true }),
          getSponsors(),
        ]);
        
        // Set featured article (first one) and rest as recent updates
        if (newsData && newsData.length > 0) {
          setFeaturedArticle(newsData[0]);
          setNews(newsData.slice(1, 5));
        }
        setEvents(eventsData?.slice(0, 3) || []);
        setSponsors(sponsorsData?.slice(0, 4) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const getDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString().padStart(2, '0'),
    };
  };

  const filteredNews = news.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="layout-container flex h-full grow flex-col">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading news...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="layout-container flex h-full grow flex-col">
      <div className="px-4 md:px-10 xl:px-20 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
          {/* Hero Section */}
          <div className="@container mb-8">
            <div className="flex flex-col gap-6 py-6 md:py-10 md:flex-row items-center">
              <div className="w-full md:w-1/2 flex flex-col gap-6 justify-center">
                <div className="flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      The Roar
                    </span>
                  </div>
                  <h1 className="text-[#181411] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                    Latest News from Schweitzer PTA
                  </h1>
                  <h2 className="text-[#8a7560] dark:text-gray-300 text-sm md:text-lg font-normal leading-relaxed">
                    Keep up with the Wildcats! Find all the latest updates on school events, fundraisers, and community
                    stories.
                  </h2>
                </div>
                <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px]">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                    <div className="text-[#8a7560] flex border-none bg-[#f5f2f0] dark:bg-gray-800 items-center justify-center pl-4 rounded-l-xl border-r-0">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#181411] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f5f2f0] dark:bg-gray-800 focus:border-none h-full placeholder:text-[#8a7560] px-4 rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center justify-center rounded-r-xl border-l-0 border-none bg-[#f5f2f0] dark:bg-gray-800 pr-2">
                      <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-orange-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                        <span className="truncate">Search</span>
                      </button>
                    </div>
                  </div>
                </label>
              </div>
              <div
                className="w-full md:w-1/2 aspect-video rounded-xl bg-cover bg-center shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500"
                style={{
                  backgroundImage: featuredArticle?.featured_image
                    ? `url("${featuredArticle.featured_image}")`
                    : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcm_al54BDQA3ZLawV_0GKKDiXRvICjn8IlsB_Q9LFp3XW-cp8T9uUkj6KHPQd_DaROrSZORTtHHRQEdMFl9RduwcC9MNkdXdlh9PvR2qzLr1X9yD_qEwAwAsI5M9pwakl0Po_Sj1lVtSwp1jrmG4Lttr7AKtfEgMtose9ASE88_gTfnPwjvWH93BCmaD_sO-5VwE5yD4RQcsYXRuPGQ-1sBvs1NBWHv11skEHkF8V83i497Hnsud58hUiwA81flm7d3RLqoSRiPzy")',
                }}
              ></div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - News Content */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Featured Story */}
              {featuredArticle && (
                <section>
                  <div className="flex items-center gap-2 px-4 pb-3">
                    <span className="material-symbols-outlined text-primary">campaign</span>
                    <h3 className="text-[#181411] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Featured Story
                    </h3>
                  </div>
                  <Link
                    href={`/news/${featuredArticle.id}`}
                    className="group flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white dark:bg-[#2a221b] border border-transparent dark:border-gray-800 hover:border-primary/30 transition-all overflow-hidden"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover group-hover:scale-105 transition-transform duration-700"
                      style={{
                        backgroundImage: featuredArticle.featured_image
                          ? `url("${featuredArticle.featured_image}")`
                          : 'linear-gradient(135deg, #f27f0d20, #f27f0d40)',
                      }}
                    ></div>
                    <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-6 relative bg-white dark:bg-[#2a221b]">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold uppercase">
                          {featuredArticle.category || 'News'}
                        </span>
                        <span className="text-[#8a7560] dark:text-gray-400 text-sm font-normal">
                          {formatDate(featuredArticle.published_at || featuredArticle.created_at)}
                        </span>
                      </div>
                      <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-2 group-hover:text-primary transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-[#8a7560] dark:text-gray-300 text-base font-normal leading-relaxed mb-4 line-clamp-3">
                        {featuredArticle.excerpt || featuredArticle.content?.substring(0, 200)}
                      </p>
                      <div className="flex items-center justify-start">
                        <span className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-orange-600 text-white text-sm font-bold leading-normal transition-colors">
                          Read Full Story
                        </span>
                      </div>
                    </div>
                  </Link>
                </section>
              )}

              {/* Recent Updates */}
              <section>
                <div className="flex items-center gap-2 px-4 pb-3 pt-4 border-b border-[#f5f2f0] dark:border-gray-800 mb-4 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">newspaper</span>
                    <h3 className="text-[#181411] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Recent Updates
                    </h3>
                  </div>
                  <Link className="text-primary text-sm font-bold hover:underline" href="/news">
                    View All
                  </Link>
                </div>
                {filteredNews.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">article</span>
                    <p className="text-gray-500">No news articles found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredNews.map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.id}`}
                        className="group flex flex-col bg-white dark:bg-[#2a221a] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                      >
                        <div
                          className="w-full aspect-video bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{
                            backgroundImage: article.featured_image
                              ? `url("${article.featured_image}")`
                              : 'linear-gradient(135deg, #f27f0d20, #f27f0d40)',
                            backgroundColor: '#e5e5e5',
                          }}
                        ></div>
                        <div className="p-4 flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-gray-500 dark:text-gray-400 uppercase">
                              {article.category || 'News'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatDate(article.published_at || article.created_at)}
                            </span>
                          </div>
                          <h4 className="text-[#181411] dark:text-white font-bold text-lg group-hover:text-primary transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                            {article.excerpt || article.content?.substring(0, 150)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Load More */}
              <div className="flex justify-center py-4">
                <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#181411] dark:hover:text-white font-medium transition-colors">
                  Load More News
                  <span className="material-symbols-outlined text-lg">expand_more</span>
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:w-80 shrink-0 flex flex-col gap-6">
              {/* Upcoming Events */}
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">event</span>
                  <h4 className="font-bold text-[#181411] dark:text-white">Upcoming Events</h4>
                </div>
                {events.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming events.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {events.map((event) => {
                      const { month, day } = getDateParts(event.date);
                      return (
                        <div key={event.id} className="flex gap-3">
                          <div className="text-center shrink-0">
                            <div className="text-primary text-xs font-bold">{month}</div>
                            <div className="text-[#181411] dark:text-white text-xl font-bold">{day}</div>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#181411] dark:text-white text-sm">{event.title}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">{event.time}</span>
                            {event.location && (
                              <span className="text-gray-400 dark:text-gray-500 text-xs">{event.location}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Link
                  href="/events"
                  className="block mt-4 text-center text-primary text-sm font-bold hover:underline"
                >
                  View Calendar
                </Link>
              </div>

              {/* Our Sponsors */}
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                  <h4 className="font-bold text-[#181411] dark:text-white">Our Sponsors</h4>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Thanks to our amazing community partners for supporting our school!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {sponsors.length === 0 ? (
                    [1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-[#181411] rounded-lg p-3 flex items-center justify-center h-16"
                      >
                        <span className="material-symbols-outlined text-2xl text-gray-300">storefront</span>
                      </div>
                    ))
                  ) : (
                    sponsors.map((sponsor) => (
                      <a
                        key={sponsor.id}
                        href={sponsor.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-50 dark:bg-[#181411] rounded-lg p-3 flex items-center justify-center h-16 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {sponsor.logo ? (
                          <img src={sponsor.logo} alt={sponsor.name} className="max-h-10 max-w-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-gray-500 text-center">{sponsor.name}</span>
                        )}
                      </a>
                    ))
                  )}
                </div>
                <Link
                  href="/sponsors"
                  className="w-full mt-4 bg-[#181411] dark:bg-white text-white dark:text-[#181411] py-2 px-4 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity block text-center"
                >
                  Become a Sponsor
                </Link>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-primary rounded-xl p-5 text-white">
                <h4 className="font-bold text-lg mb-2">Weekly Roar Newsletter</h4>
                <p className="text-white/80 text-sm mb-4">
                  Don&apos;t miss out on important announcements delivered to your inbox.
                </p>
                <button className="w-full bg-white text-primary py-2 px-4 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
