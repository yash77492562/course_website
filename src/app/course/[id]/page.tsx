'use client';

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
    console.log('[CourseContent] 🎨 Render with showPaymentButtons:', showPaymentButtons);
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
    faqs: course.faqs && course.faqs.length > 0 ? course.faqs : [
      { q: "Do I need prior experience?", a: "No. We start from fundamentals and ramp up to job-ready skills with projects." },
      { q: "Is this suitable for career changers?", a: "Yes — the program is designed for reskilling and includes interview preparation." },
      { q: "How do I secure my spot?", a: "Click Pay Now to reserve a seat. Once payment is confirmed, we'll onboard you with the next cohort details." }
    ]
  };

  return (
    <>
      {/* Program Hero Section */}
      <section className="program-hero">
        <div className="program-hero-inner">
          <div className="program-hero-left">
            <span className="section-label">{programData.badge}</span>
            <h1 className="section-title">{programData.headline}</h1>
            <p className="section-sub">{programData.subheadline}</p>

            <div className="program-meta">
              <div className="program-meta-box">
                <div className="meta-k">Spots left</div>
                <div className="meta-v">{programData.spotsLeft}</div>
              </div>
              <div className="program-meta-box">
                <div className="meta-k">Next cohort</div>
                <div className="meta-v">{programData.nextCohort}</div>
              </div>
              <div className="program-meta-box">
                <div className="meta-k">Price</div>
                <div className="meta-v">{programData.price}</div>
              </div>
            </div>

            <div className="program-tags">
              {programData.highlights.map((tech, index) => (
                <span key={index} className="tag">{tech}</span>
              ))}
            </div>

            {showPaymentButtons && (
              <>
                <div className="program-cta-row">
                  <PayNowButton className="btn-primary">Pay Now</PayNowButton>
                  <a className="btn-outline-dark" href="/contact">Talk to us first</a>
                </div>
                <p className="trust-note">Secure checkout • Seat reserved after payment • Limited cohort size</p>
              </>
            )}

            {!showPaymentButtons && (
              <div className="program-cta-row">
                <a href={`/video-player/${programData.modules[0]?.lessons?.[0]?.id}`} className="btn-primary">
                  Start Learning →
                </a>
                <p className="access-granted">✅ You have full access to this course</p>
              </div>
            )}
          </div>

          <div className="program-hero-right">
            <div className="pricing-card reveal">
              {showPaymentButtons ? (
                <>
                  <div className="pricing-card-top">
                    <div className="pricing-title">Reserve your seat</div>
                    <div className="pricing-price">{programData.price}</div>
                    <div className="pricing-small">Seats are limited to keep mentoring quality high.</div>
                  </div>
                  <PayNowButton className="btn-primary pricing-pay">Pay Now</PayNowButton>
                  <div className="pricing-badges">
                    <div className="badge-pill">✅ Career support included</div>
                    <div className="badge-pill">✅ Portfolio projects</div>
                    <div className="badge-pill">✅ Interview prep</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pricing-card-top">
                    <div className="pricing-title">You're Enrolled!</div>
                    <div className="pricing-enrolled">✅ Full Access</div>
                    <div className="pricing-small">Start learning and build your portfolio.</div>
                  </div>
                  <a href={`/video-player/${programData.modules[0]?.lessons?.[0]?.id}`} className="btn-primary pricing-pay">
                    Continue Learning
                  </a>
                  <div className="pricing-badges">
                    <div className="badge-pill">✅ Career support included</div>
                    <div className="badge-pill">✅ Portfolio projects</div>
                    <div className="badge-pill">✅ Interview prep</div>
                  </div>
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
        <div className="sticky-pay">
          <div className="sticky-pay-inner">
            <div className="sticky-left">
              <div className="sticky-title">{programData.badge}</div>
              <div className="sticky-sub">Spots left: {programData.spotsLeft} • {programData.price}</div>
            </div>
            <PayNowButton className="btn-primary">Pay Now</PayNowButton>
          </div>
        </div>
      )}

      <style jsx>{`
        .program-hero{padding:120px 5vw 70px;background:var(--grey-50)}
        .program-hero-inner{display:grid;grid-template-columns:1.4fr 0.8fr;gap:34px;align-items:start;max-width:1200px;margin:0 auto}
        .program-hero-left{min-width:0}
        .program-hero-right{min-width:0}
        .program-meta{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0 16px}
        .program-meta-box{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;min-width:160px}
        .meta-k{font-size:.72rem;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px}
        .meta-v{font-family:'DM Sans',sans-serif;font-weight:700;color:var(--text-primary);font-size:1.05rem}
        .pricing-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:22px;position:sticky;top:92px;width:100%}
        .pricing-card-top{margin-bottom:14px}
        .pricing-title{font-size:.85rem;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px}
        .pricing-price{font-family:'DM Sans',sans-serif;font-size:2.2rem;font-weight:800;margin:8px 0 6px;letter-spacing:-0.5px;color:var(--text-primary)}
        .pricing-enrolled{font-family:'DM Sans',sans-serif;font-size:1.8rem;font-weight:700;margin:8px 0 6px;color:#10b981}
        .pricing-small{color:var(--text-muted);font-size:.9rem;line-height:1.5}
        .pricing-pay{width:100%;justify-content:center;margin:14px 0;display:flex;text-decoration:none}
        .pricing-badges{display:flex;flex-direction:column;gap:12px;margin-top:20px}
        .badge-pill{font-size:.85rem;color:var(--text-primary);background:var(--grey-50);border:1px solid #e2e8f0;border-radius:999px;padding:8px 10px}
        .program-tags{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 22px}
        .program-cta-row{display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;align-items:center}
        .trust-note{margin-top:14px;color:var(--text-muted);font-size:.9rem}
        .access-granted{margin:0;color:#10b981;font-size:.95rem;font-weight:500}
        .sticky-pay{position:fixed;left:0;right:0;bottom:0;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);border-top:1px solid #e2e8f0;z-index:999}
        .sticky-pay-inner{max-width:1200px;margin:0 auto;padding:12px 5vw;display:flex;justify-content:space-between;align-items:center;gap:14px}
        .sticky-title{font-family:'DM Sans',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0;color:var(--text-primary)}
        .sticky-sub{font-family:'DM Sans',sans-serif;font-weight:400;font-size:.9rem;color:var(--text-muted)}
        .tag{font-size:.72rem;font-weight:500;letter-spacing:.4px;padding:3px 10px;background:var(--grey-100);color:var(--text-muted);border-radius:100px}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--grad-blue);color:#fff;padding:14px 30px;border-radius:8px;font-weight:500;font-size:.95rem;text-decoration:none;transition:transform .2s,box-shadow .2s;box-shadow:0 4px 24px rgba(14,165,233,.35);border:none;cursor:pointer}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(14,165,233,.45)}
        .btn-outline-dark{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--text-primary);padding:13px 28px;border-radius:8px;border:1.5px solid #d1d5db;font-weight:400;font-size:.95rem;text-decoration:none;transition:border-color .2s,color .2s}
        .btn-outline-dark:hover{border-color:var(--electric);color:var(--electric)}
        .section-label{display:inline-flex;align-items:center;gap:6px;font-size:.72rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--electric);margin-bottom:14px}
        .section-label::before{content:'';display:block;width:18px;height:1.5px;background:var(--electric);border-radius:2px}
        .section-title{font-family:'Syne',sans-serif;font-size:clamp(1.9rem,3.5vw,2.8rem);font-weight:700;line-height:1.2;letter-spacing:-0.3px;color:var(--text-primary);margin-bottom:16px}
        .section-sub{font-size:1.05rem;line-height:1.7;color:var(--text-muted);max-width:540px}
        .reveal{opacity:1;transform:translateY(0)}
        :root{--navy:#050d1f;--navy-mid:#0b1a35;--navy-light:#112247;--electric:#0ea5e9;--teal:#06b6d4;--teal-dim:rgba(6,182,212,0.15);--white:#ffffff;--grey-50:#f7f8fa;--grey-100:#eef0f5;--grey-400:#94a3b8;--grey-600:#64748b;--text-primary:#0f172a;--text-muted:#64748b;--grad-blue:linear-gradient(135deg,#0ea5e9,#06b6d4);--grad-dark:linear-gradient(160deg,#050d1f 0%,#0d1f40 60%,#0a2240 100%)}
        @media(max-width:900px){
          .program-hero-inner{grid-template-columns:1fr;gap:24px}
          .pricing-card{position:relative;top:auto;margin-top:20px}
        }
      `}</style>
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
      console.log('Course data loaded:', data);
      console.log('Modules:', data.modules);
      if (data.modules && data.modules.length > 0) {
        console.log('First module lessons:', data.modules[0].lessons);
      }
      setCourse(data);
    } catch (err) {
      console.error('Failed to load course:', err);
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
    faqs: course.faqs && course.faqs.length > 0 ? course.faqs : [
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