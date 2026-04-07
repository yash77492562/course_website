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

interface CourseModulesPageProps {
  courseId: string;
}

export function CourseModulesPage({ courseId }: CourseModulesPageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(2); // Example: user is on module 3 (index 2)

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
    } catch (err) {
      console.error('Failed to load course:', err);
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

  const pastModules = course.modules?.slice(0, currentModuleIndex) || [];
  const currentModule = course.modules?.[currentModuleIndex];
  const futureModules = course.modules?.slice(currentModuleIndex + 1) || [];

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

            {/* Current Module Section */}
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

            {/* Past Modules Section */}
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

            {/* Future Modules Section (Locked) */}
            {futureModules.length > 0 && (
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
                    background: '#64748b',
                    display: 'inline-block'
                  }}></span>
                  Upcoming Modules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {futureModules.map((module) => (
                    <div
                      key={module.id}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        position: 'relative',
                        opacity: 0.6,
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: 'rgba(100,116,139,0.2)',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(100,116,139,0.3)',
                      }}>
                        🔒 Locked
                      </div>
                      
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        background: 'rgba(100,116,139,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '16px',
                      }}>
                        {module.order}
                      </div>
                      
                      <h3 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '1.15rem',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '12px',
                        letterSpacing: '-0.2px',
                        lineHeight: '1.3',
                        paddingRight: '80px',
                      }}>
                        {module.title}
                      </h3>
                      
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.4)',
                      }}>
                        Complete previous modules to unlock
                      </div>
                    </div>
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
