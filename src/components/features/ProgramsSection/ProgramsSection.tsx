'use client';

import { useState, useEffect } from 'react';
import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { SectionTitle } from '@/ui/SectionTitle/SectionTitle';
import { ProgramCard } from '@/ui/ProgramCard/ProgramCard';
import { courseApi } from '@/lib/api/course/courseApi';
import { Course } from '@/types/course/types';
import type { Program } from '@/types/program/types';
import { logger } from '@/lib/utils/logger';

export function ProgramsSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await courseApi.getPublishedCourses();
      
      // Transform Course data to Program format for frontend display
      const transformedPrograms: Program[] = data.map((course: Course) => ({
        icon: getIconForCategory(course.category),
        title: course.title,
        body: course.description,
        tags: course.features || [],
        ctaText: "Learn more",
        ctaHref: `/course/${course.id}`,
      }));
      
      setPrograms(transformedPrograms);
    } catch (err) {
      logger.error('Failed to load programs:', err);
      setError('Failed to load programs');
      setPrograms([]);
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
      <section 
        style={{
          background: '#ffffff',
          padding: '100px 5vw'
        }}
        id="programs"
      >
        <div style={{ textAlign: 'center' }}>
          <SectionLabel>Training Programmes</SectionLabel>
          <SectionTitle>Loading Programs...</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        style={{
          background: '#ffffff',
          padding: '100px 5vw'
        }}
        id="programs"
      >
        <div style={{ textAlign: 'center' }}>
          <SectionLabel>Training Programmes</SectionLabel>
          <SectionTitle>Purpose-Built for Data Careers</SectionTitle>
          <div style={{ color: '#ef4444', marginTop: '24px' }}>{error}</div>
          <button 
            onClick={loadPrograms}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              marginTop: '16px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }
  return (
    <section 
      style={{
        background: '#ffffff',
        padding: '100px 5vw'
      }}
      id="programs"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '56px',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div>
          <SectionLabel>Training Programmes</SectionLabel>
          <SectionTitle>
            Purpose-Built for<br />Data Careers
          </SectionTitle>
        </div>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.7',
          color: '#64748b',
          maxWidth: '540px',
          textAlign: 'right'
        }}>
          Each programme is designed with industry partners and led by practitioners with real-world experience in data roles.
        </p>
      </div>

      {/* Programs Grid */}
      {programs.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <p>No programs available at the moment.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Please check back later.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {programs.map((program) => (
            <ProgramCard key={program.title} program={program} />
          ))}
        </div>
      )}
    </section>
  );
}