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
      style={{
        background: '#ffffff',
        border: `2px solid ${isCurrent ? '#0ea5e9' : isPast ? '#10b981' : '#e2e8f0'}`,
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.28s, box-shadow 0.28s',
        cursor: 'pointer',
        display: 'block',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(14,165,233,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Status Badge */}
      {(isCurrent || isPast) && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          background: isCurrent ? 'rgba(14,165,233,0.1)' : 'rgba(16,185,129,0.1)',
          color: isCurrent ? '#0ea5e9' : '#10b981',
          border: `1px solid ${isCurrent ? 'rgba(14,165,233,0.3)' : 'rgba(16,185,129,0.3)'}`,
        }}>
          {isCurrent ? 'Current' : 'Completed'}
        </div>
      )}
      
      {/* Module Number */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        background: isCurrent 
          ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)' 
          : isPast 
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'rgba(100,116,139,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontWeight: '700',
        color: (isCurrent || isPast) ? 'white' : '#64748b',
        marginBottom: '16px',
      }}>
        {module.order}
      </div>
      
      {/* Title */}
      <h3 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '1.15rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '12px',
        letterSpacing: '-0.2px',
        lineHeight: '1.3',
        paddingRight: '80px',
      }}>
        {module.title}
      </h3>
      
      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '16px',
        fontSize: '0.85rem',
        color: '#64748b',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📝</span>
          <span>{module.lessons.length} Lessons</span>
        </div>
      </div>
      
      {/* View Lessons Link */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.85rem',
        fontWeight: '500',
        color: '#0ea5e9',
      }}>
        View Lessons
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </div>
    </Link>
  );
}
