'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/utils';
import { useAuth } from '@/hooks/auth/useAuth';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Check if we're on the homepage
  const isHomePage = pathname === '/';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    router.push('/');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-[68px]',
      'backdrop-blur-[18px] border-b border-[rgba(14,165,233,0.12)] transition-all duration-300',
      'bg-background/90 px-6 md:px-12 lg:px-20'
    )}>
      <Link href="/" className="flex flex-col items-center justify-center no-underline">
        <span className="font-display font-bold text-foreground text-[17px] tracking-[0.3px] leading-[1.1]">
          Riva Data
        </span>
        <span className="font-sans font-semibold text-primary text-[9px] tracking-[0.25em] uppercase leading-none pl-[1px]">
          Academy
        </span>
      </Link>

      <ul className="flex items-center list-none gap-2 md:gap-[36px] m-0 p-0">
        {/* Only show navigation links on homepage */}
        {isHomePage && (
          <>
            <li className="hidden md:block">
              <Link
                href="#about"
                className="no-underline transition-colors duration-200 hover:text-foreground text-[0.875rem] font-normal text-foreground/65 tracking-[0.3px]"
              >
                About
              </Link>
            </li>
            <li className="hidden md:block">
              <Link
                href="#programs"
                className="no-underline transition-colors duration-200 hover:text-foreground text-[0.875rem] font-normal text-foreground/65 tracking-[0.3px]"
              >
                Programs
              </Link>
            </li>
            <li className="hidden md:block">
              <Link
                href="#consulting"
                className="no-underline transition-colors duration-200 hover:text-foreground text-[0.875rem] font-normal text-foreground/65 tracking-[0.3px]"
              >
                Consulting
              </Link>
            </li>
          </>
        )}

        {/* User Profile Dropdown or Login Button */}
        {isAuthenticated && user ? (
          <li className="relative">
            <div ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 no-underline transition-all duration-200 hover:opacity-80 bg-transparent md:bg-primary px-1 py-1 md:px-4 md:py-2 rounded-full md:rounded-md font-semibold text-[0.9rem] border-none cursor-pointer text-slate-800 md:text-white"
              >
                <div
                  className="flex items-center justify-center rounded-full bg-blue-600 md:bg-white text-white md:text-blue-600 font-bold w-[36px] h-[36px] md:w-[28px] md:h-[28px] text-[0.85rem] md:text-[0.75rem]"
                >
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <span className="hidden md:inline">{user.firstName || 'User'}</span>
                <svg
                  className={cn('w-4 h-4 transition-transform hidden md:block', isDropdownOpen && 'rotate-180')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-[240px] rounded-xl overflow-hidden z-[110] bg-white/95 border border-slate-200/60 backdrop-blur-xl shadow-xl"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-slate-200/60">
                    <p className="text-[14px] font-semibold text-slate-800 m-0 mb-1">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[12px] text-slate-500 m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/courses"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 no-underline transition-colors duration-200 hover:bg-slate-50 hover:text-primary"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      All Courses
                    </Link>

                    <Link
                      href="/my-courses"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 no-underline transition-colors duration-200 hover:bg-slate-50 hover:text-primary"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      My Courses
                    </Link>

                    <Link
                      href="/purchase-history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 no-underline transition-colors duration-200 hover:bg-slate-50 hover:text-primary"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      My History
                    </Link>
                  </div>

                  {/* Logout Section */}
                  <div className="py-1 border-t border-slate-200/60">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-500 bg-transparent border-none cursor-pointer text-left transition-colors duration-200 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ) : (
          <li>
            <Link
              href="/login"
              className="text-white no-underline transition-opacity duration-200 hover:opacity-88 bg-primary px-5 py-2 rounded-md font-semibold text-[0.85rem] inline-block"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}