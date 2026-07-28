'use client';

interface CareerSupportSectionProps {
  faqs: Array<{
    q: string;
    a: string;
  }>;
}

const DEFAULT_FAQS = [
  { q: "Do I need prior experience?", a: "No. We start from fundamentals and ramp up to job-ready skills with projects." },
  { q: "Is this suitable for career changers?", a: "Yes — the program is designed for reskilling and includes interview preparation." },
  { q: "How do I secure my spot?", a: "Click Enroll Now to reserve a seat. Once payment is confirmed, we'll onboard you with the next cohort details." },
  { q: "How long do I have access to the materials?", a: "You receive lifetime access to the course content, including all future updates and additions." },
  { q: "Is there any mentoring or support?", a: "Absolutely. We offer dedicated career support, 1-on-1 interview prep, and portfolio reviews to ensure you're job-ready." },
  { q: "What kind of computer do I need?", a: "Any modern laptop (Windows or Mac) with an internet connection will work fine. All heavier processing is done in the cloud." }
];

export function CareerSupportSection({ faqs }: CareerSupportSectionProps) {
  // Logic: Display DB faqs. If fewer than 6, pad with defaults.
  let displayFaqs = faqs || [];
  if (displayFaqs.length < 6) {
    const needed = 6 - displayFaqs.length;
    displayFaqs = [...displayFaqs, ...DEFAULT_FAQS.slice(0, needed)];
  }

  const faqsHtml = displayFaqs.map((faq, index) => (
    <details key={index} className="group bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] marker:content-[''] [&_summary::-webkit-details-marker]:hidden cursor-pointer overflow-hidden">
      <summary className="flex items-center justify-between font-display font-bold text-[1.1rem] text-[#0f172a] outline-none select-none tracking-tight">
        {faq.q}
        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 transition-transform duration-300 group-open:rotate-180">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </summary>
      <div className="mt-4 pt-4 border-t border-slate-900/10 text-slate-600 leading-relaxed text-[0.95rem]">
        {faq.a}
      </div>
    </details>
  ));

  const careerSupportItems = [
    "Resume optimisation",
    "LinkedIn branding",
    "Portfolio website creation",
    "GitHub project portfolio",
    "Technical interview preparation",
    "Competency-based interview coaching",
    "Mock interviews"
  ];

  const careerSupportHtml = careerSupportItems.map((item, index) => (
    <li key={index} className="flex items-start gap-3 text-[#475569] leading-relaxed text-[1.05rem]">
      <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      {item}
    </li>
  ));

  return (
    <section className="py-[100px] px-[5vw] bg-transparent">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[80px]">
        
        <div className="reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm mb-6">
            <span className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-primary">Career Support</span>
          </div>
          <h2 className="font-display italic text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0f172a] mb-8">
            We support you until job placement
          </h2>
          <ul className="flex flex-col gap-5">
            {careerSupportHtml}
          </ul>
        </div>
        
        <div className="reveal reveal-delay-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm mb-6">
            <span className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-primary">FAQs</span>
          </div>
          <h2 className="font-display italic text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0f172a] mb-8">
            Quick answers
          </h2>
          <div className="flex flex-col gap-4">
            {faqsHtml}
          </div>
        </div>
        
      </div>
    </section>
  );
}