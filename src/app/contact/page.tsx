import { ContactForm } from '@/components/features/ContactForm/ContactForm';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactForm />
      <Footer footerData={footerLinksData} />
    </>
  );
}
