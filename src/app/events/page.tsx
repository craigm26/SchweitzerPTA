export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: 'General PTA Meeting',
      date: { month: 'OCT', day: '05' },
      time: '6:00 PM - 7:30 PM',
      location: 'School Library',
      description:
        'Join us to discuss upcoming budget plans and the winter carnival. Childcare provided in the gym.',
      type: 'meeting',
      action: { label: 'RSVP Now', variant: 'primary' },
    },
    {
      id: 2,
      title: 'Fall Harvest Festival',
      date: { month: 'OCT', day: '12' },
      time: '4:00 PM - 8:00 PM',
      location: 'School Playground',
      description:
        'Games, prizes, food trucks, and the famous pumpkin walk! All proceeds go to the new science lab.',
      type: 'fundraiser',
      badge: 'Fundraiser',
      action: { label: 'Buy Tickets', variant: 'primary' },
    },
    {
      id: 3,
      title: 'Parent-Teacher Coffee',
      date: { month: 'OCT', day: '24' },
      time: '8:30 AM - 9:30 AM',
      location: 'Cafeteria',
      description: 'Casual meetup with Principal Johnson. Coffee and donuts provided by StarCafe.',
      type: 'social',
      action: { label: 'Add to Calendar', variant: 'secondary' },
    },
  ];

  const calendarDays = [
    { day: '', events: false },
    { day: '', events: false },
    { day: '', events: false },
    { day: '', events: false },
    { day: '', events: false },
    { day: '', events: false },
    { day: '', events: false },
    { day: 1, events: false },
    { day: 2, events: false },
    { day: 3, events: false },
    { day: 4, events: false },
    { day: 5, events: true, highlight: true },
    { day: 6, events: false },
    { day: 7, events: false },
    { day: 8, events: false },
    { day: 9, events: false },
    { day: 10, events: false },
    { day: 11, events: false },
    { day: 12, events: true },
    { day: 13, events: false },
    { day: 14, events: false },
    { day: 15, events: false },
    { day: 16, events: false },
    { day: 17, events: false },
    { day: 18, events: false },
    { day: 19, events: false },
    { day: 20, events: false },
    { day: 21, events: false },
    { day: 22, events: false },
    { day: 23, events: false },
    { day: 24, events: true },
    { day: 25, events: false },
    { day: 26, events: false },
    { day: 27, events: false },
    { day: 28, events: false },
    { day: 29, events: false },
    { day: 30, events: false },
    { day: 31, events: false },
  ];

  const filters = ['All Events', 'PTA Meetings', 'Fundraisers', 'Social'];

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
              <span className="material-symbols-outlined text-sm">event</span> School Year 2023-2024
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Upcoming Events &amp; Activities
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Join us for PTA meetings, school spirit events, and community fundraisers! Stay involved and help our
              Wildcats roar.
            </h2>
            <div className="mt-4 flex gap-3">
              <button className="flex cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-orange-600 text-white text-base font-bold transition-all shadow-lg shadow-orange-900/50">
                <span className="mr-2 material-symbols-outlined text-[20px]">calendar_add_on</span>
                Subscribe to Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] w-full">
          {/* Main content area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Header with filters */}
            <div className="flex flex-wrap gap-3 items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-[#181411] dark:text-white hidden md:block">October 2023</h3>
              <div className="flex gap-2 flex-wrap">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      index === 0
                        ? 'bg-[#181411] dark:bg-white text-white dark:text-[#181411]'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar and Events Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Calendar Widget */}
              <div className="xl:col-span-2 bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
                <div className="flex items-center justify-between mb-4">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <span className="material-symbols-outlined text-gray-500">chevron_left</span>
                  </button>
                  <span className="font-bold text-[#181411] dark:text-white">October 2023</span>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="py-2 text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((d, i) => (
                    <div
                      key={i}
                      className={`py-2 rounded-full relative cursor-pointer transition-colors ${
                        d.highlight
                          ? 'bg-primary text-white font-bold'
                          : d.events
                            ? 'text-primary font-bold hover:bg-primary/10'
                            : d.day
                              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#181411] dark:text-white'
                              : ''
                      }`}
                    >
                      {d.day}
                      {d.events && !d.highlight && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                    <div>
                      <p className="font-medium text-[#181411] dark:text-white">Did you know?</p>
                      <p className="text-xs mt-1">
                        You can sync these events directly to your phone calendar by clicking &quot;Subscribe&quot;.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Cards */}
              <div className="xl:col-span-3 flex flex-col gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4"
                  >
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center w-16 shrink-0">
                      <span className="text-primary text-xs font-bold uppercase">{event.date.month}</span>
                      <span className="text-[#181411] dark:text-white text-2xl font-bold">{event.date.day}</span>
                    </div>
                    {/* Event Details */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[#181411] dark:text-white font-bold text-lg">{event.title}</h4>
                        {event.badge && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-md uppercase">
                            {event.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span> {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span> {event.location}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{event.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            event.action.variant === 'primary'
                              ? 'bg-primary hover:bg-orange-600 text-white'
                              : 'border border-primary text-primary hover:bg-primary/10'
                          }`}
                        >
                          {event.action.label}
                        </button>
                        <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <span className="material-symbols-outlined text-gray-500 text-lg">share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0 flex flex-col gap-6">
            {/* Community Partners Card */}
            <div className="bg-[#181411] text-white rounded-xl p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">volunteer_activism</span>
                </div>
                <h4 className="text-lg font-bold text-center">Community Partners</h4>
                <p className="text-gray-400 text-sm text-center">
                  A huge thank you to our 2023-2024 Platinum Sponsors for supporting our Wildcats!
                </p>
                <div className="flex flex-col gap-3 w-full">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg p-3 flex items-center justify-center h-12"
                    >
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          i === 1 ? 'bg-orange-100' : i === 2 ? 'bg-gray-100' : 'bg-teal-100'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {i === 1 ? 'storefront' : i === 2 ? 'gite' : 'psychiatry'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/sponsors" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                  Become a Sponsor <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-[#181411] dark:text-white mb-2">Stay in the Loop</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Get the weekly Wildcat Tales newsletter delivered to your inbox.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Parent's Email"
                  className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181411] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <button className="w-full bg-[#181411] dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-[#181411] font-bold py-3 px-4 rounded-lg transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
