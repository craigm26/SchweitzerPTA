'use client';
import { useState } from 'react';

import Link from 'next/link';
import getStripe from '@/utils/stripe';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-background-dark sticky top-0 z-50 border-b-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">pets</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Schweitzer Elementary</h1>
              <span className="text-primary text-xs font-bold uppercase tracking-wider">PTA</span>
            </div>
          </Link>
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
                (stripe as any)?.redirectToCheckout({ sessionId: id });
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
          <nav className="flex flex-col items-center gap-8 mt-10">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/news"
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              News
            </Link>
            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              href="/sponsors"
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              Sponsors
            </Link>
            <Link
              href="/volunteer"
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              Volunteer
            </Link>
            <button
              className="flex items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary hover:bg-orange-600 transition-colors text-white text-lg font-bold shadow-md w-full max-w-xs"
              onClick={async () => {
                setIsMenuOpen(false);
                const res = await fetch('/api/donate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ amount: 50 }),
                });
                const { id } = await res.json();
                const stripe = await getStripe();
                (stripe as any)?.redirectToCheckout({ sessionId: id });
              }}
            >
              <span>Donate</span>
            </button>
            <Link
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="text-white/60 text-sm font-medium hover:text-white mt-8"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
