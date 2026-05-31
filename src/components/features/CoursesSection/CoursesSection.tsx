'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/ui/Section/Section';
import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { ProgramCard } from '@/ui/ProgramCard/ProgramCard';
import { courseApi } from '@/lib/api/course/courseApi';
import { Course } from '@/types/course/types';
import { Program } from '@/types/program/types';

export function CoursesSection() {
  const [courses, setCourses] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

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
      // Fallback to empty array or show error message
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

  if (loading) {
    return (
      <Section>
        <div className="text-center">
          <SectionLabel>Our Programs</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-8">
            Loading Courses...
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <div className="text-center">
          <SectionLabel>Our Programs</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-8">
            Specialist Programs
          </h2>
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={loadCourses}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section id="programs">
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <SectionLabel>Our Programs</SectionLabel>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '16px', marginBottom: '32px' }}>
          Specialist Programs
        </h2>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No courses available at the moment.</p>
          <p className="text-sm mt-2">Please check back later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
          </div>
          
          {/* View All Courses Button */}
          {courses.length > 3 && (
            <div style={{ textAlign: 'center', marginTop: '56px' }}>
              <a
                href="/courses"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '15px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(14,165,233,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(14,165,233,0.3)';
                }}
              >
                View All Courses
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </>
      )}
    </Section>
  );
}