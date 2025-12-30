export default function NewsManagementPage() {
  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-8 flex flex-col gap-6 z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl font-black tracking-tight">
            News Management
          </h1>
          <p className="text-[#637588] dark:text-[#baab9c] text-base font-normal max-w-2xl">
            Create, edit, and manage school announcements and sponsor shoutouts for the Wildcat community.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20 shrink-0">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Create New Article</span>
        </button>
      </div>
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-[#e5e7eb] dark:border-border-dark shadow-sm overflow-hidden flex-1">
        {/* Table for news articles */}
      </div>
    </div>
  );
}
