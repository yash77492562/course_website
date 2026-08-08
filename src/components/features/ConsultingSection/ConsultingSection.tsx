'use client';

import { useState, useEffect } from 'react';
import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { ConsultingService } from '@/types/consulting/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsultingSectionProps {
  services: ConsultingService[];
}

export function ConsultingSection({ services }: ConsultingSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Infinite 2-second rotation
  useEffect(() => {
    if (!services || services.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % services.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [services]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.4 }
  };

  if (!services || services.length === 0) return null;
  const activeService = services[activeIndex];

  return (
    <section id="consulting" className="relative py-24 bg-transparent overflow-hidden w-full">
      <div className="px-6 md:px-12 lg:px-20 relative z-10 w-full max-w-[1600px] mx-auto">
        
        <motion.div {...fadeUp} className="max-w-3xl mb-16">
          <SectionLabel>Consulting Services</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-4">
            We Also Build the<br />
            <span className="text-primary">Infrastructure Organisations Need</span>
          </h2>
        </motion.div>

        {/* Dynamic 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Active Service Details */}
          <div className="flex flex-col justify-center h-full min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/5 p-2">
                    {activeService.icon}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans leading-tight">
                    {activeService.title}
                  </h3>
                </div>
                
                <div className="pl-4 border-l-2 border-primary/40 py-2">
                  <p className="text-[17px] sm:text-[18px] leading-relaxed text-slate-700 font-medium">
                    {activeService.body}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Clock-like Rotating Circle */}
          <div className="relative flex justify-center items-center h-[340px] sm:h-[450px]">
            {/* The Outer Circle */}
            <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-primary/20 bg-white/20 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(13,148,136,0.15)] flex items-center justify-center overflow-hidden shrink-0">
              
              {/* Spinning decorative 'clock' border */}
              <div className="absolute inset-0 sm:inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_20s_linear_infinite]" />
              
              {/* Animated Inner Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                  className="flex flex-col items-center text-center p-4 sm:p-8 z-10 w-full"
                >
                  <div className="flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 mb-3 sm:mb-6">
                    {activeService.icon}
                  </div>
                  <h4 className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight px-2 sm:px-0">
                    {activeService.title}
                  </h4>
                </motion.div>
              </AnimatePresence>
              
              {/* Internal Glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full blur-[50px] pointer-events-none" />
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-secondary/15 rounded-full blur-[30px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center mt-12 gap-3">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'w-8 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-primary/50'
              }`}
              aria-label={`Go to service ${index + 1}`}
            />
          ))}
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-24 p-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl max-w-6xl mx-auto shadow-sm"
        >
          <p className="text-[17px] leading-relaxed text-slate-600 m-0 font-medium">
            Riva Data brings a <strong className="text-slate-900">practitioner-first consulting approach</strong> to every engagement. We work as an extension of your team — understanding your data landscape, identifying gaps, and delivering robust, future-proof solutions. Whether you're starting your data journey or scaling an existing capability, we provide the <strong className="text-slate-900">strategic and technical expertise</strong> to move with confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}