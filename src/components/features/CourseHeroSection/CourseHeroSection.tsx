'use client';

import { logger } from '@/lib/utils/logger';
import { useRouter } from 'next/navigation';
import { useCourseAccess } from '@/hooks/course/useCourseAccess';

interface CourseHeroSectionProps {
  courseId?: string; // Add courseId to check purchase status
  programData: {
    badge: string;
    headline: string;
    subheadline: string;
    price: string;
    spotsLeft: number;
    nextCohort: string;
    checkoutUrl: string;
    highlights: string[];
  };
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function CourseHeroSection({ courseId, programData }: CourseHeroSectionProps) {
  const router = useRouter();
  const { hasAccess, isLoading } = useCourseAccess(courseId || null);

  // Debug logging
  logger.debug('[CourseHeroSection] Render state:', {
    courseId,
    hasAccess,
    isLoading,
    showPayButtons: !hasAccess && !isLoading
  });

  const handleTalkToUs = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/contact');
  };

  const handleStartLearning = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to the first lesson of the course
    router.push(`/courses/${courseId}`);
  };

  const highlightsHtml = (programData.highlights || []).map((tag, index) => (
    <span key={index} className="tag">{escapeHtml(tag)}</span>
  ));

  return (
    <>
      <section className="program-hero">
        <div className="program-hero-inner">
          <div className="program-hero-left">
            <span className="section-label">{escapeHtml(programData.badge)}</span>
            <h1 className="section-title">{escapeHtml(programData.headline)}</h1>
            <p className="section-sub">{escapeHtml(programData.subheadline)}</p>

            <div className="program-meta">
              <div className="program-meta-box">
                <div className="meta-k">Spots left</div>
                <div className="meta-v">{escapeHtml(String(programData.spotsLeft))}</div>
              </div>
              <div className="program-meta-box">
                <div className="meta-k">Next cohort</div>
                <div className="meta-v">{escapeHtml(programData.nextCohort)}</div>
              </div>
              <div className="program-meta-box">
                <div className="meta-k">Price</div>
                <div className="meta-v">{escapeHtml(programData.price)}</div>
              </div>
            </div>

            <div className="program-tags">{highlightsHtml}</div>

            {!isLoading && (
              <div className="program-cta-row">
                {hasAccess ? (
                  <>
                    <button className="btn-primary" onClick={handleStartLearning}>
                      Start Learning →
                    </button>
                    <p className="access-note">✅ You have full access to this course</p>
                  </>
                ) : (
                  <>
                    <a className="btn-primary" href={escapeHtml(programData.checkoutUrl)} target="_blank" rel="noopener noreferrer">Pay Now</a>
                    <a className="btn-outline-dark" href="#talk" onClick={handleTalkToUs}>Talk to us first</a>
                  </>
                )}
              </div>
            )}

            {!hasAccess && !isLoading && (
              <p className="trust-note">Secure checkout • Seat reserved after payment • Limited cohort size</p>
            )}
          </div>

          <div className="program-hero-right">
            {!isLoading && (
              <div className="pricing-card reveal">
                {hasAccess ? (
                  <>
                    <div className="pricing-card-top">
                      <div className="pricing-title">You're enrolled!</div>
                      <div className="pricing-enrolled">✅ Full Access</div>
                      <div className="pricing-small">Start learning and build your portfolio.</div>
                    </div>
                    <button className="btn-primary pricing-pay" onClick={handleStartLearning}>
                      Continue Learning
                    </button>
                    <div className="pricing-badges">
                      <div className="badge-pill">✅ Career support included</div>
                      <div className="badge-pill">✅ Portfolio projects</div>
                      <div className="badge-pill">✅ Interview prep</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pricing-card-top">
                      <div className="pricing-title">Reserve your seat</div>
                      <div className="pricing-price">{escapeHtml(programData.price)}</div>
                      <div className="pricing-small">Seats are limited to keep mentoring quality high.</div>
                    </div>
                    <a className="btn-primary pricing-pay" href={escapeHtml(programData.checkoutUrl)} target="_blank" rel="noopener noreferrer">Pay Now</a>
                    <div className="pricing-badges">
                      <div className="badge-pill">✅ Career support included</div>
                      <div className="badge-pill">✅ Portfolio projects</div>
                      <div className="badge-pill">✅ Interview prep</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky pay bar - only show if user hasn't purchased */}
      {!isLoading && !hasAccess && (
        <div className="sticky-pay">
          <div className="sticky-pay-inner">
            <div className="sticky-left">
              <div className="sticky-title">{escapeHtml(programData.badge)}</div>
              <div className="sticky-sub">Spots left: {escapeHtml(String(programData.spotsLeft))} • {escapeHtml(programData.price)}</div>
            </div>
            <a className="btn-primary" href={escapeHtml(programData.checkoutUrl)} target="_blank" rel="noopener noreferrer">Pay Now</a>
          </div>
        </div>
      )}

      <style jsx>{`
        .program-hero{padding:120px 5vw 70px;background:var(--grey-50)}
        .program-hero-inner{display:grid;grid-template-columns:1.4fr 0.8fr;gap:34px;align-items:start;max-width:1200px;margin:0 auto}
        .program-meta{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0 16px}
        .program-meta-box{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;min-width:160px}
        .meta-k{font-size:.72rem;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px}
        .meta-v{font-family:'DM Sans',sans-serif;font-weight:700;color:var(--text-primary);font-size:1.05rem}
        .pricing-price{font-family:'DM Sans',sans-serif;font-size:2.2rem;font-weight:800;margin:8px 0 6px;letter-spacing:-0.5px}
        .program-tags{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 22px}
        .program-cta-row{display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;align-items:center}
        .trust-note{margin-top:14px;color:var(--text-muted);font-size:.9rem}
        .access-note{margin:0;color:#10b981;font-size:.95rem;font-weight:500}
        .pricing-enrolled{font-family:'DM Sans',sans-serif;font-size:1.8rem;font-weight:700;margin:8px 0 6px;color:#10b981}
        .pricing-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:22px;position:sticky;top:92px}
        .pricing-title{font-size:.85rem;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted)}
        .pricing-small{color:var(--text-muted);font-size:.9rem;line-height:1.5}
        .pricing-pay{width:100%;justify-content:center;margin:14px 0}
        .pricing-badges{display:flex;flex-direction:column;gap:12px;margin-top:20px}
        .badge-pill{font-size:.85rem;color:var(--text-primary);background:var(--grey-50);border:1px solid #e2e8f0;border-radius:999px;padding:8px 10px}
        .sticky-pay{position:fixed;left:0;right:0;bottom:0;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);border-top:1px solid #e2e8f0;z-index:999}
        .sticky-pay-inner{max-width:1200px;margin:0 auto;padding:12px 5vw;display:flex;justify-content:space-between;align-items:center;gap:14px}
        .sticky-title{font-family:'DM Sans',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0;color:var(--text-primary)}
        .sticky-sub{font-family:'DM Sans',sans-serif;font-weight:400;font-size:.9rem;color:var(--text-muted)}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--grad-blue);color:#fff;padding:14px 30px;border-radius:8px;font-weight:500;font-size:0.95rem;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 24px rgba(14,165,233,0.35)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(14,165,233,0.45)}
        .btn-outline-dark{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--text-primary);padding:13px 28px;border-radius:8px;border:1.5px solid #d1d5db;font-weight:400;font-size:0.95rem;text-decoration:none;transition:border-color 0.2s,color 0.2s}
        .btn-outline-dark:hover{border-color:var(--electric);color:var(--electric)}
        @media(max-width:900px){
          .program-hero-inner{grid-template-columns:1fr}
          .pricing-card{position:relative;top:auto}
        }
      `}</style>
    </>
  );
}