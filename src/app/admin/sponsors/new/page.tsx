export default function AddSponsorPage() {
  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 sm:p-8 lg:p-12">
      <div className="flex items-center gap-2 mb-8 text-sm">
        <a className="text-gray-500 hover:text-primary transition-colors" href="/admin">
          Admin Panel
        </a>
        <span className="text-gray-600">/</span>
        <a className="text-gray-500 hover:text-primary transition-colors" href="/admin/sponsors">
          Sponsors
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-primary font-medium">Add Sponsor</span>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-2">Add New Sponsor</h1>
          <p className="text-gray-400 text-base max-w-2xl">
            Enter the details for the new sponsor below. These details will be visible on the public sponsor page.
          </p>
        </div>
      </div>
      <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-2xl relative">
        <form className="p-6 md:p-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                  Business Details
                </h3>
                {/* Form fields */}
              </div>
            </div>
            <div className="lg:col-span-1">
              {/* Logo upload */}
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border-dark flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-gray-300 font-medium hover:text-white hover:bg-white/5 transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary hover:bg-orange-600 text-white font-bold shadow-lg shadow-primary/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              type="submit"
            >
              <span className="material-symbols-outlined">save</span>
              Save Sponsor
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
