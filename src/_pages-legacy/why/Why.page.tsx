// pages/why/Why.page.tsx - Page composition (following kiro.md guidelines)
'use client';

import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { WhySection } from '@/components/features/WhySection/WhySection';

// Import data
import footerLinksData from '@/data/footerLinks/data.json';
import whyData from '@/data/why/data.json';

export function WhyPage() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main className="w-full">
        <WhySection data={whyData} />
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}export default WhyPage;
