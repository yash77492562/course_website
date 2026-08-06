'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/utils';

export function AuthNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    // Not logged in - show only logo (matching original navbar style)
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-[18px] border-b transition-all duration-300 bg-background/90 border-border h-[68px] px-[5vw]">
        <Link href="/" className="flex flex-col items-center justify-center no-underline">
          <span className="font-bold text-foreground text-[17px] tracking-[0.3px] font-display leading-[1.1]">
            Riva Data
          </span>
          <span className="font-sans font-semibold text-primary text-[9px] tracking-[0.25em] uppercase leading-none pl-[1px]">
            Academy
          </span>
        </Link>
      </nav>
    );
  }

  // Logged in - show logo + user menu
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-[18px] border-b transition-all duration-300 bg-background/90 border-border h-[68px] px-[5vw]">
      <Link href="/" className="flex flex-col items-center justify-center no-underline">
        <span className="font-bold text-foreground text-[17px] tracking-[0.3px] font-display leading-[1.1]">
          Riva Data
        </span>
        <span className="font-sans font-semibold text-primary text-[9px] tracking-[0.25em] uppercase leading-none pl-[1px]">
          Academy
        </span>
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 no-underline transition-all duration-200 hover:opacity-80 bg-transparent md:bg-primary px-1 py-1 md:px-4 md:py-2 rounded-full md:rounded-md font-semibold text-[0.85rem] border-none cursor-pointer text-slate-800 md:text-white"
        >
          <div
            className="flex items-center justify-center rounded-full bg-blue-600 md:bg-white text-white md:text-blue-600 font-bold w-[36px] h-[36px] md:w-[28px] md:h-[28px] text-[0.85rem] md:text-[0.75rem]"
          >
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <span className="hidden md:inline">{user?.firstName || 'User'}</span>
          <svg
            className={cn('w-4 h-4 transition-transform hidden md:block', showDropdown && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-[240px] rounded-xl overflow-hidden z-[110] bg-white/95 border border-slate-200/60 backdrop-blur-xl shadow-xl">
            <div className="px-4 py-3 border-b border-slate-200/60">
              <p className="text-[14px] font-semibold text-slate-800 m-0 mb-1">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[12px] text-slate-500 m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {user?.email}
              </p>
            </div>
            
            <div className="py-1">
              <Link 
                href="/courses" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 no-underline transition-colors duration-200 hover:bg-slate-50 hover:text-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                All Courses
              </Link>
              
              <Link 
                href="/my-courses" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 no-underline transition-colors duration-200 hover:bg-slate-50 hover:text-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                My Courses
              </Link>
              
              <Link 
                href="/purchase-history" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 no-underline transition-colors duration-200 hover:bg-slate-50 hover:text-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Purchase History
              </Link>
            </div>
            
            <div className="py-1 border-t border-slate-200/60">
              <button 
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
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
    </nav>
  );
}
