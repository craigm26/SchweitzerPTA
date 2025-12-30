export default function SponsorManagementPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <a className="hover:text-primary transition-colors" href="/admin">
            Admin
          </a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-medium text-gray-900 dark:text-white">Sponsors</span>
        </div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Sponsor Management
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage partnerships, track contributions, and update sponsor visibility.
            </p>
          </div>
          <button className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
            <span className="material-symbols-outlined">add</span>
            Add New Sponsor
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-card-light shadow-sm dark:border-white/10 dark:bg-card-dark">
        {/* Table for sponsors */}
      </div>
    </div>
  );
}
