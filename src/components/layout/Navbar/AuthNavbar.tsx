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
      <nav 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-[18px] border-b transition-all duration-300"
        style={{
          background: 'rgba(5,13,31,0.85)',
          borderColor: 'rgba(14,165,233,0.12)',
          height: '68px',
          padding: '0 5vw'
        }}
      >
        <Link href="/" className="flex items-center no-underline" style={{ gap: '10px' }}>
          <Image 
            src="/logo.svg" 
            alt="Riva Data logo" 
            width={34} 
            height={34}
            className="w-[34px] h-[34px] rounded-lg block"
          />
          <span 
            className="font-bold text-white"
            style={{
              fontSize: '17px',
              letterSpacing: '0.3px',
              fontFamily: 'Syne, sans-serif'
            }}
          >
            Riva Data
          </span>
        </Link>
      </nav>
    );
  }

  // Logged in - show logo + user menu
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-[18px] border-b transition-all duration-300"
      style={{
        background: 'rgba(5,13,31,0.85)',
        borderColor: 'rgba(14,165,233,0.12)',
        height: '68px',
        padding: '0 5vw'
      }}
    >
      <Link href="/" className="flex items-center no-underline" style={{ gap: '10px' }}>
        <Image 
          src="/logo.svg" 
          alt="Riva Data logo" 
          width={34} 
          height={34}
          className="w-[34px] h-[34px] rounded-lg block"
        />
        <span 
          className="font-bold text-white"
          style={{
            fontSize: '17px',
            letterSpacing: '0.3px',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          Riva Data
        </span>
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center rounded-lg transition-colors"
          style={{
            gap: '8px',
            padding: '8px 12px',
            background: showDropdown ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!showDropdown) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showDropdown) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.firstName} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          )}
          <span 
            className="text-sm font-medium hidden sm:block"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {user?.firstName}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            style={{ color: 'rgba(255,255,255,0.65)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div 
            className="absolute right-0 rounded-lg shadow-lg border"
            style={{
              marginTop: '16px',
              width: '220px',
              background: 'rgba(17,24,39,0.95)',
              backdropFilter: 'blur(12px)',
              borderColor: 'rgba(14,165,233,0.2)',
              padding: '12px'
            }}
          >
            <div 
              className="px-3 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '12px' }}
            >
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {user?.email}
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link 
                href="/courses" 
                className="flex items-center px-3 py-3 text-sm transition-colors no-underline rounded-md"
                style={{ color: 'rgba(255,255,255,0.85)', gap: '14px' }}
                onClick={() => setShowDropdown(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px' }}>🎓</span>
                <span>Courses</span>
              </Link>
              
              <Link 
                href="/my-courses" 
                className="flex items-center px-3 py-3 text-sm transition-colors no-underline rounded-md"
                style={{ color: 'rgba(255,255,255,0.85)', gap: '14px' }}
                onClick={() => setShowDropdown(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px' }}>📚</span>
                <span>My Courses</span>
              </Link>
              
              <Link 
                href="/purchase-history" 
                className="flex items-center px-3 py-3 text-sm transition-colors no-underline rounded-md"
                style={{ color: 'rgba(255,255,255,0.85)', gap: '14px' }}
                onClick={() => setShowDropdown(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px' }}>🧾</span>
                <span>Purchase History</span>
              </Link>
            </div>
            
            <div 
              className="border-t"
              style={{ borderColor: 'rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '12px' }}
            >
              <button 
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="flex items-center px-3 py-3 text-sm transition-colors w-full text-left rounded-md"
                style={{ color: '#ef4444', gap: '14px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px' }}>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
