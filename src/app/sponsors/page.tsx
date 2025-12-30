export default function SponsorsPage() {
  return (
    <main className="flex-grow flex flex-col items-center w-full">
      <section className="w-full px-4 py-12 md:py-20 lg:px-8 bg-gradient-to-b from-white to-[#fdf8f4] dark:from-[#181411] dark:to-[#221910]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col-reverse gap-10 md:flex-row md:items-center md:gap-16">
            <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-[#181411] dark:text-white md:text-5xl lg:text-6xl">
                Thank You to Our Community Partners
              </h1>
              <p className="text-lg font-normal text-gray-600 dark:text-gray-300">
                Your generous support empowers our students and teachers to achieve great things. Together, we make
                Schweitzer Elementary a wonderful place to learn and grow. Go Wildcats!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <button className="flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5">
                  Become a Sponsor
                </button>
                <button className="flex h-12 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-8 text-base font-bold text-[#181411] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  View Benefits
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbguZ_2vXCEsCZAg_vcEZZ-rXrM7Ksz9P30FWJZUICgZgoaZ6s5fD1t7pIUSIXiSioOMmZSMe65bFWismAKCoinZDhNyY6H-f67EYXgzojCTaGEv2dvcIFnI5frdoWyKXsFeXZuGye1qc_FgBA3WSoGB6wwk_2xIOKShbUSKEEkuIPeuGgIhQT2vlIaQJNKR2wkQ8MCxR6s1hhXcAOcUXWb7diwiJ7Hpt8MHaYbyFcnxbFUTWIlPiHQljN4I2v2F-a128PDoHgSZah')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full max-w-6xl px-4 pb-20 pt-10 lg:px-8">
        {/* Sponsor sections go here */}
      </div>
    </main>
  );
}
