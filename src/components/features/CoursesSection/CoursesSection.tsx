'use client';

import { useState, useEffect } from 'react';
import { ProgramCard } from '@/ui/ProgramCard/ProgramCard';
import { Icons } from '@/ui/Icons/Icons';
import { courseApi } from '@/lib/api/course/courseApi';
import { Course } from '@/types/course/types';
import { Program } from '@/types/program/types';
import { logger } from '@/lib/utils/logger';
import { motion } from 'framer-motion';
import { Skeleton } from '@/ui/skeleton/skeleton';

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
      logger.error('Failed to load courses:', err);
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

  return (
    <section id="programs" className="relative py-24 bg-transparent overflow-hidden w-full">
      <div className="px-6 md:px-12 lg:px-20 relative z-10 w-full max-w-[1600px] mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Our Programs</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Specialist <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Programs</span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Master the most in-demand skills with our specialized, project-driven curricula designed by industry experts.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <Skeleton className="h-[380px] w-full rounded-[24px]" />
            <Skeleton className="h-[380px] w-full rounded-[24px] hidden md:block" />
            <Skeleton className="h-[380px] w-full rounded-[24px] hidden lg:block" />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex flex-col items-center text-center max-w-md mx-auto">
            <p className="font-bold text-lg mb-2">Something went wrong</p>
            <p className="text-sm opacity-80 mb-6">{error}</p>
            <button 
              onClick={loadCourses}
              className="px-6 py-2.5 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            <p className="text-lg">No courses available at the moment.</p>
            <p className="text-sm mt-2">Please check back later.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              initial: { opacity: 0 },
              whileInView: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 }
              }
            }}
          >
            {courses.slice(0, 3).map((program, index) => (
              <motion.div 
                key={index} 
                variants={{
                  initial: { opacity: 0, y: 50, scale: 0.9 },
                  whileInView: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { type: "spring", stiffness: 100, damping: 15 }
                  }
                }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && courses.length > 4 && (
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="/courses"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-[15px] transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_30px_rgb(13,148,136,0.3)] hover:-translate-y-1 group"
            >
              View All Programs
              <Icons.ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}