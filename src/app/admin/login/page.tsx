import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-full w-full h-screen">
      {/* Left Panel - Branding */}
      <div className="relative hidden lg:flex w-1/2 flex-col items-center justify-center overflow-hidden bg-[#181411]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDo-oT4voG3c4Wun3S2Lpz5JsdJsIfT_B5u2KowdVsciD7kGkdlgP7Uwz3ZKxOa5P5hON7a-O4EHTnJNekOVj6Mh2Qu471AN2qFOrK5Rhf_pK74Yh8u9uYVGMFs7dalE0FxYigbAiBnR9WW1mLI9gd_y5XMSu0lGxMpsTjmycsaxz3JmBTNdFQxiDhEzapyPtU9pp6uDxVA4Nwj52DKd3-mgOhRBWzSzDHhrGaUbqJm2xynayUzavJDYo75RykjHy3O2LMu6XDT-dVB')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-[#181411]/80 to-[#181411]/90"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-2xl">
          <div className="mb-8 p-6 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl">
            <span className="material-symbols-outlined text-8xl text-primary drop-shadow-lg">pets</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
            Schweitzer Elementary
          </h1>
          <p className="text-xl text-white/90 font-light leading-relaxed max-w-lg mx-auto">
            Home of the Wildcats! Empowering students, supporting teachers, and building a stronger community.
          </p>
          {/* Carousel dots */}
          <div className="flex gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 flex-col justify-between items-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-[#1a120b] border-l border-[#f5f2f0] dark:border-white/5 h-full overflow-y-auto relative">
        {/* Decorative corner pattern */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full text-primary/20">
            <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
            <rect fill="url(#pattern)" width="200" height="200" />
          </svg>
        </div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          {/* PTA Admin Portal Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">shield</span>
            </div>
            <span className="font-bold text-[#181411] dark:text-white">PTA Admin Portal</span>
          </div>

          <div className="text-left">
            <h2 className="text-4xl font-bold tracking-tight text-[#181411] dark:text-white leading-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-base text-[#8a7560] dark:text-gray-400">
              Please sign in to manage news, events, and sponsors.
            </p>
          </div>

          <form action="#" className="space-y-6">
            <div className="space-y-2">
              <label
                className="block text-sm font-medium leading-6 text-[#181411] dark:text-gray-200"
                htmlFor="username"
              >
                Username or Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-xl">mail</span>
                </div>
                <input
                  className="block w-full rounded-xl border-0 py-4 pl-12 text-[#181411] shadow-sm ring-1 ring-inset ring-[#e6e0db] placeholder:text-[#8a7560]/70 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-base sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-primary transition-all"
                  id="username"
                  name="username"
                  placeholder="user@schweitzerpta.org"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium leading-6 text-[#181411] dark:text-gray-200"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                </div>
                <input
                  className="block w-full rounded-xl border-0 py-4 pl-12 pr-12 text-[#181411] shadow-sm ring-1 ring-inset ring-[#e6e0db] placeholder:text-[#8a7560]/70 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-base sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-primary transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">visibility</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary bg-transparent dark:border-white/20 dark:bg-white/5 dark:checked:bg-primary"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-[#181411] dark:text-gray-300" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a className="font-medium text-primary hover:text-primary/80 transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg shadow-primary/30 hover:bg-orange-600 hover:shadow-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all transform active:scale-[0.98]"
                type="submit"
              >
                Log In
                <span className="material-symbols-outlined text-lg">login</span>
              </button>
            </div>
          </form>

          {/* Not an administrator link */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Not an administrator?{' '}
              <Link href="/" className="font-bold text-[#181411] dark:text-white hover:text-primary transition-colors">
                Return to Home
              </Link>
            </p>
          </div>

          {/* Footer links */}
          <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-3">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
          </div>
        </div>

        {/* Secure connection badge */}
        <div className="mt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <span className="material-symbols-outlined text-green-600 text-sm">lock</span>
            <span className="text-xs text-green-700 dark:text-green-400 font-medium">Secure 256-bit Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
