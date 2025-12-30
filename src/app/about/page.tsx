import Image from 'next/image';

export default function AboutPage() {
  const boardMembers = [
    {
      name: 'Jane Doe',
      role: 'President',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJTWRN8t7-mVWQQ9PJlC3xqXx8JmC3xqXx8JmC3xqXx8JmC3xqXx8Jm',
    },
    {
      name: 'John Smith',
      role: 'Vice President',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJTWRN8t7-mVWQQ9PJlC3xqXx8JmC3xqXx8JmC3xqXx8JmC3xqXx8Jm',
    },
    {
      name: 'Mary Johnson',
      role: 'Treasurer',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJTWRN8t7-mVWQQ9PJlC3xqXx8JmC3xqXx8JmC3xqXx8JmC3xqXx8Jm',
    },
    {
      name: 'Robert Lee',
      role: 'Secretary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJTWRN8t7-mVWQQ9PJlC3xqXx8JmC3xqXx8JmC3xqXx8JmC3xqXx8Jm',
    },
  ];

  const goldSponsors = [
    { name: 'Alpha Realty', logo: '🏠' },
    { name: 'Local Market', logo: '🛒' },
    { name: 'TechSol', logo: '💎' },
    { name: 'The Diner', logo: '🍽️' },
  ];

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

          {/* Our Mission Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight">Our Mission</h2>
              <div className="flex flex-col gap-4 text-[#181411]/80 dark:text-gray-300">
                <p className="text-base leading-relaxed">
                  The Schweitzer PTA is committed to enhancing the educational experience for every child. We bridge
                  the gap between home and school by recruiting volunteers, sponsoring enrichment programs, and
                  fundraising for school improvements.
                </p>
                <p className="text-base leading-relaxed">
                  We believe that when parents and teachers work together, our &quot;Little Wildcats&quot; can achieve anything.
                </p>
              </div>
              <a href="#" className="text-primary font-bold hover:underline flex items-center gap-1 w-fit">
                Read our full Bylaws <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
              <span className="text-gray-500 text-sm italic">2024-2025 School Year</span>
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
                      1234 School Spirit Way
                      <br />
                      Anytown, ST 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Email Us</h4>
                    <p className="text-white/70 text-sm">contact@schweitzerpta.org</p>
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
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">language</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">group</span>
                </a>
              </div>
            </div>
            {/* Right side - Contact Form */}
            <div className="bg-white dark:bg-[#2a221a] p-8 md:p-10">
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#181411] dark:text-white">Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Parent"
                      className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#181411] dark:text-white">Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#181411] dark:text-white">Subject</label>
                  <select className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
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
                    className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  Send Message
                </button>
              </form>
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
                <a
                  href="/volunteer"
                  className="bg-[#181411] hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Become a Volunteer
                </a>
                <a
                  href="/events"
                  className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-6 rounded-lg transition-colors border-2 border-white"
                >
                  View Calendar
                </a>
              </div>
            </div>
          </section>

          {/* Gold Sponsors Section */}
          <section className="flex flex-col items-center gap-8 py-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Thank You to Our Gold Sponsors</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {goldSponsors.map((sponsor, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-2xl grayscale opacity-60">{sponsor.logo}</span>
                  <span className="font-bold text-lg">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
