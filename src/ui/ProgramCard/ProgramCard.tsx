'use client';

import Link from 'next/link';
import { Icons } from '@/ui/Icons/Icons';
import type { ProgramCardProps } from '@/types/program/types';

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Link 
      href={program.ctaHref}
      className="group relative flex flex-col h-full bg-gradient-to-br from-primary to-[#0d264a] rounded-[32px] p-8 sm:p-10 border border-white/20 hover:border-white/50 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(13,148,136,0.5)] overflow-hidden"
    >
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none" />
      
      {/* Decorative blurry orbs for inner glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/40 rounded-full blur-[80px] group-hover:bg-secondary/60 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
      
      {/* Icon Area */}
      <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center text-3xl mb-8 border border-white/30 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_8px_16px_rgba(0,0,0,0.15)] relative z-10">
        <span className="opacity-100 transition-opacity drop-shadow-md">
          {program.icon}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col relative z-10">
        <h3 className="font-sans text-[24px] font-extrabold text-white leading-tight mb-3 group-hover:text-secondary transition-colors duration-300 drop-shadow-sm">
          {program.title}
        </h3>
        
        <p className="text-[15px] text-white/80 leading-relaxed line-clamp-4 mb-8 font-medium drop-shadow-sm">
          {program.body}
        </p>
      </div>
      
      {/* Footer Area */}
      <div className="mt-auto relative z-10 flex flex-col gap-6 pt-6 border-t border-white/20">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {program.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="text-[12px] font-bold tracking-wider px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded-full uppercase shadow-sm backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* CTA */}
        <div className="flex items-center gap-2 text-[15px] font-bold text-white transition-all duration-300 group-hover:gap-4">
          <span className="text-white/90 group-hover:text-white transition-colors drop-shadow-sm">Explore Program</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors shadow-sm backdrop-blur-sm border border-white/30">
            <Icons.ArrowRight className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}