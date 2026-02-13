'use client';
import { FormEvent, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeError, setSubscribeError] = useState('');
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubscribing) return;

    setSubscribeMessage('');
    setSubscribeError('');
    setIsSubscribing(true);

    try {
      const response = await fetch('/api/newsletter-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscribeEmail,
          source: 'header_nav',
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setSubscribeError(result.error || 'Unable to subscribe right now.');
        return;
      }

      setSubscribeMessage(result.alreadySubscribed ? 'Already subscribed' : 'Subscribed!');
      setSubscribeEmail('');
    } catch (error) {
      console.error('Newsletter subscribe request failed:', error);
      setSubscribeError('Unable to subscribe right now.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <header className="bg-background-dark sticky top-0 z-50 border-b-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
              <Link href="/" aria-label="Go to home page">
                <span className="material-symbols-outlined text-2xl">pets</span>
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <Link href="/" className="text-white text-lg font-bold leading-tight tracking-tight hover:text-primary transition-colors">
                Schweitzer Elementary
              </Link>
              <form onSubmit={handleSubscribe} className="hidden lg:flex items-center gap-2">
                <label htmlFor="header-subscribe-email" className="sr-only">
                  Email for newsletter subscription
                </label>
                <input
                  id="header-subscribe-email"
                  type="email"
                  required
                  value={subscribeEmail}
                  onChange={(event) => setSubscribeEmail(event.target.value)}
                  placeholder="Email for PTA News"
                  className="h-8 w-52 rounded-md border border-white/25 bg-white/10 px-3 text-xs text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="h-8 px-3 rounded-md text-xs font-bold bg-primary text-white hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? '...' : 'Subscribe'}
                </button>
              </form>
              <p className={`hidden lg:block text-xs ${subscribeError ? 'text-red-300' : 'text-green-300'} min-h-4`}>
                {subscribeError || subscribeMessage || ''}
              </p>
              <span className="text-primary text-xs font-bold uppercase tracking-wider lg:hidden">PTA</span>
            </div>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-end gap-6 items-center">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                  }`}
              >
                Home
              </Link>
              <Link
                href="/volunteer"
                className={`text-sm font-medium transition-colors ${isActive('/volunteer') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                  }`}
              >
                Volunteer
              </Link>
              <Link
                href="/auction"
                className={`text-sm font-medium transition-colors ${isActive('/auction') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                  }`}
              >
                Auction
              </Link>
              <Link
                href="/calendar"
                className={`text-sm font-medium transition-colors ${isActive('/calendar') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                  }`}
              >
                Calendar
              </Link>
              <Link
                href="/fundraisers"
                className={`text-sm font-medium transition-colors ${isActive('/fundraisers') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                  }`}
              >
                Fundraisers
              </Link>
              <Link
                href="/resources"
                className={`text-sm font-medium transition-colors ${isActive('/resources') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                  }`}
              >
                Resources
              </Link>
            </nav>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-sm md:hidden flex flex-col p-4 animate-in slide-in-from-top-10 duration-200">
          <div className="flex justify-end">
            <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
          <div className="mt-2 mb-6 rounded-lg border border-white/20 bg-white/5 p-3">
            <p className="text-white text-sm font-semibold mb-2">Get PTA updates</p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <label htmlFor="mobile-subscribe-email" className="sr-only">
                Email for newsletter subscription
              </label>
              <input
                id="mobile-subscribe-email"
                type="email"
                required
                value={subscribeEmail}
                onChange={(event) => setSubscribeEmail(event.target.value)}
                placeholder="Email for PTA News"
                className="h-9 flex-1 rounded-md border border-white/25 bg-white/10 px-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="h-9 px-3 rounded-md text-sm font-bold bg-primary text-white hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubscribing ? '...' : 'Join'}
              </button>
            </form>
            {(subscribeError || subscribeMessage) && (
              <p className={`mt-2 text-xs font-medium ${subscribeError ? 'text-red-300' : 'text-green-300'}`}>
                {subscribeError || subscribeMessage}
              </p>
            )}
          </div>
          <nav className="flex flex-col items-center gap-8 mt-10">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${isActive('/') ? 'text-primary' : 'text-white hover:text-primary'
                }`}
            >
              Home
            </Link>
            <Link
              href="/volunteer"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${isActive('/volunteer') ? 'text-primary' : 'text-white hover:text-primary'
                }`}
            >
              Volunteer
            </Link>
            <Link
              href="/auction"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${isActive('/auction') ? 'text-primary' : 'text-white hover:text-primary'
                }`}
            >
              Auction
            </Link>
            <Link
              href="/calendar"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${isActive('/calendar') ? 'text-primary' : 'text-white hover:text-primary'
                }`}
            >
              Calendar
            </Link>
            <Link
              href="/fundraisers"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${isActive('/fundraisers') ? 'text-primary' : 'text-white hover:text-primary'
                }`}
            >
              Fundraisers
            </Link>
            <Link
              href="/resources"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${isActive('/resources') ? 'text-primary' : 'text-white hover:text-primary'
                }`}
            >
              Resources
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
