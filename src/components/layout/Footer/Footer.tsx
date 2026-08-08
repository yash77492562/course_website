'use client';

import Link from 'next/link';
import { LinkedInIcon, EmailIcon, Icons } from '@/ui/Icons/Icons';
import type { FooterData } from '@/types/footer/types';
import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { courseApi } from '@/lib/api/course/courseApi';

interface FooterProps {
  footerData: FooterData;
}

export function Footer({ footerData }: FooterProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const currentYear = new Date().getFullYear();

  const [programs, setPrograms] = useState<{label: string, href: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.getPublishedCourses()
      .then(data => {
        const formatted = data.slice(0, 3).map((course: any) => ({
          label: course.title,
          href: `/course/${course.id}`
        }));
        setPrograms(formatted);
      })
      .catch(err => {
        console.error('Failed to fetch courses for footer', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <footer className="w-full bg-transparent pt-14 pb-8 px-6 md:px-12 lg:px-20 border-t border-slate-900/10 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full max-w-[1600px] mx-auto"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start pb-10 border-b border-slate-900/10 mb-8 gap-12 lg:gap-8 w-full">
          
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="w-full lg:max-w-[320px]">
            <Link 
              href="/" 
              className="inline-flex flex-col items-center gap-0 mb-4 no-underline"
            >
              <span className="font-sans font-bold text-[22px] text-slate-900 tracking-wide leading-[1.1]">
                Riva Data
              </span>
              <span className="font-sans font-semibold text-primary text-[11px] tracking-[0.25em] uppercase leading-none pl-[2px]">
                Academy
              </span>
            </Link>
            <p className="text-[0.95rem] text-slate-900/60 leading-relaxed mb-6 w-full max-w-sm">
              Reskilling professionals. Empowering organisations. Shaping the future of data in the UK and beyond.
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-900/5 border border-slate-900/10 rounded-full px-4 py-1.5 text-xs text-slate-900/60 font-medium">
              🇬🇧 United Kingdom
            </div>
          </motion.div>

          {/* Links Columns */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {footerData.columns.map((column, index) => {
              if (column.title === 'Programs') {
                return (
                  <motion.div 
                    key={index} 
                    variants={itemVariants} 
                    className="flex flex-col"
                  >
                    <h5 className="font-sans text-[0.85rem] font-bold tracking-[1.2px] uppercase text-slate-900 mb-5">
                      {column.title}
                    </h5>
                    <div className="flex flex-col gap-3">
                      {programs.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="text-[0.95rem] text-slate-900/60 hover:text-primary transition-colors no-underline"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  key={index} 
                  variants={itemVariants} 
                  className={`flex flex-col ${column.title === 'Services' ? 'hidden sm:flex' : ''}`}
                >
                  <h5 className="font-sans text-[0.85rem] font-bold tracking-[1.2px] uppercase text-slate-900 mb-5">
                    {column.title}
                  </h5>
                  <div className="flex flex-col gap-3">
                    {column.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        className={`text-[0.95rem] text-slate-900/60 no-underline ${
                          column.title === 'Services' 
                            ? 'cursor-default' 
                            : 'hover:text-primary transition-colors'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col-reverse sm:flex-row justify-between items-center sm:items-end flex-wrap gap-6 w-full"
        >
          <p className="text-[0.85rem] text-slate-900/50 text-center sm:text-left w-full sm:w-auto">
            © {currentYear} Riva Data Ltd. All rights reserved. Registered in England & Wales.
          </p>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Link
              href="tel:+447824045455"
              className="h-10 rounded-xl bg-slate-900/5 border border-slate-900/10 flex items-center justify-center text-slate-900/60 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all px-3 gap-2 no-underline"
              aria-label="Phone"
            >
              <Icons.Phone size={16} />
            </Link>
            <Link
              href="mailto:hello@rivadata.co.uk"
              className="h-10 rounded-xl bg-slate-900/5 border border-slate-900/10 flex items-center justify-center text-slate-900/60 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all px-3 gap-2 no-underline"
              aria-label="Email"
            >
              <EmailIcon size={16} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/riva-data/"
              className="w-10 h-10 rounded-xl bg-slate-900/5 border border-slate-900/10 flex items-center justify-center text-slate-900/60 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon size={18} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}