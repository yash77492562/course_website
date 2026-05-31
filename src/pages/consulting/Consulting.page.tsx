// pages/consulting/Consulting.page.tsx - Page composition (following kiro.md guidelines)
'use client';

import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { ConsultingSection } from '@/components/features/ConsultingSection/ConsultingSection';

// Import data
import footerLinksData from '@/data/footerLinks/data.json';
import consultingData from '@/data/consulting/data.json';

export function ConsultingPage() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main className="w-full">
        <ConsultingSection services={consultingData} />
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}

export default ConsultingPage;