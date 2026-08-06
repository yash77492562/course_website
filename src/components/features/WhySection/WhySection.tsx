'use client';

import { WhyData } from '@/types/why/types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface WhySectionProps {
  data: WhyData;
}

export function WhySection({ data }: WhySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  console.log("WhySection render! data.reasons length:", data?.reasons?.length);

  const floatY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    },
    viewport: { once: true, margin: "-100px" }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    whileInView: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-24 bg-background overflow-hidden w-full"
    >
      {/* Decorative Background Element */}
      <motion.div 
        style={{ y: floatY }}
        className="absolute right-[-10%] top-[20%] w-[50vw] h-[50vw] rounded-full bg-primary/[0.02] blur-3xl pointer-events-none"
      />

      <div className="px-6 md:px-12 lg:px-20 relative z-10 w-full max-w-[1600px] mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <div className="text-[14px] uppercase tracking-widest text-primary font-bold mb-4">
            Why Riva Data
          </div>
          <h2 className="font-sans text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            Training Built on<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Consulting Experience
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Side: Compact 2x2 Bento Grid + Wide Anchor */}
          <motion.div 
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
          >
            {data.reasons.slice(0, 4).map((reason, index) => {
              // Diagonal color scheme mirroring the RIVA box above
              const isPrimary = index === 0;
              const isSecondary = index === 3;
              const isGlass = index === 1 || index === 2;

              return (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className={`relative overflow-hidden rounded-[32px] p-6 sm:p-8 transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between ${
                    isPrimary ? 'bg-primary text-primary-foreground shadow-xl' :
                    isSecondary ? 'bg-gradient-to-r from-[#505FDC] to-[#1371FF] text-white shadow-xl' :
                    'bg-background border-2 border-border/60 hover:border-primary/30 shadow-sm'
                  }`}
                >
                  {/* Background decoration for solid cards */}
                  {isPrimary && <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />}
                  {isSecondary && <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />}
                  {isGlass && <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/[0.03] rounded-full blur-2xl pointer-events-none transition-transform duration-700 group-hover:bg-primary/[0.08]" />}
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                      isPrimary || isSecondary ? 'bg-white/20 backdrop-blur-md shadow-inner' : 'bg-primary/10 group-hover:bg-primary shadow-sm'
                    }`}>
                      <span className={`text-xl transition-colors duration-300 ${isPrimary || isSecondary ? 'opacity-100' : 'opacity-80 group-hover:text-white group-hover:opacity-100'}`}>
                        {reason.icon}
                      </span>
                    </div>
                    <h3 className={`font-sans text-[20px] sm:text-[22px] font-extrabold leading-tight tracking-tight ${isPrimary || isSecondary ? 'text-white' : 'text-foreground'}`}>
                      {reason.title}
                    </h3>
                  </div>
                  
                  <p className={`text-[14px] sm:text-[15px] leading-relaxed relative z-10 ${isPrimary || isSecondary ? 'text-white/80 font-medium' : 'text-muted-foreground'}`}>
                    {reason.description}
                  </p>
                </motion.div>
              );
            })}

            {/* Manually render 5th card to ensure it never disappears */}
            {data.reasons[4] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.6 }}
                className="sm:col-span-2 relative overflow-hidden rounded-[32px] p-8 sm:p-10 bg-slate-950 border border-white/10 shadow-2xl transition-all duration-500 group hover:-translate-y-2 flex flex-col justify-between"
              >
                {/* Wide Card Glassmorphic Effects */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-50%] left-[-10%] w-[60%] h-[150%] bg-secondary/20 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 relative z-10">
                  <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md shadow-inner border border-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <span className="text-2xl opacity-100 transition-colors duration-300">
                      {data.reasons[4].icon}
                    </span>
                  </div>
                  <h3 className="font-sans text-[24px] sm:text-[28px] font-extrabold leading-tight tracking-tight text-white">
                    {data.reasons[4].title}
                  </h3>
                </div>
                
                <p className="text-[14px] sm:text-[16px] leading-relaxed relative z-10 max-w-3xl text-white/80 font-medium">
                  {data.reasons[4].description}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side: Ultra-Premium Metrics Dashboard */}
          <motion.div 
            className="lg:col-span-4 h-full relative group"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          >
            {/* Massive Glowing Neon Aura behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-br from-primary via-secondary to-purple-600 rounded-[34px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            
            <div className="h-full bg-slate-950 border border-white/10 rounded-[32px] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl z-10">
              
              {/* Complex Glassmorphic Background Elements */}
              <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse" />
                  <div className="text-[11px] tracking-[3px] uppercase text-white/60 font-black">
                    Live Outcomes Data
                  </div>
                </div>
                
                <div className="flex flex-col gap-8">
                  {data.metrics.map((metric, index) => (
                    <div key={index} className="group/metric">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-white/80 font-medium text-[15px] group-hover/metric:text-white transition-colors duration-300">
                          {metric.name}
                        </span>
                        <span className="font-sans text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                          {metric.display}
                        </span>
                      </div>
                      
                      {/* Premium Gradient Progress Bar */}
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (index * 0.15) }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary relative"
                        >
                          {/* Inner glowing core of the progress bar */}
                          <div className="absolute inset-0 bg-white/20 w-1/2" style={{ filter: 'blur(4px)' }} />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-white/40 text-[13px] leading-relaxed border-t border-white/10 pt-6 relative z-10 font-medium">
                Based on our latest student outcomes and industry placement data across the UK. Automatically updated.
              </div>
            </div>
          </motion.div>

        </div>


      </div>
    </section>
  );
}