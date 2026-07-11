'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LinkedInIcon, EmailIcon } from '@/ui/Icons/Icons';
import type { FooterData } from '@/types/footer/types';

interface FooterProps {
  footerData: FooterData;
}

export function Footer({ footerData }: FooterProps) {
  return (
    <footer
      style={{
        background: '#03091a',
        padding: '56px 5vw 36px',
        borderTop: '1px solid rgba(14,165,233,0.1)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '32px',
          gap: '40px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ maxWidth: '320px' }}>
          <Link 
            href="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              textDecoration: 'none'
            }}
          >
            <Image
              src="/logo.svg"
              alt="Riva Data logo"
              width={34}
              height={34}
              style={{
                borderRadius: '8px',
                display: 'block'
              }}
            />
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#ffffff',
                letterSpacing: '0.3px'
              }}
            >
              Riva Data
            </span>
          </Link>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.4)',
              maxWidth: '280px',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}
          >
            Reskilling professionals. Empowering organisations. Shaping the future of data in the UK and beyond.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.45)'
            }}
          >
            🇬🇧 United Kingdom
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px'
          }}
        >
          {footerData.columns.map((column, index) => (
            <div key={index}>
              <h5
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '16px'
                }}
              >
                {column.title}
              </h5>
              {column.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.href}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '10px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <p
          style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.3)'
          }}
        >
          © 2025 Riva Data Ltd. All rights reserved. Registered in England & Wales.
        </p>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Link
            href="https://www.linkedin.com/company/riva-data/"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s'
            }}
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(14,165,233,0.12)';
              e.currentTarget.style.borderColor = '#0ea5e9';
              e.currentTarget.style.color = '#0ea5e9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            }}
          >
            <LinkedInIcon size={16} />
          </Link>
          <Link
            href="#"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s'
            }}
            aria-label="Email"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(14,165,233,0.12)';
              e.currentTarget.style.borderColor = '#0ea5e9';
              e.currentTarget.style.color = '#0ea5e9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            }}
          >
            <EmailIcon size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
}