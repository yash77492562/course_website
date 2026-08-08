import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';
import Link from 'next/link';
import { Icons } from '@/ui/Icons/Icons';
import { EmailIcon } from '@/ui/Icons/Icons';

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="w-full flex-grow pt-[120px] pb-24 px-6 md:px-12 lg:px-20 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full mx-auto text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="w-8 h-[2px] bg-primary" />
            <div className="text-[13px] font-bold uppercase tracking-widest text-primary">
              Get In Touch
            </div>
            <div className="w-8 h-[2px] bg-primary" />
          </div>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-10">
            Contact Us
          </h1>
          
          <div className="prose prose-lg text-muted-foreground leading-relaxed mx-auto mb-12">
            <p className="text-xl text-slate-800 font-medium">
              We'd love to hear from you. Reach out to us directly using the details below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="mailto:hello@rivadata.co.uk"
              className="flex flex-col items-center p-8 bg-white border border-slate-200 rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <EmailIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-600 font-medium">hello@rivadata.co.uk</p>
            </Link>

            <Link 
              href="tel:+447824045455"
              className="flex flex-col items-center p-8 bg-white border border-slate-200 rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icons.Phone size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Call Us</h3>
              <p className="text-slate-600 font-medium">+44 7824 045455</p>
            </Link>
          </div>

        </div>
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}
