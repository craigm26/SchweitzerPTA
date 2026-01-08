'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { submitContactForm, getSponsors, Sponsor } from '@/lib/api';

export default function AboutPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [goldSponsors, setGoldSponsors] = useState<Sponsor[]>([]);
  const [sponsorsLoading, setSponsorsLoading] = useState(true);

  const boardMembers = [
    { name: 'Jane Doe', role: 'President' },
    { name: 'John Smith', role: 'Vice President' },
    { name: 'Mary Johnson', role: 'Treasurer' },
    { name: 'Robert Lee', role: 'Secretary' },
  ];

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const sponsors = await getSponsors({ level: 'gold' });
        setGoldSponsors(sponsors || []);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setSponsorsLoading(false);
      }
    }
    fetchSponsors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactForm(contactForm);
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout-container flex grow flex-col">
      <div className="flex flex-1 justify-center py-5 px-4 md:px-10 lg:px-20">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-16">
          {/* Hero Section */}
          <div className="@container">
            <div
              className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 md:p-16 min-h-[400px] relative overflow-hidden shadow-lg"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqk9fLQRXC4HSR0ddDVNA0FWWoyDgDgL30uVdVBmKCMDfOwZEWsDDBwNWbwc7Da7fKvoKqROpgnSITGeReb-EDnbSfWYeovj_pXJxfD5h5l_UbJSbHleSUSPcAWNs9vFmAvX2lvsxsh44QTpR2WRh5TEStkrmrxECTmsdURxrPo7C8ZbMniTDHB3p4sy5qJ8KN56VueJr3Nk2W4hnJ_T257N4WMeSftR4Odc4kFCEOT7NhCO6sCakDlzLfYHKsHSWb8aOcPLs5z6fd")',
              }}
            >
              <div className="flex flex-col gap-4 text-center z-10 max-w-2xl">
                <div className="mx-auto bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 w-fit">
                  Go Wildcats!
                </div>
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                  Dedicated to Schweitzer Elementary Students &amp; Staff
                </h1>
                <p className="text-white/90 text-lg font-medium leading-relaxed">
                  Connecting parents, teachers, and students for a brighter future through advocacy, support, and
                  community building.
                </p>
              </div>
            </div>
          </div>

          {/* Join PTA Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight">Join PTA</h2>
              <div className="flex flex-col gap-4 text-[#181411]/80 dark:text-gray-300">
                <p className="text-base leading-relaxed font-semibold">
                  Who can join? Parents, Guardians, Grandparents, Teachers/Staff, Alumni, Friends, and Family.
                </p>
                <p className="text-base leading-relaxed">
                  The PTA uses membership fees and fundraising dollars to directly enhance student
                  learning – supporting classroom stipends, field trips, performing arts, campus
                  improvements, and technology upgrades.
                </p>
              </div>
              <a 
                href="https://jointotem.com/ca/carmichael/albert-schweitzer-elementary-pta" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline flex items-center gap-1 w-fit"
              >
                Join Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
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
                  <span className="material-symbols-outlined text-8xl text-primary/60">diversity_3</span>
                </div>
              </div>
            </div>
          </section>

          {/* Meet Your PTA Board Section */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">Meet Your PTA Board</h2>
              <span className="text-gray-500 text-sm italic">{new Date().getFullYear()}-{new Date().getFullYear() + 1} School Year</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {boardMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center gap-3 text-center">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
                    <div
                      className="w-full h-full bg-cover bg-center flex items-center justify-center"
                      style={{ backgroundColor: ['#e8d5b7', '#d4c4a8', '#c9b99a', '#bfaf8c'][index] }}
                    >
                      <span className="material-symbols-outlined text-4xl text-gray-600">person</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#181411] dark:text-white font-bold">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-lg">
            {/* Left side - Contact Info */}
            <div className="bg-[#181411] text-white p-8 md:p-10 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
                <p className="text-white/70 text-sm">
                  Have questions about upcoming events or how to join? Send us a message.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">School Address</h4>
                    <p className="text-white/70 text-sm">
                      4350 Glenridge Drive
                      <br />
                      Carmichael, CA 95608
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Email Us</h4>
                    <p className="text-white/70 text-sm">AlbertSchweitzerPTA@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Office Hours</h4>
                    <p className="text-white/70 text-sm">Mon - Fri: 8:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://www.facebook.com/schweitzer.elementary/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/schweitzer_elementary/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                  </svg>
                </a>
              </div>
            </div>
            {/* Right side - Contact Form */}
            <div className="bg-white dark:bg-[#2a221a] p-8 md:p-10">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                  <h3 className="text-xl font-bold text-[#181411] dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-center">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#181411] dark:text-white">Full Name</label>
                      <input
                        type="text"
                        placeholder="Jane Parent"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#181411] dark:text-white">Email Address</label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#181411] dark:text-white">Subject</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>General Inquiry</option>
                      <option>Membership</option>
                      <option>Volunteering</option>
                      <option>Donations</option>
                      <option>Events</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#181411] dark:text-white">Message</label>
                    <textarea
                      rows={4}
                      placeholder="How can we help?"
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    ></textarea>
                  </div>
                  {submitError && (
                    <p className="text-red-500 text-sm">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Want to Get Involved CTA */}
          <section className="rounded-xl bg-gradient-to-r from-primary to-orange-500 p-8 md:p-12 text-center">
            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">volunteer_activism</span>
              </div>
              <h2 className="text-white text-3xl font-bold">Want to Get Involved?</h2>
              <p className="text-white/90">
                Whether it&apos;s volunteering for an hour at the book fair, joining a planning committee, or simply
                attending our monthly meetings, your involvement makes our Wildcat community stronger.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/volunteer"
                  className="bg-[#181411] hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Become a Volunteer
                </Link>
                <Link
                  href="/events"
                  className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-6 rounded-lg transition-colors border-2 border-white"
                >
                  View Calendar
                </Link>
              </div>
            </div>
          </section>

          {/* Gold Sponsors Section */}
          <section className="flex flex-col items-center gap-8 py-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Thank You to Our Gold Sponsors</p>
            {sponsorsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : goldSponsors.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No gold sponsors at this time.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {goldSponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website || '#'}
                    target={sponsor.website ? '_blank' : undefined}
                    rel={sponsor.website ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    {sponsor.logo ? (
                      <span className="text-2xl">{sponsor.logo}</span>
                    ) : (
                      <span className="text-2xl grayscale opacity-60">🏢</span>
                    )}
                    <span className="font-bold text-lg">{sponsor.name}</span>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
