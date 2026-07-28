'use client';

import { motion } from 'framer-motion';

export function AboutSection() {
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

  const acronymItemVariants = {
    initial: { opacity: 0, x: -30 },
    whileInView: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <section 
      className="w-full relative py-24 bg-background overflow-hidden"
      id="about"
    >
      <div className="px-6 md:px-12 lg:px-20 relative z-10 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left side - Staggered RIVA Bento Grid */}
          <div className="lg:col-span-5 h-full relative z-20 w-full max-w-[500px] mx-auto lg:max-w-none grid grid-cols-2 gap-4 sm:gap-6">
            
            {/* Column 1 (Staggered down) */}
            <div className="flex flex-col gap-4 sm:gap-6 mt-8 sm:mt-12">
              
              {/* R - Reskilling (Primary Solid) */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                className="aspect-square bg-primary rounded-[32px] p-6 sm:p-8 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 shadow-xl"
              >
                <div className="absolute -bottom-6 -right-2 text-[140px] font-black text-white/10 group-hover:text-white/20 transition-colors duration-300 leading-none select-none">
                  R
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold">01</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    Reskilling
                  </span>
                </div>
              </motion.div>

              {/* V - Vision (Glassmorphic) */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                className="aspect-square bg-background border-2 border-border/60 rounded-[32px] p-6 sm:p-8 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl transition-all duration-300 shadow-sm"
              >
                <div className="absolute -bottom-6 -right-2 text-[140px] font-black text-primary/[0.05] group-hover:text-primary/[0.1] transition-colors duration-300 leading-none select-none">
                  V
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">03</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-foreground tracking-wide group-hover:text-primary transition-colors">
                    Vision
                  </span>
                </div>
              </motion.div>

            </div>

            {/* Column 2 (Staggered up) */}
            <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12">
              
              {/* I - Innovation (Glassmorphic) */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                className="aspect-square bg-background border-2 border-border/60 rounded-[32px] p-6 sm:p-8 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-2 hover:border-secondary/40 hover:shadow-xl transition-all duration-300 shadow-sm"
              >
                <div className="absolute -bottom-6 -right-2 text-[140px] font-black text-secondary/[0.05] group-hover:text-secondary/[0.1] transition-colors duration-300 leading-none select-none">
                  I
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold">02</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-foreground tracking-wide group-hover:text-secondary transition-colors">
                    Innovation
                  </span>
                </div>
              </motion.div>

              {/* A - Achievement (Secondary Solid) */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
                className="aspect-square bg-secondary rounded-[32px] p-6 sm:p-8 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 shadow-xl"
              >
                <div className="absolute -bottom-6 -right-2 text-[140px] font-black text-white/10 group-hover:text-white/20 transition-colors duration-300 leading-none select-none">
                  A
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold">04</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    Achievement
                  </span>
                </div>
              </motion.div>

            </div>

            {/* Background glowing orb behind the grid */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none -z-10"
            />
          </div>

          {/* Right side - Content */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center"
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants} className="mb-4 flex items-center gap-3">
              <div className="w-8 h-[2px] bg-primary" />
              <div className="text-[13px] font-bold uppercase tracking-widest text-primary">
                About Riva Data
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6 lg:mb-8">
              <h2 className="font-sans text-[32px] sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-foreground leading-[1.15] lg:leading-[1.1] tracking-tight">
                Reskilling. Innovation.<br className="hidden sm:block" />
                Vision. Achievement.<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  in Data.
                </span>
              </h2>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-[600px]">
              Riva Data is a UK-based data education institute and consultancy dedicated to bridging the gap between aspiration and expertise. We provide career-focused, practitioner-led training programmes that equip individuals with the technical skills and strategic mindset demanded by today's data-driven economy.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-[600px]">
              Beyond education, we partner with organisations to architect, modernise, and scale their data capabilities — from pipeline engineering to advanced AI analytics.
            </motion.p>

            <motion.div variants={itemVariants}>
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl flex items-start gap-4">
                <span className="text-2xl" role="img" aria-label="UK flag">🇬🇧</span>
                <p className="text-foreground font-medium text-[15px] leading-relaxed">
                  Proudly UK-based. Delivering world-class data education and consulting to professionals and organisations across Britain and beyond.
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}