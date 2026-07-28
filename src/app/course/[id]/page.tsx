'use client';

import { logger } from '@/lib/utils/logger';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { courseApi } from '@/lib/api/course/courseApi';
import { Course } from '@/types/course/types';
import { ProgramOutcomeSection } from '@/components/features/ProgramOutcomeSection/ProgramOutcomeSection';
import { CareerSupportSection } from '@/components/features/CareerSupportSection/CareerSupportSection';
import { AuthNavbar } from '@/components/layout/Navbar/AuthNavbar';
import { CourseAccessControl, usePayNow } from '@/components/features/CourseAccess/CourseAccessControl';
import { useAuth } from '@/hooks/auth/useAuth';
import { PayNowButton } from '@/components/features/CourseAccess/PayNowButton';

function CourseContent({ course, courseId }: { course: Course; courseId: string }) {
  const { showPaymentButtons } = usePayNow();

  // Debug logging
  useEffect(() => {
    logger.debug('[CourseContent] 🎨 Render with showPaymentButtons:', showPaymentButtons);
  }, [showPaymentButtons]);

  // Transform course data to match the expected format
  const programData = {
    badge: course.category?.toUpperCase() || "DATA ANALYTICS PROGRAM",
    headline: course.title,
    subheadline: course.description,
    price: `£${course.price}`,
    spotsLeft: course.spotsLeft || 7,
    nextCohort: course.nextCohort || "Next starting soon (date TBC)",
    highlights: course.tools || course.skills || course.highlights || ["SQL", "Excel", "Power BI", "Tableau", "Python", "Azure & Databricks"],
    outcomes: course.outcomes || [
      "Query and analyse data using SQL",
      "Perform advanced analysis using Excel",
      "Build professional dashboards in Power BI and Tableau",
      "Automate analytics workflows using Python",
      "Understand cloud-based analytics using Azure & Databricks",
      "Build a portfolio with real-world projects",
      "Pass technical and competency-based interviews"
    ],
    modules: course.modules?.length > 0 ? course.modules.map(module => ({
      id: module.id,
      title: module.title,
      items: module.objectives && module.objectives.length > 0 
        ? module.objectives 
        : [module.description],
      lessons: module.lessons || []
    })) : [],
    faqs: course.faqs && course.faqs.length > 0 
      ? course.faqs.map((faq: any) => ({
          q: faq.question || faq.q || '',
          a: faq.answer || faq.a || ''
        }))
      : [
          { q: "Do I need prior experience?", a: "No. We start from fundamentals and ramp up to job-ready skills with projects." },
          { q: "Is this suitable for career changers?", a: "Yes — the program is designed for reskilling and includes interview preparation." },
          { q: "How do I secure my spot?", a: "Click Pay Now to reserve a seat. Once payment is confirmed, we'll onboard you with the next cohort details." }
        ]
  };

  return (
    <>
      {/* Program Hero Section */}
      <section className="pt-[140px] pb-[80px] px-[5vw] bg-transparent relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-10 md:gap-[60px] items-start max-w-7xl mx-auto relative z-10">
          
          {/* Left Column: Course Details */}
          <div className="min-w-0 flex flex-col pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm mb-6 self-start">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-primary">{programData.badge}</span>
            </div>
            
            <h1 className="font-display italic text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0f172a] mb-6">
              {programData.headline}
            </h1>
            
            <p className="text-[1.15rem] leading-[1.7] text-[#475569] max-w-[600px] mb-10">
              {programData.subheadline}
            </p>

            <div className="flex gap-4 flex-wrap mb-10">
              <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 min-w-[170px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1">
                <div className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-slate-500 mb-2">Spots left</div>
                <div className="font-sans font-extrabold text-[#0f172a] text-[1.5rem] flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  {programData.spotsLeft}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 min-w-[170px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1">
                <div className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-slate-500 mb-2">Next cohort</div>
                <div className="font-sans font-bold text-[#0f172a] text-[1.15rem] leading-tight">{programData.nextCohort}</div>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 min-w-[170px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1">
                <div className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-slate-500 mb-2">Investment</div>
                <div className="font-sans font-extrabold text-primary text-[1.5rem]">{programData.price}</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-[0.8rem] font-semibold text-slate-500 uppercase tracking-widest mb-3">Key Technologies</div>
              <div className="flex gap-2.5 flex-wrap">
                {programData.highlights.map((tech, index) => (
                  <span key={index} className="text-[0.8rem] font-medium tracking-wide py-1.5 px-4 bg-white/80 border border-slate-200/60 text-[#334155] rounded-full shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {showPaymentButtons && (
              <>
                <div className="flex gap-4 flex-wrap items-center mt-4">
                  <PayNowButton className="inline-flex justify-center min-w-[160px] items-center gap-2 bg-primary hover:bg-primary/90 text-white py-[15px] px-[32px] rounded-full font-bold text-[1rem] no-underline transition-all duration-300 shadow-[0_4px_20px_rgba(13,148,136,0.25)] hover:shadow-[0_8px_30px_rgba(13,148,136,0.35)] hover:-translate-y-1 border-none cursor-pointer">
                    Enroll Now
                  </PayNowButton>
                  {programData.modules[0]?.lessons?.[0]?.id && (
                    <a
                      className="inline-flex justify-center items-center gap-2 bg-white text-[#0f172a] py-[15px] px-[32px] rounded-full border border-slate-200 font-semibold text-[1rem] no-underline transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1"
                      href={`/video-player/${programData.modules[0].lessons[0].id}`}
                    >
                      Watch free preview
                    </a>
                  )}
                  <a className="inline-flex justify-center items-center gap-2 bg-transparent text-slate-500 py-[15px] px-[24px] rounded-full font-medium text-[0.95rem] no-underline transition-colors duration-200 hover:text-primary" href="/contact">
                    Have questions?
                  </a>
                </div>
                <div className="mt-5 flex items-center gap-3 text-slate-500 text-[0.85rem] font-medium">
                  <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Secure checkout</span>
                  <span className="text-slate-300">•</span>
                  <span>Instant access</span>
                  <span className="text-slate-300">•</span>
                  <span>Limited cohort size</span>
                </div>
              </>
            )}

            {!showPaymentButtons && (
              <div className="flex gap-4 flex-wrap mt-4 items-center p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                <div className="flex-1">
                  <div className="font-bold text-emerald-800 text-lg mb-1">✅ You're Enrolled</div>
                  <p className="text-emerald-600 text-sm m-0">You have full lifetime access to this program.</p>
                </div>
                <a href={`/video-player/${programData.modules[0]?.lessons?.[0]?.id}`} className="inline-flex justify-center min-w-[160px] items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-[15px] px-[32px] rounded-full font-bold text-[1rem] no-underline transition-all duration-300 shadow-[0_4px_20px_rgba(5,150,105,0.25)] hover:shadow-[0_8px_30px_rgba(5,150,105,0.35)] hover:-translate-y-1 border-none cursor-pointer">
                  Continue Learning →
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Floating Checkout Card */}
          <div className="min-w-0">
            <div 
              className="border border-slate-100 rounded-[24px] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative md:sticky md:top-[120px] w-full mt-5 md:mt-0"
              style={{ backgroundColor: 'lab(92 -3.12 -0.26 / 0.9)' }}
            >
              {showPaymentButtons ? (
                <>
                  <div className="mb-6">
                    <div className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-primary mb-3">Reserve your seat</div>
                    <div className="font-sans text-[2.75rem] font-extrabold my-2 tracking-tight text-[#0f172a]">{programData.price}</div>
                    <div className="text-slate-500 text-[0.95rem] leading-relaxed">Seats are strictly limited to ensure high-quality mentoring for every student.</div>
                  </div>
                  
                  <PayNowButton className="w-full justify-center flex text-decoration-none items-center gap-2 bg-[#0f172a] hover:bg-black shadow-md text-white py-[16px] px-[30px] rounded-xl font-bold text-[1.05rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,23,42,0.2)] border-none cursor-pointer">
                    Enroll Now
                  </PayNowButton>
                  
                  <div className="flex flex-col gap-3.5 mt-8 pt-6 border-t border-slate-100">
                    <div className="font-semibold text-[#0f172a] text-sm mb-1">What's included:</div>
                    <div className="flex items-start gap-3 text-[0.95rem] text-slate-600">
                      <div className="mt-0.5 text-emerald-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <span>Comprehensive Career Support</span>
                    </div>
                    <div className="flex items-start gap-3 text-[0.95rem] text-slate-600">
                      <div className="mt-0.5 text-emerald-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <span>Real-world Portfolio Projects</span>
                    </div>
                    <div className="flex items-start gap-3 text-[0.95rem] text-slate-600">
                      <div className="mt-0.5 text-emerald-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <span>1-on-1 Interview Preparation</span>
                    </div>
                    <div className="flex items-start gap-3 text-[0.95rem] text-slate-600">
                      <div className="mt-0.5 text-emerald-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                      <span>Lifetime Access to Content</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="text-emerald-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-emerald-600 mb-2">Status</div>
                    <div className="font-sans text-[2rem] font-extrabold my-2 text-[#0f172a]">Enrolled</div>
                    <div className="text-slate-500 text-[0.95rem] leading-relaxed">You have full lifetime access to this program's materials and updates.</div>
                  </div>
                  <a href={`/video-player/${programData.modules[0]?.lessons?.[0]?.id}`} className="w-full justify-center flex text-decoration-none items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md text-white py-[16px] px-[30px] rounded-xl font-bold text-[1.05rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(5,150,105,0.2)] border-none cursor-pointer">
                    Continue Learning
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Program Outcome & Curriculum Section */}
      <ProgramOutcomeSection 
        courseId={courseId}
        outcomes={programData.outcomes}
        modules={programData.modules}
      />

      {/* Career Support & FAQs Section */}
      <CareerSupportSection faqs={programData.faqs} />

      {/* Sticky Pay Bar - only show if payment buttons are visible */}
      {showPaymentButtons && (
        <div className="fixed left-0 right-0 bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-[999]">
          <div className="max-w-7xl mx-auto py-3 px-[5vw] flex justify-between items-center gap-3.5">
            <div className="">
              <div className="font-sans font-bold text-base text-slate-900">{programData.badge}</div>
              <div className="font-sans font-normal text-sm text-slate-500">Spots left: {programData.spotsLeft} • {programData.price}</div>
            </div>
            <PayNowButton className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm text-foreground py-3.5 px-[30px] rounded-lg font-medium text-[0.95rem] no-underline transition-all duration-200 shadow-[0_4px_24px_rgba(14,165,233,0.35)] hover:shadow-[0_8px_32px_rgba(14,165,233,0.45)] hover:-translate-y-[2px] border-none cursor-pointer">Pay Now</PayNowButton>
          </div>
        </div>
      )}

      
    </>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await courseApi.getCourseById(courseId);
      logger.debug('Course data loaded:', data);
      logger.debug('Modules:', data.modules);
      if (data.modules && data.modules.length > 0) {
        logger.debug('First module lessons:', data.modules[0].lessons);
      }
      setCourse(data);
    } catch (err) {
      logger.error('Failed to load course:', err);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested course could not be found.'}</p>
          <a 
            href="/" 
            className="bg-blue-600 text-foreground px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Check if course is published - only show published courses to public
  if (course.status !== 'PUBLISHED') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Coming Soon</h1>
          <p className="text-gray-600 mb-4">This course is currently being prepared and will be available soon.</p>
          <a 
            href="/" 
            className="bg-blue-600 text-foreground px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Transform course data to match the expected format
  const programData = {
    badge: course.category?.toUpperCase() || "DATA ANALYTICS PROGRAM",
    headline: course.title,
    subheadline: course.description,
    price: `£${course.price}`,
    spotsLeft: course.spotsLeft || 7,
    nextCohort: course.nextCohort || "Next starting soon (date TBC)",
    highlights: course.tools || course.skills || course.highlights || ["SQL", "Excel", "Power BI", "Tableau", "Python", "Azure & Databricks"],
    outcomes: course.outcomes || [
      "Query and analyse data using SQL",
      "Perform advanced analysis using Excel",
      "Build professional dashboards in Power BI and Tableau",
      "Automate analytics workflows using Python",
      "Understand cloud-based analytics using Azure & Databricks",
      "Build a portfolio with real-world projects",
      "Pass technical and competency-based interviews"
    ],
    modules: course.modules?.length > 0 ? course.modules.map(module => ({
      id: module.id,
      title: module.title,
      items: module.objectives && module.objectives.length > 0 
        ? module.objectives 
        : [module.description],
      lessons: module.lessons || []
    })) : [
      {
        title: "Module 1: Foundations of Data Analytics",
        items: [
          "Introduction to the Data Analytics lifecycle",
          "Structured vs unstructured data",
          "Data-driven decision making",
          "Data roles in modern organisations",
          "Analytics tools and workflows"
        ]
      },
      {
        title: "Module 2: Excel for Data Analysis",
        items: [
          "Data cleaning and transformation",
          "Advanced formulas and functions",
          "Pivot tables and pivot charts",
          "Data visualisation best practices",
          "Dashboard creation in Excel",
          "Business analytics use cases"
        ]
      },
      {
        title: "Module 3: SQL for Data Analytics",
        items: [
          "Database fundamentals",
          "Writing SQL queries",
          "Joins, aggregations, filtering",
          "Window functions and advanced SQL",
          "Query optimisation techniques",
          "Real-world analysis scenarios"
        ]
      },
      {
        title: "Module 4: Data Visualisation & BI (Power BI + Tableau)",
        items: [
          "Power BI: Modelling, Power Query, DAX, dashboards, publishing",
          "Tableau: Data sources, visual analytics, interactive dashboards, storytelling"
        ]
      },
      {
        title: "Module 5: Python for Data Analysis",
        items: [
          "Python fundamentals",
          "Pandas + NumPy",
          "Matplotlib (visualisation)",
          "Data cleaning & preprocessing",
          "Exploratory Data Analysis (EDA)"
        ]
      },
      {
        title: "Module 6: Cloud Analytics (Azure & Databricks)",
        items: [
          "Intro to cloud data platforms",
          "Data storage and pipelines",
          "Databricks processing",
          "Collaborative analytics workflows"
        ]
      },
      {
        title: "Module 7: Real-World Analytics Projects",
        items: [
          "Sales performance dashboard",
          "Customer segmentation analysis",
          "Marketing campaign performance analysis",
          "Financial analytics dashboard"
        ]
      },
      {
        title: "Module 8: Career & Interview Preparation",
        items: [
          "Resume building",
          "LinkedIn optimisation",
          "Portfolio website + GitHub",
          "Technical + competency interviews",
          "Mock interviews with feedback"
        ]
      }
    ],
    faqs: course.faqs && course.faqs.length > 0 
      ? course.faqs.map((faq: any) => ({
          q: faq.question || faq.q || '',
          a: faq.answer || faq.a || ''
        }))
      : [
          { q: "Do I need prior experience?", a: "No. We start from fundamentals and ramp up to job-ready skills with projects." },
          { q: "Is this suitable for career changers?", a: "Yes — the program is designed for reskilling and includes interview preparation." },
          { q: "How do I secure my spot?", a: "Click Pay Now to reserve a seat. Once payment is confirmed, we'll onboard you with the next cohort details." }
        ]
  };

  return (
    <>
      <AuthNavbar />
      
      <CourseAccessControl
        courseId={courseId}
        courseTitle={course.title}
        coursePrice={course.price}
      >
        <CourseContent course={course} courseId={courseId} />
      </CourseAccessControl>
    </>
  );
}