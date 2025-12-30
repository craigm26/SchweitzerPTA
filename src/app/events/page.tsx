export default function EventsPage() {
  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      <div className="w-full bg-wildcat-black">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-wildcat-black via-transparent to-transparent"></div>
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
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] w-full">
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-wrap gap-3 items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-wildcat-black hidden md:block">October 2023</h3>
              <div className="flex gap-2 flex-wrap">
                {/* Filter buttons */}
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Calendar and event cards */}
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:w-80 shrink-0 flex flex-col gap-6">
            {/* Sponsor and newsletter signup */}
          </div>
        </div>
      </div>
    </main>
  );
}
