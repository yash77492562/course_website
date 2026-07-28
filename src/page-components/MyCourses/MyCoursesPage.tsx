'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { useEnrolledCourses } from '@/hooks/course/useCourseQueries';
import { EnrolledCourseCard } from '@/components/features/MyCourses/EnrolledCourseCard';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';

export function MyCoursesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Server state via React Query; only fetch once authenticated.
  const {
    data: courses = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useEnrolledCourses(isAuthenticated);

  const error = queryError ? 'Failed to load your courses' : null;
  const loadEnrolledCourses = () => refetch();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
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
              <p className="text-foreground/70">Checking authentication...</p>
            </div>
          </div>
        </div>
        <Footer footerData={footerLinksData} />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
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
              <p className="text-foreground/70">Loading your courses...</p>
            </div>
          </div>
        </div>
        <Footer footerData={footerLinksData} />
      </>
    );
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
          <div className="max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="text-center mb-[50px]">
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
                marginBottom: '24px'
              }}>
                Your Learning
              </div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '24px',
                fontFamily: 'Syne, sans-serif',
                letterSpacing: '-0.5px'
              }}>
                My Courses
              </h1>
              <p style={{
                fontSize: '17px',
                color: '#334155',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Continue your learning journey with your enrolled courses
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center mb-8">
                <div style={{
                  color: '#ef4444',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'rgba(239,68,68,0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239,68,68,0.3)'
                }}>
                  {error}
                </div>
                <button 
                  onClick={loadEnrolledCourses}
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Courses Grid */}
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[64px] mb-[24px]">
                  📚
                </div>
                <p style={{
                  fontSize: '18px',
                  color: '#475569',
                  marginBottom: '8px'
                }}>
                  You haven't enrolled in any courses yet
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '24px'
                }}>
                  Start learning by enrolling in a course
                </p>
                <button
                  onClick={() => router.push('/courses')}
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <EnrolledCourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer footerData={footerLinksData} />
    </>
  );
}
