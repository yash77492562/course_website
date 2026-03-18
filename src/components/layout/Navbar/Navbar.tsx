'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[68px]',
      'backdrop-blur-[18px] border-b border-[rgba(14,165,233,0.12)] transition-all duration-300'
    )}
    style={{ 
      background: 'rgba(5,13,31,0.85)',
      padding: '0 5vw'
    }}>
      <Link href="/" className="flex items-center no-underline" style={{ gap: '10px' }}>
        <Image 
          src="/logo.svg" 
          alt="Riva Data logo" 
          width={34} 
          height={34}
          className="w-[34px] h-[34px] rounded-lg block"
        />
        <span className="font-syne font-bold text-white"
              style={{
                fontSize: '17px',
                letterSpacing: '0.3px'
              }}>
          Riva Data
        </span>
      </Link>

      <ul className="hidden md:flex items-center list-none" style={{ gap: '36px' }}>
        <li>
          <Link 
            href="#about" 
            className="no-underline transition-colors duration-200 hover:text-white"
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.3px'
            }}
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            href="#programs" 
            className="no-underline transition-colors duration-200 hover:text-white"
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.3px'
            }}
          >
            Programs
          </Link>
        </li>
        <li>
          <Link 
            href="#consulting" 
            className="no-underline transition-colors duration-200 hover:text-white"
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.3px'
            }}
          >
            Consulting
          </Link>
        </li>
        <li>
          <a 
            href="#contact" 
            className="text-white no-underline transition-opacity duration-200 hover:opacity-88"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              padding: '8px 20px',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.85rem'
            }}
          >
            Get Started
          </a>
        </li>
      </ul>
    </nav>
  );
}