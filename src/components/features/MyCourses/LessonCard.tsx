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
      style={{
        background: '#ffffff',
        border: `1px solid ${isCompleted ? '#10b981' : '#e2e8f0'}`,
        borderRadius: '10px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,165,233,0.1)';
        e.currentTarget.style.borderColor = '#0ea5e9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = isCompleted ? '#10b981' : '#e2e8f0';
      }}
    >
      {/* Lesson Number */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: isCompleted 
          ? 'linear-gradient(135deg, #10b981, #059669)'
          : 'rgba(14,165,233,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        fontWeight: '700',
        color: isCompleted ? 'white' : '#0ea5e9',
        flexShrink: 0,
      }}>
        {lesson.order}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '4px',
          letterSpacing: '-0.1px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {lesson.title}
        </h4>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '0.8rem',
          color: '#64748b',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{getContentIcon(lesson.contentType)}</span>
            <span>{lesson.contentType || 'LESSON'}</span>
          </div>
          {lesson.duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>⏱️</span>
              <span>{lesson.duration}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Status Icon */}
      {isCompleted && (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.75rem',
          flexShrink: 0,
        }}>
          ✓
        </div>
      )}
      
      {/* Arrow Icon */}
      {!isCompleted && (
        <svg 
          width="20" 
          height="20" 
          fill="none" 
          stroke="#0ea5e9" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
          style={{ flexShrink: 0 }}
        >
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      )}
    </Link>
  );
}
