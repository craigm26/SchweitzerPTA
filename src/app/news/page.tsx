import Card from '@/components/Card';

export default function NewsPage() {
  return (
    <main className="layout-container flex h-full grow flex-col">
      <div className="px-4 md:px-10 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
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
                      placeholder="Search news or enter email..."
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
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcm_al54BDQA3ZLawV_0GKKDiXRvICjn8IlsB_Q9LFp3XW-cp8T9uUkj6KHPQd_DaROrSZORTtHHRQEdMFl9RduwcC9MNkdXdlh9PvR2qzLr1X9yD_qEwAwAsI5M9pwakl0Po_Sj1lVtSwp1jrmG4Lttr7AKtfEgMtose9ASE88_gTfnPwjvWH93BCmaD_sO-5VwE5yD4RQcsYXRuPGQ-1sBvs1NBWHv11skEHkF8V83i497Hnsud58hUiwA81flm7d3RLqoSRiPzy")',
                }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-8">
              <section>
                <div className="flex items-center gap-2 px-4 pb-3">
                  <span className="material-symbols-outlined text-primary">campaign</span>
                  <h3 className="text-[#181411] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                    Featured Story
                  </h3>
                </div>
                <a
                  className="group flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white dark:bg-[#2a221b] border border-transparent dark:border-gray-800 hover:border-primary/30 transition-all overflow-hidden"
                  href="/news/fall-carnival"
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-iTqD6UqcDkwHfyfQjNvO96I-__Aeruw9AVO3mvUxiLYxmO9YX6G5TB1u-UuCfvbY_8xJ9T8LZ-G1yan3MRjfxPon0HAUahU_cvT13Q7Gl2LgI3FHabgJYUtaKChXF45t04y6QNQ3Oks9y1jvQDSLf80jXSs2vcp5JGgHqzVH0TiseH9qvPDdOngWfydxYytPLNYBP8kM1Kau30tDc3EA7VJVFPJxMkJ5MXUAYs8fLS447LyD9J4YC15PxobvMqg3d3XtgkRlUjDd")',
                    }}
                  ></div>
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-6 relative bg-white dark:bg-[#2a221b]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold uppercase">
                        Events
                      </span>
                      <span className="text-[#8a7560] dark:text-gray-400 text-sm font-normal">Oct 12, 2023</span>
                    </div>
                    <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-2 group-hover:text-primary transition-colors">
                      Fall Carnival is Coming Soon!
                    </h2>
                    <p className="text-[#8a7560] dark:text-gray-300 text-base font-normal leading-relaxed mb-4">
                      Get ready for the biggest event of the year! Join us for games, food trucks, and fun for the whole
                      family. Tickets go on sale next week at the front office and online.
                    </p>
                    <div className="flex items-center justify-start">
                      <span className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-orange-600 text-white text-sm font-bold leading-normal transition-colors">
                        Read Full Story
                      </span>
                    </div>
                  </div>
                </a>
              </section>
              <section>
                <div className="flex items-center gap-2 px-4 pb-3 pt-4 border-b border-[#f5f2f0] dark:border-gray-800 mb-4 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">newspaper</span>
                    <h3 className="text-[#181411] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Recent Updates
                    </h3>
                  </div>
                  <a className="text-primary text-sm font-bold hover:underline" href="#">
                    View All
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {/* News Cards Here */}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
