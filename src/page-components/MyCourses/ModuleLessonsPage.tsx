'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { enrollmentApi } from '@/lib/api/enrollment/enrollmentApi';
import { Course, CourseModule } from '@/types/course/types';
import { LessonCard } from '@/components/features/MyCourses/LessonCard';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';
import { logger } from '@/lib/utils/logger';

interface ModuleLessonsPageProps {
  courseId: string;
  moduleId: string;
}

export function ModuleLessonsPage({ courseId, moduleId }: ModuleLessonsPageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons] = useState<string[]>([]); // TODO: Get from enrollment progress

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadModuleData();
    }
  }, [isAuthenticated, courseId, moduleId]);

  const loadModuleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const courseData = await enrollmentApi.getEnrolledCourseById(courseId);
      setCourse(courseData);
      
      const foundModule = courseData.modules?.find(m => m.id === moduleId);
      if (foundModule) {
        setModule(foundModule);
      } else {
        setError('Module not found');
      }
    } catch (err) {
      logger.error('Failed to load module:', err);
      setError('Failed to load module details');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          background: 'var(--color-background)'
        }}>
          <div className="h-[68px]" />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-foreground/70">Loading lessons...</p>
            </div>
          </div>
        </div>
        <Footer footerData={footerLinksData} />
      </>
    );
  }

  if (!isAuthenticated || !course || !module) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-background)'
      }}>
        <div className="h-[68px]" />
        
        <div className="py-[80px] px-[5vw]">
          <div className="max-w-[900px] mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push(`/my-courses/${courseId}`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#475569',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '32px',
                padding: '8px 0',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              Back to Modules
            </button>

            {/* Page Header */}
            <div className="mb-[40px]">
              {/* Course Title */}
              <div style={{
                fontSize: '0.9rem',
                color: '#64748b',
                marginBottom: '12px',
                fontWeight: 500
              }}>
                {course.title}
              </div>
              
              {/* Module Badge */}
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                border: '1px solid rgba(14,165,233,0.3)',
                backgroundColor: 'rgba(14,165,233,0.1)',
                marginBottom: '16px'
              }}>
                Module {module.order}
              </div>
              
              {/* Module Title */}
              <h1 style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '16px',
                fontFamily: 'Syne, sans-serif',
                letterSpacing: '-0.5px'
              }}>
                {module.title}
              </h1>
              
              {/* Module Stats */}
              <div style={{
                display: 'flex',
                gap: '24px',
                fontSize: '0.9rem',
                color: '#475569'
              }}>
                <div className="flex items-center gap-[8px]">
                  <span>⏱️</span>
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <span>📝</span>
                  <span>{module.lessons?.length || 0} Lessons</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <span>✓</span>
                  <span>{completedLessons.length} / {module.lessons?.length || 0} Completed</span>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            {error && (
              <div style={{
                color: '#ef4444',
                marginBottom: '24px',
                padding: '12px',
                background: 'rgba(239,68,68,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.3)'
              }}>
                {error}
              </div>
            )}

            {module.lessons && module.lessons.length > 0 ? (
              <div className="flex flex-col gap-[12px]">
                {module.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <LessonCard 
                      key={lesson.id}
                      lesson={lesson}
                      isCompleted={completedLessons.includes(lesson.id)}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-[64px] mb-[24px]">
                  📝
                </div>
                <p style={{
                  fontSize: '18px',
                  color: '#475569',
                  marginBottom: '8px'
                }}>
                  No lessons available yet
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Lessons will be added soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer footerData={footerLinksData} />
    </>
  );
}
