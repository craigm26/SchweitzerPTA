export default function FallFestivalPage() {
  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Fall Festival
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Our biggest family night of the year — games, food, and fun for the whole
              Schweitzer community.
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[900px] w-full gap-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            About the Fall Festival
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            The Fall Festival brings Schweitzer families together for an evening of carnival
            games, treats, music, and community. Details for this year&apos;s festival —
            including the date, time, and how to volunteer — will be posted here soon.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Check back for updates, and watch our Events page and social media for
            announcements.
          </p>
        </div>
      </div>
    </main>
  );
}
