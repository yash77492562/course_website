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
      contentType?: 'VIDEO' | 'PDF';
    }>;
  }>;
}

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

  const outcomesHtml = (outcomes || []).map((outcome, index) => (
    <li key={index}>{outcome}</li>
  ));

  const handleLessonClick = (lessonId: string) => {
    router.push(`/video-player/${lessonId}`);
  };

  const modulesHtml = (modules || []).map((m, index) => {
    const isOpen = openModules.includes(index);
    const isFirstModule = index === 0;
    
    // If module has lessons and user has purchased, show clickable lessons
    if (m.lessons && m.lessons.length > 0 && hasPurchased) {
      return (
        <div key={index} style={{ marginBottom: '20px' }} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button 
            style={{ padding: '20px' }}
            className="w-full bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors"
            onClick={() => toggleModule(index)}
          >
            <span className="text-gray-900 font-semibold text-lg">{m.title}</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="bg-white">
              {m.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    style={{ paddingLeft: '32px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }}
                    className={`w-full text-left transition-colors text-gray-700 hover:bg-gray-50 ${idx > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl flex-shrink-0">{lesson.contentType === 'PDF' ? '📄' : '🎥'}</span>
                      <span className="flex-1 text-base">{lesson.title}</span>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      );
    }

    // If module has lessons but user hasn't purchased, show lesson titles
    // First lesson is free and clickable, others are locked
    if (m.lessons && m.lessons.length > 0) {
      const sortedLessons = [...m.lessons].sort((a, b) => a.order - b.order);
      
      return (
        <div key={index} style={{ marginBottom: '20px' }} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button 
            style={{ padding: '20px' }}
            className="w-full bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors"
            onClick={() => toggleModule(index)}
          >
            <span className="text-gray-900 font-semibold text-lg">{m.title}</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="bg-white">
              {sortedLessons.map((lesson, lessonIndex) => {
                const isFirstLesson = isFirstModule && lessonIndex === 0;
                
                if (isFirstLesson) {
                  // First lesson is free - make it clickable
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson.id)}
                      style={{ paddingLeft: '32px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }}
                      className={`w-full text-left transition-colors text-gray-700 hover:bg-gray-50 ${lessonIndex > 0 ? 'border-t border-gray-100' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl flex-shrink-0">{lesson.contentType === 'PDF' ? '📄' : '🎥'}</span>
                        <span className="flex-1 text-base">{lesson.title}</span>
                      </div>
                    </button>
                  );
                }
                
                // Other lessons are locked
                return (
                  <div 
                    key={lesson.id} 
                    style={{ paddingLeft: '32px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }}
                    className={`w-full text-left text-gray-400 cursor-not-allowed ${lessonIndex > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl flex-shrink-0 opacity-50">{lesson.contentType === 'PDF' ? '📄' : '🎥'}</span>
                      <span className="flex-1 text-base">{lesson.title}</span>
                      <span className="text-base flex-shrink-0">🔒</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Otherwise show as informational accordion (fallback for courses without lessons)
    return (
      <div key={index} style={{ marginBottom: '20px' }} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button 
          style={{ padding: '20px' }}
          className="w-full bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors"
          onClick={() => toggleModule(index)}
        >
          <span className="text-gray-900 font-semibold text-lg">{m.title}</span>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="bg-white">
            <ul className="list-none p-0 m-0">
              {(m.items || []).map((item, itemIndex) => (
                <li key={itemIndex} style={{ paddingLeft: '32px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }} className={`text-gray-700 text-base ${itemIndex > 0 ? 'border-t border-gray-100' : ''}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  });

  return (
    <section className="program-section">
      <div className="program-two-col">
        <div className="reveal">
          <span className="section-label">Program Outcome</span>
          <h2 className="section-title">What you'll be able to do</h2>
          <ul className="bullets">{outcomesHtml}</ul>
        </div>
        <div className="reveal reveal-delay-1">
          <span className="section-label">Curriculum</span>
          <h2 className="section-title">Modules & projects</h2>
          <div className="space-y-4">{modulesHtml}</div>
        </div>
      </div>
    </section>
  );
}