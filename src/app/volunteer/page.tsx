export default function VolunteerPage() {
  const stats = [
    { icon: 'schedule', value: '1,200+', label: 'Hours Volunteered' },
    { icon: 'groups', value: '450', label: 'Parents Involved' },
    { icon: 'celebration', value: '25', label: 'Events Supported' },
  ];

  const opportunities = [
    {
      id: 1,
      title: 'Fall Carnival Booth',
      category: 'Event',
      categoryColor: 'bg-primary',
      date: { month: 'OCT', day: '24' },
      time: '4:00 PM - 6:00 PM (2 hrs)',
      location: 'School Playground',
      description: "Help run the ring toss and bean bag throw games! It's easy, fun, and you get to see all...",
      spots: { count: 3, urgent: false },
      action: { label: 'Sign Up Now', variant: 'primary' },
    },
    {
      id: 2,
      title: 'Library Helper',
      category: 'Ongoing',
      categoryColor: 'bg-green-600',
      date: { month: 'VAR', day: '📅' },
      time: 'Tue/Thu 8:30 AM - 10:00 AM',
      location: 'School Library',
      description: 'Assist Mrs. Johnson with shelving books and managing check-outs during the busy...',
      spots: { count: null, text: 'Open Availability', urgent: false },
      action: { label: 'View Shifts', variant: 'secondary' },
    },
    {
      id: 3,
      title: 'Silent Auction Prep',
      category: 'Fundraiser',
      categoryColor: 'bg-red-500',
      date: { month: 'NOV', day: '12' },
      time: '6:00 PM - 8:30 PM',
      location: 'Cafeteria',
      description: 'Help us organize and wrap gift baskets for the annual Silent Auction. Supplies provided!',
      spots: { count: 1, urgent: true },
      action: { label: 'Sign Up Now', variant: 'primary' },
    },
    {
      id: 4,
      title: 'Field Day Setup',
      category: 'Event',
      categoryColor: 'bg-primary',
      date: { month: 'MAY', day: '15' },
      time: '7:00 AM - 9:00 AM',
      location: 'Soccer Fields',
      description: 'Early risers needed! Help us set up the obstacle course, water stations, and tug-of-...',
      spots: { count: 10, urgent: false },
      action: { label: 'Sign Up Now', variant: 'primary' },
    },
    {
      id: 5,
      title: 'Chaperone - Zoo Trip',
      category: 'Full',
      categoryColor: 'bg-gray-400',
      date: { month: 'APR', day: '02' },
      time: '9:00 AM - 2:00 PM',
      location: 'Meet at Bus Loop',
      description: "Chaperone specifically for Mr. Smith's 3rd grade class field trip to the city zoo.",
      spots: { count: null, text: 'Full', urgent: false },
      action: { label: 'Join Waitlist', variant: 'disabled' },
    },
    {
      id: 6,
      title: 'Traffic Control',
      category: 'Ongoing',
      categoryColor: 'bg-green-600',
      date: { month: 'VAR', day: '📅' },
      time: 'Mon-Fri 7:30 AM - 8:00 AM',
      location: 'Main Entrance',
      description: 'Keep our Wildcats safe! Direct traffic during morning drop-off. High visibility vest...',
      spots: { count: null, text: 'Open Availability', urgent: false },
      action: { label: 'View Shifts', variant: 'secondary' },
    },
  ];

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
            <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-white text-[#181411] text-base font-bold shadow-lg hover:bg-gray-100 transition-transform active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full px-4 md:px-10 flex justify-center -mt-10 relative z-10">
        <div className="w-full max-w-[900px] bg-white dark:bg-[#2a221a] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center py-6 px-4">
              <span className="material-symbols-outlined text-primary text-2xl mb-2">{stat.icon}</span>
              <span className="text-[#181411] dark:text-white text-2xl md:text-3xl font-bold">{stat.value}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm uppercase tracking-wider mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      <section className="w-full px-4 py-12 md:px-10 flex justify-center">
        <div className="w-full max-w-[1200px]">
          {/* Header with filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-[#181411] dark:text-white text-2xl md:text-3xl font-bold">Volunteer Opportunities</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-[#181411] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
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
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] text-[#181411] dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Opportunity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`${opp.categoryColor} text-white text-xs font-bold px-2 py-1 rounded uppercase`}
                  >
                    {opp.category}
                  </span>
                  <div className="text-center">
                    <div className="text-gray-400 text-xs font-bold">{opp.date.month}</div>
                    <div className="text-[#181411] dark:text-white text-lg font-bold">{opp.date.day}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-[#181411] dark:text-white font-bold text-lg mb-2">{opp.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{opp.description}</p>

                {/* Details */}
                <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>{opp.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-sm ${opp.spots.urgent ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {opp.spots.urgent ? 'warning' : 'check_circle'}
                    </span>
                    <span className={opp.spots.urgent ? 'text-red-500' : 'text-green-500'}>
                      {opp.spots.text || `${opp.spots.count} spots left`}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`mt-auto w-full py-3 rounded-lg font-bold text-sm transition-colors ${
                    opp.action.variant === 'primary'
                      ? 'bg-primary hover:bg-orange-600 text-white'
                      : opp.action.variant === 'secondary'
                        ? 'border-2 border-primary text-primary hover:bg-primary/10'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={opp.action.variant === 'disabled'}
                >
                  {opp.action.label}
                </button>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-8">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#181411] dark:hover:text-white font-medium transition-colors">
              Load More Opportunities
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
          </div>
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-lg bg-white dark:bg-[#2a221a] shadow-sm flex items-center justify-center"
              >
                <div
                  className={`w-12 h-12 rounded flex items-center justify-center ${
                    i % 2 === 0 ? 'bg-gray-100' : 'bg-primary/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl text-gray-400">storefront</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
