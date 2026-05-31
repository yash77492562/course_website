'use client';

import Link from 'next/link';
import { Icons } from '@/ui/Icons/Icons';

interface EnrolledCourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    totalModules?: number;
    totalLessons?: number;
    modules?: Array<{
      id: string;
      lessons?: Array<any>;
    }>;
  };
}

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const getIconForCategory = (category: string): string => {
    const categoryIcons: { [key: string]: string } = {
      'Data Analytics': '📊',
      'Data Engineering': '⚙️',
      'Data Science': '🤖',
      'Data Science & AI': '🤖',
      'Machine Learning': '🧠',
      'Business Intelligence': '📈',
      'Cloud Computing': '☁️',
    };
    
    return categoryIcons[category] || '📚';
  };

  // Calculate totals from modules if not provided
  const moduleCount = course.totalModules || course.modules?.length || 0;
  const lessonCount = course.totalLessons || 
    (course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0);

  return (
    <Link 
      href={`/my-courses/${course.id}`}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.28s, box-shadow 0.28s, border-color 0.28s',
        cursor: 'pointer',
        display: 'block',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(14,165,233,0.12)';
        e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Bottom accent line */}
      <div style={{
        content: '',
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '3px',
        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s ease'
      }} />
      
      {/* Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '12px',
        background: 'rgba(6,182,212,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        marginBottom: '16px',
        border: '1px solid rgba(6,182,212,0.2)',
      }}>
        {getIconForCategory(course.category)}
      </div>
      
      {/* Title */}
      <h3 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '12px',
        letterSpacing: '-0.2px',
        lineHeight: '1.3'
      }}>
        {course.title}
      </h3>
      
      {/* Description */}
      <p style={{
        fontSize: '0.9rem',
        lineHeight: '1.6',
        color: '#64748b',
        marginBottom: '16px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {course.description}
      </p>
      
      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        fontSize: '0.85rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📚</span>
          <span>{moduleCount} Modules</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📝</span>
          <span>{lessonCount} Lessons</span>
        </div>
      </div>
      
      {/* Continue Learning Link */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#0ea5e9',
        transition: 'gap 0.2s',
      }}>
        Continue Learning
        <Icons.ArrowRight />
      </div>
    </Link>
  );
}
