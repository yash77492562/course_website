'use client';

import Link from 'next/link';

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    duration: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      order: number;
    }>;
  };
  courseId: string;
  isPast: boolean;
  isCurrent: boolean;
}

export function ModuleCard({ module, courseId, isPast, isCurrent }: ModuleCardProps) {
  return (
    <Link
      href={`/my-courses/${courseId}/module/${module.id}`}
      className={`block bg-white rounded-xl p-5 relative overflow-hidden transition-all duration-300 cursor-pointer no-underline hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,165,233,0.15)] border-2 ${
        isCurrent ? 'border-sky-500' : isPast ? 'border-emerald-500' : 'border-slate-200'
      }`}
    >
      {/* Status Badge */}
      {(isCurrent || isPast) && (
        <div className={`absolute top-3 right-3 py-1 px-3 rounded-full text-xs font-semibold border ${
          isCurrent 
            ? 'bg-sky-500/10 text-sky-500 border-sky-500/30' 
            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
        }`}>
          {isCurrent ? 'Current' : 'Completed'}
        </div>
      )}
      
      {/* Module Number */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mb-4 ${
        isCurrent 
          ? 'bg-primary hover:bg-primary/90 shadow-sm text-foreground' 
          : isPast 
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-foreground'
            : 'bg-slate-500/10 text-slate-500'
      }`}>
        {module.order}
      </div>
      
      {/* Title */}
      <h3 className="font-sans text-[1.15rem] font-extrabold text-slate-900 mb-3 tracking-[-0.2px] leading-snug pr-20">
        {module.title}
      </h3>
      
      {/* Stats */}
      <div className="flex gap-4 text-[0.85rem] text-slate-500 mb-3">
        <div className="flex items-center gap-1.5">
          <span>📝</span>
          <span>{module.lessons.length} Lessons</span>
        </div>
      </div>
      
      {/* View Lessons Link */}
      <div className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-sky-500">
        View Lessons
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </div>
    </Link>
  );
}
