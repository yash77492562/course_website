import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { PartnerPage } from '@/page-components/PartnerPage/PartnerPage';
import footerLinksData from '@/data/footerLinks/data.json';

export default function Partner() {
  return (
    <>
      <Navbar />
      <PartnerPage />
      <Footer footerData={footerLinksData} />
    </>
  );
}
