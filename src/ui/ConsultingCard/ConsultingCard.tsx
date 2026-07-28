'use client';

import { ConsultingService } from '@/types/consulting/types';

interface ConsultingCardProps {
  service: ConsultingService;
}

export function ConsultingCard({ service }: ConsultingCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(13,148,136,0.15)] overflow-hidden cursor-pointer h-full flex flex-col z-10">
      
      {/* Decorative blurry orbs for premium feel */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none z-0" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/5 rounded-full blur-[40px] group-hover:bg-secondary/10 transition-colors duration-700 pointer-events-none z-0" />
      
      {/* Icon Area */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-3xl mb-8 border border-slate-200/50 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-md group-hover:border-primary/20 relative z-10">
        <span className="opacity-90 group-hover:opacity-100 transition-opacity">
          {service.icon}
        </span>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <h3 className="font-sans text-[22px] font-extrabold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-slate-500 font-medium">
          {service.body}
        </p>
      </div>

      {/* Decorative arrow indicating it's clickable */}
      <div className="relative z-10 mt-8 flex justify-end">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-slate-100 group-hover:border-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><line x1="5" y1="19" x2="19" y2="5"></line><polyline points="10 5 19 5 19 14"></polyline></svg>
        </div>
      </div>
    </div>
  );
}