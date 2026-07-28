'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export function AuthNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        <Link href="/" className="flex items-center no-underline gap-2.5">
          <span className="font-bold text-foreground text-[17px] tracking-[0.3px] font-display">
            Riva Data
          </span>
        </Link>
      </nav>
    );
  }

  // Logged in - show logo + user menu
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-[18px] border-b transition-all duration-300 bg-background/90 border-border h-[68px] px-[5vw]">
      <Link href="/" className="flex items-center no-underline gap-2.5">
        <span className="font-bold text-foreground text-[17px] tracking-[0.3px] font-display">
          Riva Data
        </span>
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center rounded-lg transition-colors gap-2 px-3 py-2 cursor-pointer border-none ${
            showDropdown ? 'bg-white/10' : 'bg-transparent hover:bg-white/10'
          }`}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.firstName} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-foreground font-semibold text-sm bg-primary hover:bg-primary/90 shadow-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          )}
          <span className="text-sm font-medium hidden sm:block text-foreground/90">
            {user?.firstName}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform text-foreground/65 ${showDropdown ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 rounded-lg shadow-lg border mt-4 w-[220px] bg-[#111827]/95 backdrop-blur-[12px] border-border p-3">
            <div className="px-3 py-3 border-b border-white/10 mb-3">
              <p className="text-sm font-semibold text-foreground m-0">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs mt-0.5 text-foreground/50 m-0">
                {user?.email}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Link 
                href="/courses" 
                className="flex items-center px-3 py-3 text-sm transition-colors no-underline rounded-md text-foreground/85 gap-3.5 hover:bg-white/10"
                onClick={() => setShowDropdown(false)}
              >
                <span className="text-[18px]">🎓</span>
                <span>Courses</span>
              </Link>
              
              <Link 
                href="/my-courses" 
                className="flex items-center px-3 py-3 text-sm transition-colors no-underline rounded-md text-foreground/85 gap-3.5 hover:bg-white/10"
                onClick={() => setShowDropdown(false)}
              >
                <span className="text-[18px]">📚</span>
                <span>My Courses</span>
              </Link>
              
              <Link 
                href="/purchase-history" 
                className="flex items-center px-3 py-3 text-sm transition-colors no-underline rounded-md text-foreground/85 gap-3.5 hover:bg-white/10"
                onClick={() => setShowDropdown(false)}
              >
                <span className="text-[18px]">🧾</span>
                <span>Purchase History</span>
              </Link>
            </div>
            
            <div className="border-t border-white/10 mt-3 pt-3">
              <button 
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="flex items-center px-3 py-3 text-sm transition-colors w-full text-left rounded-md text-red-500 gap-3.5 border-none bg-transparent cursor-pointer hover:bg-red-500/10"
              >
                <span className="text-[18px]">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
