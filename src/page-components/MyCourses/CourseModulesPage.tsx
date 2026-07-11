'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { enrollmentApi } from '@/lib/api/enrollment/enrollmentApi';
import { Course, CourseModule } from '@/types/course/types';
import { ModuleCard } from '@/components/features/MyCourses/ModuleCard';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';
import { logger } from '@/lib/utils/logger';

interface CourseModulesPageProps {
  courseId: string;
}

export function CourseModulesPage({ courseId }: CourseModulesPageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track user's current module based on progress
  // TODO: Get this from backend based on user's completed lessons
  // For now, calculate based on last accessed or default to last module
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCourse();
    }
  }, [isAuthenticated, courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await enrollmentApi.getEnrolledCourseById(courseId);
      setCourse(data);
      
      // TODO: Get user progress from backend to determine current module
      // For now, set current module to the last one (most recent)
      // This assumes user is working through the course sequentially
      if (data.modules && data.modules.length > 0) {
        // Set to last module index as "current" by default
        setCurrentModuleIndex(data.modules.length - 1);
      }
    } catch (err) {
      logger.error('Failed to load course:', err);
      setError('Failed to load course details');
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
          background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)'
        }}>
          <div className="h-[68px]" />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Loading course...</p>
            </div>
          </div>
        </div>
        <Footer footerData={footerLinksData} />
      </>
    );
  }

  if (!isAuthenticated || !course) {
    return null;
  }

  // Split modules into past (completed), current, and remaining (all accessible)
  // Since user has purchased, NO modules are locked - just organized by progress
  const allModules = course.modules || [];
  const pastModules = allModules.slice(0, currentModuleIndex).reverse(); // Reverse to show newest first (4,3,2,1)
  const currentModule = allModules[currentModuleIndex];
  const remainingModules = allModules.slice(currentModuleIndex + 1);
  // Note: remainingModules are NOT locked, just not yet started

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)'
      }}>
        <div className="h-[68px]" />
        
        <div style={{ padding: '80px 5vw 80px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Back Button */}
            <button
              onClick={() => router.push('/my-courses')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255,255,255,0.7)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '32px',
                padding: '8px 0',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              Back to My Courses
            </button>

            {/* Page Header */}
            <div className="text-center" style={{ marginBottom: '50px' }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#0ea5e9',
                border: '1px solid rgba(14,165,233,0.3)',
                backgroundColor: 'rgba(14,165,233,0.1)',
                marginBottom: '24px'
              }}>
                Course Progress
              </div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: 700,
                color: 'white',
                marginBottom: '24px',
                fontFamily: 'Syne, sans-serif',
                letterSpacing: '-0.5px'
              }}>
                {course.title}
              </h1>
              <p style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                {course.description}
              </p>
            </div>

            {/* Current Module Section - Show on top */}
            {currentModule && (
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '24px',
                  fontFamily: 'Syne, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#0ea5e9',
                    display: 'inline-block'
                  }}></span>
                  Current Module
                </h2>
                <ModuleCard 
                  module={currentModule} 
                  courseId={courseId}
                  isPast={false}
                  isCurrent={true}
                />
              </div>
            )}

            {/* Past Modules Section (Completed) - Show in reverse order below current */}
            {pastModules.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '24px',
                  fontFamily: 'Syne, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'inline-block'
                  }}></span>
                  Completed Modules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastModules.map((module) => (
                    <ModuleCard 
                      key={module.id}
                      module={module} 
                      courseId={courseId}
                      isPast={true}
                      isCurrent={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Remaining Modules Section (Not started yet, but accessible) */}
            {remainingModules.length > 0 && (
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '24px',
                  fontFamily: 'Syne, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#8b5cf6',
                    display: 'inline-block'
                  }}></span>
                  Available Modules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingModules.map((module) => (
                    <ModuleCard 
                      key={module.id}
                      module={module} 
                      courseId={courseId}
                      isPast={false}
                      isCurrent={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer footerData={footerLinksData} />
    </>
  );
}
