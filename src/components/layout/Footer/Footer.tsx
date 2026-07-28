'use client';

import Link from 'next/link';
import { LinkedInIcon, EmailIcon } from '@/ui/Icons/Icons';
import type { FooterData } from '@/types/footer/types';
import { motion, Variants } from 'framer-motion';

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

  return (
    <footer
      style={{
        background: 'transparent',
        padding: '56px 5vw 36px',
        borderTop: '1px solid rgba(15,23,42,0.1)',
        overflow: 'hidden'
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '40px',
            borderBottom: '1px solid rgba(15,23,42,0.1)',
            marginBottom: '32px',
            gap: '40px',
            flexWrap: 'wrap'
          }}
        >
          <motion.div variants={itemVariants} style={{ maxWidth: '320px' }}>
            <Link 
              href="/" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
                textDecoration: 'none'
              }}
            >
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#0f172a',
                  letterSpacing: '0.3px'
                }}
              >
                Riva Data
              </span>
            </Link>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(15,23,42,0.6)',
                maxWidth: '280px',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}
            >
              Reskilling professionals. Empowering organisations. Shaping the future of data in the UK and beyond.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(15,23,42,0.05)',
                border: '1px solid rgba(15,23,42,0.1)',
                borderRadius: '100px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                color: 'rgba(15,23,42,0.6)'
              }}
            >
              🇬🇧 United Kingdom
            </div>
          </motion.div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '40px'
            }}
          >
            {footerData.columns.map((column, index) => (
              <motion.div key={index} variants={itemVariants}>
                <h5
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    marginBottom: '16px'
                  }}
                >
                  {column.title}
                </h5>
                {column.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      color: 'rgba(15,23,42,0.6)',
                      marginBottom: '10px',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(15,23,42,0.6)';
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(15,23,42,0.5)'
            }}
          >
            © {currentYear} Riva Data Ltd. All rights reserved. Registered in England & Wales.
          </p>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Link
              href="https://www.linkedin.com/company/riva-data/"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(15,23,42,0.05)',
                border: '1px solid rgba(15,23,42,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(15,23,42,0.6)',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(13,148,136,0.1)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15,23,42,0.05)';
                e.currentTarget.style.borderColor = 'rgba(15,23,42,0.1)';
                e.currentTarget.style.color = 'rgba(15,23,42,0.6)';
              }}
            >
              <LinkedInIcon size={16} />
            </Link>
            <Link
              href="#"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(15,23,42,0.05)',
                border: '1px solid rgba(15,23,42,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(15,23,42,0.6)',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              aria-label="Email"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(13,148,136,0.1)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15,23,42,0.05)';
                e.currentTarget.style.borderColor = 'rgba(15,23,42,0.1)';
                e.currentTarget.style.color = 'rgba(15,23,42,0.6)';
              }}
            >
              <EmailIcon size={16} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}