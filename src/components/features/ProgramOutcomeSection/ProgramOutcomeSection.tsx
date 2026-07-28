'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseAccess } from '@/hooks/course/useCourseAccess';

interface ProgramOutcomeSectionProps {
  courseId?: string; // Add courseId to check purchase status
  outcomes: string[];
  modules: Array<{
    id?: string;
    title: string;
    items: string[];
    lessons?: Array<{
      id: string;
      title: string;
      order: number;
      contentType?: 'VIDEO' | 'PDF' | 'QUIZ';
    }>;
  }>;
}

const DEFAULT_OUTCOMES = [
  "Query and analyse data using SQL",
  "Perform advanced analysis using Excel",
  "Build professional dashboards in Power BI and Tableau",
  "Automate analytics workflows using Python",
  "Understand cloud-based analytics using Azure & Databricks",
  "Build a portfolio with real-world projects"
];

export function ProgramOutcomeSection({ courseId, outcomes, modules }: ProgramOutcomeSectionProps) {
  const router = useRouter();
  const { hasAccess: hasPurchased } = useCourseAccess(courseId || null);
  const [openModules, setOpenModules] = useState<number[]>([0]); // First module open by default

  const toggleModule = (index: number) => {
    setOpenModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Logic: Display DB outcomes. If fewer than 6, pad with defaults.
  let displayOutcomes = outcomes || [];
  if (displayOutcomes.length < 6) {
    const needed = 6 - displayOutcomes.length;
    displayOutcomes = [...displayOutcomes, ...DEFAULT_OUTCOMES.slice(0, needed)];
  }

  const outcomesHtml = displayOutcomes.map((outcome, index) => (
    <li key={index} className="flex items-start gap-3 text-[#475569] leading-relaxed text-[1.05rem]">
      <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      {outcome}
    </li>
  ));

  const handleLessonClick = (lessonId: string) => {
    router.push(`/video-player/${lessonId}`);
  };

  const VideoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
  );

  const PdfIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  );

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
  );

  const displayModules = modules ? modules.slice(0, 4) : [];
  
  const modulesHtml = displayModules.map((m, index) => {
    const isOpen = openModules.includes(index);
    const isFirstModule = index === 0;
    
    const renderLesson = (lesson: any, lessonIndex: number, isClickable: boolean, isLocked: boolean) => {
      const isFirstLessonInFirstModule = isFirstModule && lessonIndex === 0;
      const Icon = lesson.contentType === 'PDF' ? PdfIcon : VideoIcon;

      return (
        <button
          key={lesson.id}
          onClick={() => isClickable ? handleLessonClick(lesson.id) : undefined}
          className={`w-full text-left transition-all px-5 py-4 rounded-xl flex items-center gap-4 ${isClickable ? 'hover:bg-white/60 hover:shadow-sm cursor-pointer' : 'cursor-not-allowed opacity-70'} ${lessonIndex > 0 ? 'mt-2' : ''}`}
          disabled={!isClickable}
        >
          <div className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center flex-shrink-0">
            {isLocked && !isFirstLessonInFirstModule ? <LockIcon /> : <Icon />}
          </div>
          <span className={`flex-1 text-[0.95rem] font-medium ${isLocked && !isFirstLessonInFirstModule ? 'text-slate-500' : 'text-[#0f172a]'}`}>
            {lesson.title}
          </span>
          {isFirstLessonInFirstModule && !hasPurchased && (
            <span className="text-[0.7rem] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">Preview</span>
          )}
        </button>
      );
    };
    
    return (
      <div key={index} className="mb-5 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <button 
          className="p-6 w-full text-left flex items-center justify-between transition-colors hover:bg-white/40"
          onClick={() => toggleModule(index)}
        >
          <span className="text-[#0f172a] font-bold text-[1.1rem] tracking-tight">{m.title}</span>
          <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-300 shadow-sm ${isOpen ? 'rotate-180' : ''}`}>
            <svg 
              className="w-4 h-4 text-slate-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {isOpen && (
          <div className="p-3 border-t border-slate-900/10">
            {m.lessons && m.lessons.length > 0 ? (
              hasPurchased 
                ? m.lessons.sort((a, b) => a.order - b.order).map((lesson, idx) => renderLesson(lesson, idx, true, false))
                : [...m.lessons].sort((a, b) => a.order - b.order).map((lesson, idx) => {
                    const isFirstLesson = isFirstModule && idx === 0;
                    return renderLesson(lesson, idx, isFirstLesson, true);
                  })
            ) : (
              // Informational accordion fallback if no lessons
              <ul className="list-none p-2 m-0 flex flex-col gap-3">
                {(m.items || []).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-slate-600 text-[0.95rem]">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  });

  return (
    <section className="py-[100px] px-[5vw] bg-transparent">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-[80px]">
        
        {/* Outcomes Side */}
        <div className="reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm mb-6">
            <span className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-primary">Program Outcome</span>
          </div>
          <h2 className="font-display italic text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0f172a] mb-8">
            What you'll be able to do
          </h2>
          <ul className="flex flex-col gap-5">
            {outcomesHtml}
          </ul>
        </div>

        {/* Modules Side */}
        <div className="reveal reveal-delay-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm mb-6">
            <span className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-primary">Curriculum</span>
          </div>
          <h2 className="font-display italic text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0f172a] mb-8">
            Modules & projects
          </h2>
          <div className="w-full">
            {modulesHtml}
          </div>
        </div>

      </div>
    </section>
  );
}