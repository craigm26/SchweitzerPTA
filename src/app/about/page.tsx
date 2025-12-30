export default function AboutPage() {
  return (
    <div className="layout-container flex grow flex-col">
      <div className="flex flex-1 justify-center py-5 px-4 md:px-10 lg:px-40">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-12">
          <div className="@container">
            <div
              className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 md:p-16 min-h-[400px] relative overflow-hidden shadow-lg"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqk9fLQRXC4HSR0ddDVNA0FWWoyDgDgL30uVdVBmKCMDfOwZEWsDDBwNWbwc7Da7fKvoKqROpgnSITGeReb-EDnbSfWYeovj_pXJxfD5h5l_UbJSbHleSUSPcAWNs9vFmAvX2lvsxsh44QTpR2WRh5TEStkrmrxECTmsdURxrPo7C8ZbMniTDHB3p4sy5qJ8KN56VueJr3Nk2W4hnJ_T257N4WMeSftR4Odc4kFCEOT7NhCO6sCakDlzLfYHKsHSWb8aOcPLs5z6fd")',
              }}
            >
              <div className="flex flex-col gap-4 text-center z-10 max-w-2xl">
                <div className="mx-auto bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 w-fit">
                  Go Wildcats!
                </div>
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                  Dedicated to Schweitzer Elementary Students &amp; Staff
                </h1>
                <p className="text-white/90 text-lg font-medium leading-relaxed">
                  Connecting parents, teachers, and students for a brighter future through advocacy, support, and
                  community building.
                </p>
              </div>
            </div>
          </div>
          {/* Main content */}
        </div>
      </div>
    </div>
  );
}
