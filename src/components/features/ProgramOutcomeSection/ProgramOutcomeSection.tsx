'use client';

import { usePayNow } from '@/components/features/CourseAccess/CourseAccessControl';
import { useRouter } from 'next/navigation';

interface ProgramOutcomeSectionProps {
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

export function ProgramOutcomeSection({ outcomes, modules }: ProgramOutcomeSectionProps) {
  const router = useRouter();
  
  // Try to get PayNow context, but don't fail if not available
  let hasPurchased = false;
  try {
    const payNowContext = usePayNow();
    hasPurchased = payNowContext.hasPurchased;
  } catch (e) {
    // Not within CourseAccessControl, that's okay
  }

  const outcomesHtml = (outcomes || []).map((outcome, index) => (
    <li key={index}>{outcome}</li>
  ));

  const handleLessonClick = (lessonId: string) => {
    router.push(`/video-player/${lessonId}`);
  };

  const modulesHtml = (modules || []).map((m, index) => {
    // Check if this is the first module and get the first lesson
    const isFirstModule = index === 0;
    
    // If module has lessons and user has purchased, show clickable lessons
    if (m.lessons && m.lessons.length > 0 && hasPurchased) {
      return (
        <div key={index} className="curriculum-item-wrapper">
          <div className="curriculum-module-title">{m.title}</div>
          <div className="curriculum-lessons">
            {m.lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson.id)}
                  className="curriculum-lesson-button"
                >
                  <span className="lesson-icon">
                    {lesson.contentType === 'PDF' ? '📄' : '🎥'}
                  </span>
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-arrow">→</span>
                </button>
              ))}
          </div>
        </div>
      );
    }

    // If module has lessons but user hasn't purchased, show lesson titles
    // First lesson is free and clickable, others are locked
    if (m.lessons && m.lessons.length > 0) {
      const sortedLessons = [...m.lessons].sort((a, b) => a.order - b.order);
      
      return (
        <div key={index} className="curriculum-item-wrapper">
          <div className="curriculum-module-title">{m.title}</div>
          <div className="curriculum-lessons-locked">
            {sortedLessons.map((lesson, lessonIndex) => {
              const isFirstLesson = isFirstModule && lessonIndex === 0;
              
              if (isFirstLesson) {
                // First lesson is free - make it clickable
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className="curriculum-lesson-button"
                  >
                    <span className="lesson-icon">
                      {lesson.contentType === 'PDF' ? '📄' : '🎥'}
                    </span>
                    <span className="lesson-title">{lesson.title}</span>
                    <span className="lesson-arrow">→</span>
                  </button>
                );
              }
              
              // Other lessons are locked
              return (
                <div key={lesson.id} className="curriculum-lesson-locked">
                  <span className="lesson-icon">
                    {lesson.contentType === 'PDF' ? '📄' : '🎥'}
                  </span>
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-lock">🔒</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Otherwise show as informational accordion (fallback for courses without lessons)
    return (
      <details key={index} className="curriculum-item" open={index === 0}>
        <summary>{m.title}</summary>
        <ul className="curriculum-list">
          {(m.items || []).map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      </details>
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
          <div className="accordion">{modulesHtml}</div>
        </div>
      </div>

      <style jsx>{`
        .curriculum-item-wrapper {
          margin-bottom: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }

        .curriculum-module-title {
          padding: 16px 18px;
          background: #f7f8fa;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
          border-bottom: 1px solid #e2e8f0;
        }

        .curriculum-lessons {
          display: flex;
          flex-direction: column;
        }

        .curriculum-lesson-button {
          width: 100%;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          border: none;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .curriculum-lesson-button:last-child {
          border-bottom: none;
        }

        .curriculum-lesson-button:hover {
          background: #f7f8fa;
          padding-left: 22px;
        }

        .curriculum-lessons-locked {
          display: flex;
          flex-direction: column;
        }

        .curriculum-lesson-locked {
          width: 100%;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .curriculum-lesson-locked:last-child {
          border-bottom: none;
        }

        .lesson-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .lesson-title {
          flex: 1;
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 400;
        }

        .lesson-arrow {
          color: var(--electric);
          font-size: 1.2rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .curriculum-lesson-button:hover .lesson-arrow {
          opacity: 1;
        }

        .lesson-lock {
          font-size: 0.9rem;
          opacity: 0.5;
        }
      `}</style>
    </section>
  );
}