export default function LoginPage() {
  return (
    <div className="flex min-h-full w-full h-screen">
      <div className="relative hidden lg:flex w-1/2 flex-col items-center justify-center overflow-hidden bg-background-dark">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDo-oT4voG3c4Wun3S2Lpz5JsdJsIfT_B5u2KowdVsciD7kGkdlgP7Uwz3ZKxOa5P5hON7a-O4EHTnJNekOVj6Mh2Qu471AN2qFOrK5Rhf_pK74Yh8u9uYVGMFs7dalE0FxYigbAiBnR9WW1mLI9gd_y5XMSu0lGxMpsTjmycsaxz3JmBTNdFQxiDhEzapyPtU9pp6uDxVA4Nwj52DKd3-mgOhRBWzSzDHhrGaUbqJm2xynayUzavJDYo75RykjHy3O2LMu6XDT-dVB')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-background-dark/80 to-background-dark/90"></div>
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
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-[#1a120b] border-l border-[#f5f2f0] dark:border-white/5 h-full overflow-y-auto relative">
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="text-center lg:text-left">
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
                <input
                  className="block w-full rounded-xl border-0 py-4 pl-11 text-[#181411] shadow-sm ring-1 ring-inset ring-[#e6e0db] placeholder:text-[#8a7560]/70 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-base sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-primary transition-all"
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
                <input
                  className="block w-full rounded-xl border-0 py-4 pl-11 pr-10 text-[#181411] shadow-sm ring-1 ring-inset ring-[#e6e0db] placeholder:text-[#8a7560]/70 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-base sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-primary transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
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
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all transform active:scale-[0.98]"
                type="submit"
              >
                Log In
                <span className="material-symbols-outlined text-lg">login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
