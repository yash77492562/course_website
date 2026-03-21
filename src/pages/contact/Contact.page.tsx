// pages/contact/Contact.page.tsx - Page composition (following kiro.md guidelines)
'use client';

import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { CTASection } from '@/components/features/CTASection/CTASection';

// Import data
import footerLinksData from '@/data/footerLinks/data.json';

export function ContactPage() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main className="w-full">
        <CTASection />
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}export default ContactPage;
