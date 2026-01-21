import Image from 'next/image';

export default function VolunteerPage() {
  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20"></div>
          <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Volunteer
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Help make Schweitzer Elementary the best it can be
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[800px] w-full gap-8">
          {/* APEX Fun Run Section */}
          <section className="bg-white dark:bg-[#2a221a] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-[#181411] dark:text-white text-2xl md:text-3xl font-bold mb-4">
              APEX Fun Run, Thursday January 29th
            </h2>

            <div className="text-[#181411]/80 dark:text-gray-300 text-base leading-relaxed space-y-4">
              <p>
                APEX is back this year to help make our Fun Run another big success. We need adult volunteers to help count laps. Join us in making this year the best one yet!
              </p>

              <p>
                <a
                  href="https://www.signupgenius.com/go/20F0944A5A823A1FF2-apex1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-bold hover:underline"
                >
                  Sign up here
                </a>
              </p>
            </div>

            {/* APEX Fun Run Image */}
            <div className="mt-6">
              <Image
                src="/apex-fun-run.png"
                alt="APEX Fun Run Fundraiser - Level Up! Fundraiser Kickoff Monday January 20, Fun Run Day Thursday January 29. Grades 3-5: 9:15-10:15, TK-2nd Grade: 10:40-11:40. Students collect pledges per lap (up to 42 laps) or a flat donation."
                width={500}
                height={600}
                className="rounded-lg shadow-md mx-auto"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
