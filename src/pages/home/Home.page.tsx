'use client';

import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { HeroSection } from '@/components/features/HeroSection/HeroSection';
import { AboutSection } from '@/components/features/AboutSection/AboutSection';

// Import data
import footerLinksData from '@/data/footerLinks/data.json';

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        {/* More sections will be added here */}
      </main>
      <Footer footerData={footerLinksData} />
    </>
  );
}
export default HomePage;