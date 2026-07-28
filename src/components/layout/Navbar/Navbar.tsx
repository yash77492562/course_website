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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
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
      <Link href="/" className="flex items-center no-underline gap-[10px]">
        <span className="font-display font-bold text-foreground text-[17px] tracking-[0.3px]">
          Riva Data
        </span>
      </Link>

      <ul className="hidden md:flex items-center list-none gap-[36px]">
        {/* Only show navigation links on homepage */}
        {isHomePage && (
          <>
            <li>
              <Link
                href="#about"
                className="no-underline transition-colors duration-200 hover:text-foreground text-[0.875rem] font-normal text-foreground/65 tracking-[0.3px]"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#programs"
                className="no-underline transition-colors duration-200 hover:text-foreground text-[0.875rem] font-normal text-foreground/65 tracking-[0.3px]"
              >
                Programs
              </Link>
            </li>
            <li>
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
                className="flex items-center gap-2 no-underline transition-all duration-200 hover:opacity-90 bg-primary px-4 py-2 rounded-md font-semibold text-[0.85rem] border-none cursor-pointer text-white"
              >
                <div
                  className="flex items-center justify-center rounded-full bg-white text-blue-600 font-bold w-[28px] h-[28px] text-[0.75rem]"
                >
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <span>{user.firstName || 'User'}</span>
                <svg
                  className={cn('w-4 h-4 transition-transform', isDropdownOpen && 'rotate-180')}
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
                  className="absolute right-0 mt-2 w-[240px] rounded-lg overflow-hidden z-[110] bg-[rgba(10,15,30,0.98)] border border-[rgba(14,165,233,0.4)] backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(14,165,233,0.2)]"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-[rgba(14,165,233,0.2)]">
                    <p className="text-[14px] font-semibold text-foreground m-0 mb-1">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[12px] text-foreground/50 m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/courses"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-200 no-underline transition-colors duration-200 hover:bg-blue-600/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      All Courses
                    </Link>

                    <Link
                      href="/my-courses"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-200 no-underline transition-colors duration-200 hover:bg-blue-600/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      My Courses
                    </Link>

                    <Link
                      href="/purchase-history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-200 no-underline transition-colors duration-200 hover:bg-blue-600/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      My History
                    </Link>
                  </div>

                  {/* Logout Section */}
                  <div className="py-1 border-t border-[rgba(14,165,233,0.2)]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-400 bg-transparent border-none cursor-pointer text-left transition-colors duration-200 hover:bg-red-600/20"
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

      {/* Mobile hamburger — visible only below md, where the desktop menu is hidden */}
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen((v) => !v)}
        className="md:hidden flex items-center justify-center text-foreground w-[40px] h-[40px] bg-transparent border-none cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute left-0 right-0 flex flex-col top-[68px] bg-background/98 backdrop-blur-[18px] border-b border-border px-[5vw] pt-3 pb-5 gap-1"
        >
          {isHomePage && (
            <>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground py-3 text-[15px]">About</a>
              <a href="#programs" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground py-3 text-[15px]">Programs</a>
              <a href="#consulting" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground py-3 text-[15px]">Consulting</a>
            </>
          )}

          {isAuthenticated && user ? (
            <>
              <div className="py-3 border-t border-[rgba(14,165,233,0.2)] mt-1">
                <p className="text-foreground font-semibold text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-foreground/50 text-xs truncate">{user.email}</p>
              </div>
              <Link href="/courses" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-foreground py-3 text-[15px]">All Courses</Link>
              <Link href="/my-courses" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-foreground py-3 text-[15px]">My Courses</Link>
              <Link href="/purchase-history" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-foreground py-3 text-[15px]">My History</Link>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 py-3 text-[15px] text-left border-t border-[rgba(14,165,233,0.2)] mt-1 bg-transparent cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-center rounded-md mt-2 bg-primary px-5 py-3 font-semibold text-[15px]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}