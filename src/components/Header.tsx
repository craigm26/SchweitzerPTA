'use client';

import Link from 'next/link';
import getStripe from '@/utils/stripe';

const Header = () => {
  return (
    <header className="bg-background-dark sticky top-0 z-50 border-b-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">pets</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Schweitzer Elementary</h1>
              <span className="text-primary text-xs font-bold uppercase tracking-wider">PTA</span>
            </div>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-white/90 hover:text-primary transition-colors text-sm font-medium">
                Home
              </Link>
              <Link href="/news" className="text-primary font-bold text-sm">
                News
              </Link>
              <Link href="/events" className="text-white/90 hover:text-primary transition-colors text-sm font-medium">
                Events
              </Link>
              <Link href="/sponsors" className="text-white/90 hover:text-primary transition-colors text-sm font-medium">
                Sponsors
              </Link>
            </nav>
            <button
              className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-5 bg-primary hover:bg-orange-600 transition-colors text-white text-sm font-bold shadow-md"
              onClick={async () => {
                const res = await fetch('/api/donate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ amount: 50 }),
                });
                const { id } = await res.json();
                const stripe = await getStripe();
                stripe?.redirectToCheckout({ sessionId: id });
              }}
            >
              <span>Donate</span>
            </button>
            <Link href="/admin" className="text-white/90 hover:text-primary transition-colors text-sm font-medium">
              Admin Login
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
