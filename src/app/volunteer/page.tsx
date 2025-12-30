export default function VolunteerPage() {
  return (
    <main className="layout-container flex grow flex-col items-center">
      <section className="w-full px-4 py-6 md:px-10 md:py-8 flex justify-center">
        <div className="w-full max-w-[1200px] rounded-xl overflow-hidden relative min-h-[480px] flex flex-col items-center justify-center text-center p-8 gap-6 shadow-lg group">
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
              Your time makes a huge difference in our students' lives. Whether you have 30 minutes or 3 hours,
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
      {/* Other sections */}
    </main>
  );
}
