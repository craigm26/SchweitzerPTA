'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getVolunteerOpportunities, getSponsors, signUpForVolunteer, VolunteerOpportunity, Sponsor } from '@/lib/api';

export default function VolunteerPage() {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [signupModal, setSignupModal] = useState<{ open: boolean; opportunity: VolunteerOpportunity | null }>({
    open: false,
    opportunity: null,
  });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '' });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [opportunitiesData, sponsorsData] = await Promise.all([
          getVolunteerOpportunities(),
          getSponsors({ level: 'platinum' }),
        ]);
        setOpportunities(opportunitiesData || []);
        setSponsors(sponsorsData?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getDateParts = (dateString: string | null) => {
    if (!dateString) return { month: 'VAR', day: '📅' };
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString().padStart(2, '0'),
    };
  };

  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'event':
        return 'bg-primary';
      case 'ongoing':
        return 'bg-green-600';
      case 'fundraiser':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      opp.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupModal.opportunity) return;

    setSignupLoading(true);
    try {
      await signUpForVolunteer({
        opportunity_id: signupModal.opportunity.id,
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
      });
      setSignupSuccess(true);
      setTimeout(() => {
        setSignupModal({ open: false, opportunity: null });
        setSignupForm({ name: '', email: '', phone: '' });
        setSignupSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="layout-container flex grow flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading opportunities...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="layout-container flex grow flex-col items-center">
      {/* Hero Section */}
      <section className="w-full px-4 py-6 md:px-10 md:py-8 flex justify-center">
        <div className="w-full max-w-[1200px] rounded-xl overflow-hidden relative min-h-[400px] flex flex-col items-center justify-center text-center p-8 gap-6 shadow-lg group">
          <div className="absolute inset-0 z-0">
            <img
              alt="School volunteering context"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjHvD4HJRFZ8Hpl-Sd_Tb2oCJ7lTgD6hcjkpjzediOkfL6MTuWKkIih3MQy274VFOKdSjd1hhFEnNE5nbWp26mQ1SYmnxFRBjQ2dF4qAfeMnuVLRozEWB3Lu3D7go2Nw9HZPxdaoJIJXROinGeX2azFqoBeav3crLPlrh7BK-IzakhYLivcF_d996rGbcT0JAeW3aQEt3LomY2QuiowwYfP7lzj6DV_7J6KdHIQ_qm36ri0CSH1GFoPbkoF-nUBgqqap8LMSuanKy5"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
            <div className="flex justify-center mb-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1 text-sm font-medium text-white ring-1 ring-white/30">
                <span className="material-symbols-outlined text-primary text-lg">volunteer_activism</span>
                Join the Wildcats
              </span>
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-md">
              Make Schweitzer Roar!
            </h1>
            <h2 className="text-white/90 text-lg md:text-xl font-normal leading-relaxed">
              Your time makes a huge difference in our students&apos; lives. Whether you have 30 minutes or 3 hours,
              there is a spot for you.
            </h2>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-4">
            <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-base font-bold shadow-lg hover:bg-orange-600 transition-transform active:scale-95">
              View Opportunities
            </button>
            <Link
              href="/about"
              className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-white text-[#181411] text-base font-bold shadow-lg hover:bg-gray-100 transition-transform active:scale-95"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      <section className="w-full px-4 py-12 md:px-10 flex justify-center">
        <div className="w-full max-w-[1200px]">
          {/* Header with filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-[#181411] dark:text-white text-2xl md:text-3xl font-bold">Volunteer Opportunities</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-[#181411] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>All Categories</option>
                <option>Event</option>
                <option>Ongoing</option>
                <option>Fundraiser</option>
              </select>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search events or roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-[#181411] dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Opportunity Cards Grid */}
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">volunteer_activism</span>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No opportunities found</h3>
              <p className="text-gray-500">Check back later for new volunteer opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => {
                const { month, day } = getDateParts(opp.date);
                const spotsLeft = opp.spots_available - opp.spots_filled;
                const isFull = spotsLeft <= 0;
                const isUrgent = spotsLeft > 0 && spotsLeft <= 3;

                return (
                  <div
                    key={opp.id}
                    className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`${getCategoryColor(opp.category)} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                        {opp.category || 'General'}
                      </span>
                      <div className="text-center">
                        <div className="text-gray-400 text-xs font-bold">{month}</div>
                        <div className="text-[#181411] dark:text-white text-lg font-bold">{day}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-[#181411] dark:text-white font-bold text-lg mb-2">{opp.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{opp.description}</p>

                    {/* Details */}
                    <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{opp.time_commitment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm ${isFull ? 'text-gray-400' : isUrgent ? 'text-red-500' : 'text-green-500'}`}>
                          {isFull ? 'block' : isUrgent ? 'warning' : 'check_circle'}
                        </span>
                        <span className={isFull ? 'text-gray-400' : isUrgent ? 'text-red-500' : 'text-green-500'}>
                          {isFull ? 'Full' : `${spotsLeft} spots left`}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => !isFull && setSignupModal({ open: true, opportunity: opp })}
                      disabled={isFull}
                      className={`mt-auto w-full py-3 rounded-lg font-bold text-sm transition-colors ${
                        isFull
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-primary hover:bg-orange-600 text-white'
                      }`}
                    >
                      {isFull ? 'Join Waitlist' : 'Sign Up Now'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {filteredOpportunities.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#181411] dark:hover:text-white font-medium transition-colors">
                Load More Opportunities
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Platinum Sponsors Section */}
      <section className="w-full px-4 py-12 md:px-10 bg-gray-50 dark:bg-[#181411]/50">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-8">
          <div className="text-center">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Community Partners</p>
            <h2 className="text-[#181411] dark:text-white text-2xl md:text-3xl font-bold">
              Thank You to Our Platinum Sponsors
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {sponsors.length === 0 ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg bg-white dark:bg-[#2a221a] shadow-sm flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-2xl text-gray-400">storefront</span>
                </div>
              ))
            ) : (
              sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 rounded-lg bg-white dark:bg-[#2a221a] shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  {sponsor.logo ? (
                    <img src={sponsor.logo} alt={sponsor.name} className="max-h-12 max-w-12 object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-gray-400">storefront</span>
                  )}
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Signup Modal */}
      {signupModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 max-w-md w-full shadow-xl">
            {signupSuccess ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                <h3 className="text-xl font-bold text-[#181411] dark:text-white mb-2">You're signed up!</h3>
                <p className="text-gray-500">We'll send you more details soon.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#181411] dark:text-white">Sign Up to Volunteer</h3>
                  <button
                    onClick={() => setSignupModal({ open: false, opportunity: null })}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  <strong>{signupModal.opportunity?.title}</strong>
                </p>
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {signupLoading ? 'Signing up...' : 'Confirm Sign Up'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
