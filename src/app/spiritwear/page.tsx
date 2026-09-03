export default function SpiritwearPage() {
  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Spiritwear
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Show your Schweitzer pride with shirts and hoodies.
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[900px] w-full gap-6">
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Schweitzer spiritwear is a fun way for students and families to show their
            school pride&mdash;and every purchase helps support PTA programs and events
            throughout the year.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            Wear your spiritwear every Friday all year long!
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            T-shirts and hoodies are available for purchase at the school office.
            Venmo and exact cash are accepted.
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed space-y-1">
            <li>Youth T-shirts $15</li>
            <li>Youth Hoodies $30</li>
            <li>Adult T-shirts $23</li>
            <li>Adult Hoodies $38</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
