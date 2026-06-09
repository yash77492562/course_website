// pages/programs/Programs.page.tsx - Page composition (following kiro.md guidelines)
'use client';

import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { ProgramsSection } from '@/components/features/ProgramsSection/ProgramsSection';

// Import data
import footerLinksData from '@/data/footerLinks/data.json';

export function ProgramsPage() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main className="w-full">
        <ProgramsSection />
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}

export default ProgramsPage;
