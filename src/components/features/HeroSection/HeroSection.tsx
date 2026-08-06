'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@/ui/Icons/Icons';
import { StatusBadge } from '@/ui/StatusBadge/StatusBadge';
import { HeroTitle, HeroSubtitle, GradientText } from '@/ui/Typography/Typography';
import { motion, useScroll, useTransform } from 'framer-motion';

export function HeroSection() {
  const { scrollY } = useScroll();
  // Continuous parallax effects for floating cards
  const float1 = useTransform(scrollY, [0, 1000], [0, -80]);
  const float2 = useTransform(scrollY, [0, 1000], [0, -40]);
  const float3 = useTransform(scrollY, [0, 1000], [0, -120]);

  const springUp = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    },
    viewport: { once: true, margin: "-50px" }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 120, damping: 20 }
    }
  };

  return (
    <section className="min-h-[90vh] relative flex items-center overflow-hidden bg-background pt-[110px] md:pt-[140px] pb-[70px] md:pb-[100px] w-full">
      {/* Background Decorative Mesh - using standard background and primary colors to remain consistent */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/[0.03] blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-secondary/[0.04] blur-3xl"
        />
      </div>

      <div className="px-6 md:px-12 lg:px-20 relative z-10 w-full max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN - TEXT CONTENT */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center"
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <StatusBadge>
                UK-Based Data Education & Consulting
              </StatusBadge>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <HeroTitle>
                Build Your Future<br />
                in <GradientText>Data</GradientText> with<br />
                <GradientText>Riva Data</GradientText>
              </HeroTitle>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6 sm:mb-10 max-w-[600px]">
              <HeroSubtitle>
                Reskilling professionals into industry-ready Data Analysts, Data Engineers, and Data Scientists through practical, real-world training and innovation-driven learning.
              </HeroSubtitle>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex gap-2 sm:gap-4 flex-wrap">
                <Link 
                  href="#programs" 
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 py-2.5 md:px-8 md:py-4 text-[0.85rem] md:text-[1rem] rounded-lg md:rounded-xl bg-primary text-white font-semibold shadow-lg hover:shadow-primary/25 hover:bg-primary/90 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 no-underline flex-1 sm:flex-none text-center"
                >
                  Explore Now
                  <ArrowRightIcon size={16} className="md:w-[18px] md:h-[18px]" />
                </Link>
                <Link 
                  href="/partner" 
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 py-2.5 md:px-8 md:py-4 text-[0.85rem] md:text-[1rem] rounded-lg md:rounded-xl bg-background text-foreground border-2 border-border font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 no-underline flex-1 sm:flex-none text-center whitespace-nowrap"
                >
                  Partner With Us
                </Link>
              </div>
            </motion.div>
          </motion.div>
          
          {/* RIGHT COLUMN - BENTO GRID / FLOATING STATS */}
          <div className="lg:col-span-5 relative mt-8 sm:mt-12 lg:mt-16 h-[360px] sm:h-[450px] lg:h-[500px] w-full max-w-[280px] sm:max-w-[440px] lg:max-w-none mx-auto perspective-1000 flex justify-center lg:block">
            {/* Center abstract circle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.4 }}
              className="absolute inset-0 m-auto w-[240px] sm:w-[320px] h-[240px] sm:h-[320px] rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden"
            >
              {/* Spinning inner dashed ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                className="absolute inset-4 rounded-full border-[2px] border-dashed border-primary/10"
              />
            </motion.div>

            {/* Stat Card 1: Programs */}
            <motion.div 
              style={{ y: float1 }}
              {...springUp}
              transition={{ ...springUp.transition, delay: 0.5 }}
              className="absolute top-[15%] sm:top-[10%] lg:top-[10%] left-[-2%] sm:left-[-2%] lg:-left-[10%] z-20"
            >
              <div className="bg-background p-3 sm:p-6 rounded-2xl border border-border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-[140px] sm:w-[220px]">
                <div className="font-sans text-[26px] sm:text-[42px] font-extrabold text-primary leading-none mb-1 sm:mb-2">
                  3
                </div>
                <div className="text-[10px] sm:text-[13px] tracking-wide uppercase text-muted-foreground font-semibold leading-tight">
                  Specialist<br />Programs
                </div>
              </div>
            </motion.div>

            {/* Stat Card 2: Industry Aligned */}
            <motion.div 
              style={{ y: float2 }}
              {...springUp}
              transition={{ ...springUp.transition, delay: 0.7 }}
              className="absolute top-[40%] sm:top-[40%] lg:top-[40%] right-[-5%] sm:right-[-2%] lg:-right-[15%] z-30"
            >
              <div className="bg-primary text-white p-3 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2 transition-all duration-300 w-[140px] sm:w-[220px]">
                <div className="font-sans text-[26px] sm:text-[42px] font-extrabold text-white leading-none mb-1 sm:mb-2">
                  100%
                </div>
                <div className="text-[10px] sm:text-[13px] tracking-wide uppercase text-white/90 font-semibold leading-tight">
                  Industry<br />Aligned
                </div>
              </div>
            </motion.div>

            {/* Stat Card 3: UK Based */}
            <motion.div 
              style={{ y: float1 }}
              {...springUp}
              transition={{ ...springUp.transition, delay: 0.5 }}
              className="absolute bottom-[-1%]  left-[-2%] sm:left-[-2%] lg:left-[10%] z-20"
            >
              <div className="bg-background p-3 sm:p-6 rounded-2xl border border-border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-[140px] sm:w-[220px]">
                <div className="font-sans text-[26px] sm:text-[42px] font-extrabold text-primary leading-none mb-1 sm:mb-2">
                  UK
                </div>
                <div className="text-[10px] sm:text-[13px] tracking-wide uppercase text-muted-foreground font-semibold leading-tight">
                  Based &<br />Accredited
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}