'use client';

interface CareerSupportSectionProps {
  faqs: Array<{
    q: string;
    a: string;
  }>;
}

export function CareerSupportSection({ faqs }: CareerSupportSectionProps) {
  const faqsHtml = (faqs || [])
    .map((faq, index) => (
      <details key={index} className="faq-item">
        <summary>{faq.q}</summary>
        <p>{faq.a}</p>
      </details>
    ));

  return (
    <section className="program-section program-section-alt">
      <div className="program-two-col">
        <div className="reveal">
          <span className="section-label">Career Support</span>
          <h2 className="section-title">We support you until job placement</h2>
          <ul className="bullets">
            <li>Resume optimisation</li>
            <li>LinkedIn branding</li>
            <li>Portfolio website creation</li>
            <li>GitHub project portfolio</li>
            <li>Technical interview preparation</li>
            <li>Competency-based interview coaching</li>
            <li>Mock interviews</li>
          </ul>
        </div>
        <div className="reveal reveal-delay-1">
          <span className="section-label">FAQs</span>
          <h2 className="section-title">Quick answers</h2>
          <div className="accordion">{faqsHtml}</div>
        </div>
      </div>
    </section>
  );
}