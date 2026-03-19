'use client';

import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { AboutSection } from '@/components/features/AboutSection/AboutSection';

// Import data
import footerLinksData from '@/data/footerLinks/data.json';

export function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutSection />
      </main>
      <Footer footerData={footerLinksData} />
    </>
  );
}