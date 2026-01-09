'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

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
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                href="/auction"
                className={`text-sm font-medium transition-colors ${
                  isActive('/auction') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                }`}
              >
                Auction
              </Link>
              <Link
                href="/calendar"
                className={`text-sm font-medium transition-colors ${
                  isActive('/calendar') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                }`}
              >
                Calendar
              </Link>
              <Link
                href="/resources"
                className={`text-sm font-medium transition-colors ${
                  isActive('/resources') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                }`}
              >
                Resources
              </Link>
              <Link
                            href="/donors"
                            className={`text-sm font-medium transition-colors ${
                              isActive('/donors') ? 'text-primary font-bold' : 'text-white/90 hover:text-primary'
                            }`}
                          >
                            Donors
                          </Link>            </nav>
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
              className={`text-2xl font-bold transition-colors ${
                isActive('/') ? 'text-primary' : 'text-white hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              href="/auction"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${
                isActive('/auction') ? 'text-primary' : 'text-white hover:text-primary'
              }`}
            >
              Auction
            </Link>
            <Link
              href="/calendar"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${
                isActive('/calendar') ? 'text-primary' : 'text-white hover:text-primary'
              }`}
            >
              Calendar
            </Link>
            <Link
              href="/resources"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${
                isActive('/resources') ? 'text-primary' : 'text-white hover:text-primary'
              }`}
            >
              Resources
            </Link>
            <Link
              href="/donors"
              onClick={() => setIsMenuOpen(false)}
              className={`text-base font-bold transition-colors ${
                isActive('/donors') ? 'text-primary' : 'text-white hover:text-primary'
              }`}
            >
              Donors
            </Link>
            <Link
              href="/volunteer"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold transition-colors ${
                isActive('/volunteer') ? 'text-primary' : 'text-white hover:text-primary'
              }`}
            >
              Volunteer
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
