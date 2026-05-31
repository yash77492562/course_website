// app/page.tsx - Route file (following kiro.md guidelines)
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { HeroSection } from '@/components/features/HeroSection/HeroSection';
import { AboutSection } from '@/components/features/AboutSection/AboutSection';
import { CoursesSection } from '@/components/features/CoursesSection/CoursesSection';
import { WhySection } from '@/components/features/WhySection/WhySection';
import { ConsultingSection } from '@/components/features/ConsultingSection/ConsultingSection';
import { CTASection } from '@/components/features/CTASection/CTASection';

// Import data
import footerLinksData from '@/data/footerLinks/data.json';
import whyData from '@/data/why/data.json';
import consultingData from '@/data/consulting/data.json';

export default function HomeRoute() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <AboutSection />
        <CoursesSection />
        <WhySection data={whyData} />
        <ConsultingSection services={consultingData} />
        <CTASection />
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}
