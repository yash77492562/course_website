'use client';

import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { motion, Variants } from 'framer-motion';

export function CTASection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, type: 'spring', bounce: 0.4 }
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-[5vw] relative overflow-hidden"
      style={{ background: 'transparent', textAlign: 'center' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[640px] mx-auto relative z-10"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <SectionLabel>Get Started</SectionLabel>
        </motion.div>
        
        <motion.h2 
          variants={itemVariants}
          className="font-sans text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-6"
        >
          Start Your Data<br />Transformation Today.
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-[1.1rem] leading-[1.7] text-slate-600 max-w-[480px] mx-auto mb-10 text-center"
        >
          Whether you're an individual looking to break into data or an organisation ready to unlock the power of your data assets — Riva Data is your partner.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-4 flex-wrap"
        >
          <a
            href="/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-primary)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(13,148,136,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(13,148,136,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(13,148,136,0.2)';
            }}
          >
            Explore Now
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(10px)',
              color: '#0f172a',
              padding: '14px 32px',
              borderRadius: '12px',
              border: '1.5px solid rgba(15,23,42,0.1)',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.borderColor = 'rgba(15,23,42,0.1)';
              e.currentTarget.style.color = '#0f172a';
            }}
          >
            Talk With Us
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}