'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { getNews, getSponsors, NewsArticle, Sponsor } from '@/lib/api';

export default function Home() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsData, sponsorsData] = await Promise.all([
          getNews({ status: 'published', limit: 3 }),
          getSponsors({ level: 'platinum' }),
        ]);
        setNews(newsData?.slice(0, 3) || []);
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

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  return (
    <div className="layout-container flex flex-col w-full mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 gap-8">
      <section className="w-full">
        <div className="@container">
          <div className="flex flex-col-reverse gap-6 py-4 lg:py-10 @[864px]:flex-row @[864px]:items-center">
            <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 flex-1">
              <div className="flex flex-col gap-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
                  <span className="material-symbols-outlined text-sm">school</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Wildcat Pride</span>
                </div>
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
                  <p>
                    Some of our favorite traditions include the Fall Festival, a lively and family-friendly
                    celebration for all ages, and our Annual Auction, a popular adults-only evening that
                    raises critical funds directly benefiting our school.
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button size="large">Join the PTA</Button>
                </Link>
                <Link href="/events">
                  <Button size="large" variant="secondary">
                    View Calendar
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full flex-1 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800 relative group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAapI-GMZA_9rxkQISpwd3j2o0gWezGfJE-sl2cpM3HadqCSZ05h4xDdHlGl_II7d3x4U6RWHMUSZgzLoB4fdF0adeDrbAGGhibYL12SPB0xhA0tGlzizThO8UCkXdSD7Tr1i0P1Fi_-ZUcTKEddfSh_2aqmBpnoyO2s60TSygJccD_Aslm2L6XaurJrgMnEVzogsPE2L4uCuOI88akRwDWy0hZPoc3uyyUm6Ll5pSnfCLw59jUhehXF0iwiZtl51ScmEAJuR38rsE5")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white font-bold text-xl drop-shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined">campaign</span> Go Wildcats!
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <a
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="#"
        >
          <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">restaurant_menu</span>
          </div>
          <span className="font-bold text-sm text-center">Lunch Menus</span>
        </a>
        <Link
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="/events"
        >
          <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">calendar_month</span>
          </div>
          <span className="font-bold text-sm text-center">School Calendar</span>
        </Link>
        <a
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="#"
        >
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">checkroom</span>
          </div>
          <span className="font-bold text-sm text-center">Spirit Wear</span>
        </a>
        <Link
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="/volunteer"
        >
          <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">volunteer_activism</span>
          </div>
          <span className="font-bold text-sm text-center">Volunteer</span>
        </Link>
      </section>

      <section className="flex flex-col gap-6 pt-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight tracking-tight">
              The Wildcat Roar
            </h2>
          </div>
          <Link className="text-primary text-sm font-bold hover:underline flex items-center gap-1" href="/news">
            View All News <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">article</span>
            <p className="text-gray-500">No news articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <Card key={article.id}>
                <div
                  className="w-full aspect-video bg-cover bg-center"
                  style={{
                    backgroundImage: article.featured_image
                      ? `url("${article.featured_image}")`
                      : 'linear-gradient(135deg, #f27f0d20, #f27f0d40)',
                  }}
                >
                  <div className="m-3 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg w-fit text-xs font-bold uppercase tracking-wider text-[#181411] dark:text-white shadow-sm">
                    {article.category || 'News'}
                  </div>
                </div>
                <div className="flex flex-col p-5 gap-3 flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {getRelativeTime(article.published_at || article.created_at)}
                  </div>
                  <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm leading-normal line-clamp-3">
                    {article.excerpt || article.content?.substring(0, 150)}
                  </p>
                  <div className="mt-auto pt-2">
                    <Link href={`/news/${article.id}`} className="text-primary font-bold text-sm hover:underline">
                      Read More
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 mb-12">
        <div className="rounded-2xl bg-[#181411] dark:bg-[#000] p-8 md:p-12 text-center relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#f27f0d 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="inline-flex mx-auto items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 w-fit mb-2">
                <span className="material-symbols-outlined text-sm">favorite</span>
                <span className="text-xs font-bold uppercase tracking-wide">Community Support</span>
              </div>
              <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">
                Thank You to Our Platinum Sponsors
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our local business partners help make our programs possible. Please support them!
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 flex items-center justify-center h-24 animate-pulse">
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : sponsors.length === 0 ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 flex items-center justify-center h-24">
                    <span className="material-symbols-outlined text-3xl text-gray-300">storefront</span>
                  </div>
                ))
              ) : (
                sponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl p-6 flex items-center justify-center h-24 hover:scale-105 transition-transform cursor-pointer shadow-lg"
                  >
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-12 max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold text-sm text-center">{sponsor.name}</span>
                    )}
                  </a>
                ))
              )}
            </div>
            <Link href="/sponsors" className="mt-4 text-white/80 hover:text-white underline text-sm">
              Become a Sponsor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
