export default function UserManagementPage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-8 relative z-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            User &amp; Role Management
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            View, edit, and invite administrators to the PTA portal.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-700 focus:ring-4 focus:ring-orange-500/30">
          <span className="material-symbols-outlined text-[20px]">mail</span>
          <span>Invite New Administrator</span>
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {/* Table for users */}
      </div>
    </div>
  );
}
