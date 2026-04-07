'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { courseApi } from '@/lib/api/course/courseApi';
import { Course } from '@/types/course/types';
import { Program } from '@/types/program/types';
import { ProgramCard } from '@/ui/ProgramCard/ProgramCard';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';

export default function CoursesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only redirect to login if auth is fully loaded and user is not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Only load courses if authenticated
    if (isAuthenticated) {
      loadCourses();
    }
  }, [isAuthenticated]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseApi.getPublishedCourses();
      
      // Transform Course data to Program format for compatibility
      const transformedCourses: Program[] = data.map((course: Course) => ({
        icon: getIconForCategory(course.category),
        title: course.title,
        body: course.description,
        tags: course.features || [],
        ctaText: "Learn more",
        ctaHref: `/course/${course.id}`,
      }));
      
      setCourses(transformedCourses);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Show loading while auth is initializing
  if (authLoading) {
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
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Checking authentication...</p>
            </div>
          </div>
        </div>
        <Footer footerData={footerLinksData} />
      </>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Show loading while courses are loading
  if (loading) {
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
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Loading courses...</p>
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
        background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)'
      }}>
        {/* Spacer for fixed navbar */}
        <div className="h-[68px]" />
        
        {/* Page Content */}
        <div style={{ padding: '80px 5vw 80px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                Our Programs
              </div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: 700,
                color: 'white',
                marginBottom: '24px',
                fontFamily: 'Syne, sans-serif',
                letterSpacing: '-0.5px'
              }}>
                All Courses
              </h1>
              <p style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Browse all our specialist programs designed to transform your career in data
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
                  onClick={loadCourses}
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
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
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '8px'
                }}>
                  No courses available at the moment.
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.4)'
                }}>
                  Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((program, index) => (
                  <ProgramCard key={index} program={program} />
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
