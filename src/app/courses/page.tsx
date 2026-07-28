'use client';

import { usePublishedCourses } from '@/hooks/course/useCourseQueries';
import { Program } from '@/types/program/types';
import { ProgramCard } from '@/ui/ProgramCard/ProgramCard';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';
import { Skeleton } from '@/ui/skeleton/skeleton';

// Module-level lookup — no need to reallocate this map on every render.
const CATEGORY_ICONS: Record<string, string> = {
  'Data Analytics': '📊',
  'Data Engineering': '⚙️',
  'Data Science': '🤖',
  'Data Science & AI': '🤖',
  'Machine Learning': '🧠',
  'Business Intelligence': '📈',
  'Cloud Computing': '☁️',
};

const getIconForCategory = (category: string): string =>
  CATEGORY_ICONS[category] || '📚';

export default function CoursesPage() {
  // Public page — anyone can browse published courses without logging in.
  const {
    data: rawCourses = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = usePublishedCourses();

  const error = queryError ? 'Failed to load courses' : null;
  const loadCourses = () => refetch();

  // Transform Course data to the Program shape the card expects.
  const courses: Program[] = rawCourses.map((course) => ({
    icon: getIconForCategory(course.category),
    title: course.title,
    body: course.description,
    tags: course.features || [],
    ctaText: 'Learn more',
    ctaHref: `/course/${course.id}`,
  }));

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'transparent'
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
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                border: '1px solid rgba(14,165,233,0.3)',
                backgroundColor: 'white',
                marginBottom: '24px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                Our Programs
              </div>
              <h1 
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '24px',
                  fontFamily: '"ivypresto-display", "Playfair Display", serif',
                  fontStyle: 'italic',
                  letterSpacing: '-0.5px'
                }}
              >
                All Courses
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#475569',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Browse all our specialist programs designed to transform your career in data
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-[380px] w-full rounded-[24px]" />
                <Skeleton className="h-[380px] w-full rounded-[24px] hidden md:block" />
                <Skeleton className="h-[380px] w-full rounded-[24px] hidden lg:block" />
                <Skeleton className="h-[380px] w-full rounded-[24px] hidden lg:block" />
                <Skeleton className="h-[380px] w-full rounded-[24px] hidden lg:block" />
                <Skeleton className="h-[380px] w-full rounded-[24px] hidden lg:block" />
              </div>
            ) : error ? (
              <div className="text-center mb-8">
                <div style={{
                  color: '#ef4444',
                  marginBottom: '16px',
                  padding: '16px',
                  background: 'rgba(239,68,68,0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(239,68,68,0.2)',
                  maxWidth: '400px',
                  margin: '0 auto 16px'
                }}>
                  {error}
                </div>
                <button 
                  onClick={loadCourses}
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: '100px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(13,148,136,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(13,148,136,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,148,136,0.2)';
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16">
                <p style={{
                  fontSize: '18px',
                  color: '#475569',
                  marginBottom: '8px'
                }}>
                  No courses available at the moment.
                </p>
                <p style={{
                  fontSize: '15px',
                  color: '#64748b'
                }}>
                  Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((program) => (
                  <ProgramCard key={program.ctaHref} program={program} />
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
