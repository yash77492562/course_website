'use client';

import Link from 'next/link';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    order: number;
    contentType?: string;
    duration?: string;
  };
  isCompleted?: boolean;
}

export function LessonCard({ lesson, isCompleted = false }: LessonCardProps) {
  const getContentIcon = (contentType?: string): string => {
    if (!contentType) return '📚';
    const icons: { [key: string]: string } = {
      'VIDEO': '🎥',
      'PDF': '📄',
      'QUIZ': '📝',
      'TEXT': '📖',
    };
    return icons[contentType] || '📚';
  };

  return (
    <Link
      href={`/video-player/${lesson.id}`}
      className={`group bg-white border rounded-[10px] p-4 relative overflow-hidden transition-all duration-200 cursor-pointer flex items-center gap-4 no-underline hover:translate-x-1 hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)] hover:border-sky-500 ${
        isCompleted ? 'border-emerald-500' : 'border-slate-200'
      }`}
    >
      {/* Lesson Number */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[0.9rem] font-bold shrink-0 ${
        isCompleted 
          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-foreground'
          : 'bg-sky-500/10 text-sky-500'
      }`}>
        {lesson.order}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-sans text-[1rem] font-bold text-slate-900 mb-1 tracking-[-0.1px] overflow-hidden text-ellipsis whitespace-nowrap">
          {lesson.title}
        </h4>
        
        <div className="flex gap-3 text-[0.8rem] text-slate-500">
          <div className="flex items-center gap-1">
            <span>{getContentIcon(lesson.contentType)}</span>
            <span>{lesson.contentType || 'LESSON'}</span>
          </div>
          {lesson.duration && (
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{lesson.duration}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Status Icon */}
      {isCompleted && (
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-foreground text-[0.75rem] shrink-0">
          ✓
        </div>
      )}
      
      {/* Arrow Icon */}
      {!isCompleted && (
        <svg 
          width="20" 
          height="20" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
          className="shrink-0 text-sky-500"
        >
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      )}
    </Link>
  );
}
