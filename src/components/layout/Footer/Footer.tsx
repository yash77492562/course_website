'use client';

import Link from 'next/link';
import { LinkedInIcon, EmailIcon } from '@/ui/Icons/Icons';
import type { FooterData } from '@/types/footer/types';

interface FooterProps {
  footerData: FooterData;
}

export function Footer({ footerData }: FooterProps) {
  return (
    <footer className="bg-[#03091a] px-[5vw] pt-14 pb-9 border-t border-sky-500/10">
      <div className="flex justify-between items-start pb-10 border-b border-white/7 mb-8 gap-10 flex-wrap">
        <div className="footer-brand">
          <Link href="/" className="flex items-center gap-2.5 mb-3 inline-flex">
            <div className="w-[34px] h-[34px] bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center font-syne font-extrabold text-[15px] text-white tracking-tight">
              R
            </div>
            <span className="font-syne font-bold text-lg text-white tracking-wide">
              Riva Data
            </span>
          </Link>
          <p className="text-[13.6px] text-white/40 max-w-[280px] leading-relaxed mb-4">
            Reskilling professionals. Empowering organisations. Shaping the future of data in the UK and beyond.
          </p>
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/45">
            🇬🇧 United Kingdom
          </div>
        </div>

        <div className="flex gap-15">
          {footerData.columns.map((column, index) => (
            <div key={index} className="footer-col">
              <h5 className="font-syne text-[12.8px] font-bold tracking-[1.2px] uppercase text-white/40 mb-4">
                {column.title}
              </h5>
              {column.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.href}
                  className="block text-sm text-white/60 mb-2.5 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-[12.8px] text-white/30">
          © 2025 Riva Data Ltd. All rights reserved. Registered in England & Wales.
        </p>
        
        <div className="flex items-center gap-3">
          <Link
            href="https://www.linkedin.com/company/riva-data/"
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/55 transition-all duration-200 hover:bg-sky-500/12 hover:border-sky-500 hover:text-sky-500"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon size={16} />
          </Link>
          <Link
            href="#"
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/55 transition-all duration-200 hover:bg-sky-500/12 hover:border-sky-500 hover:text-sky-500"
            aria-label="Email"
          >
            <EmailIcon size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
}