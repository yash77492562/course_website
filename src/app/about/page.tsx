import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="w-full flex-grow pt-[120px] pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-8 h-[2px] bg-primary" />
            <div className="text-[13px] font-bold uppercase tracking-widest text-primary">
              Our Story
            </div>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-10">
            About Us
          </h1>
          
          <div className="prose prose-lg text-muted-foreground leading-relaxed">
            <p className="mb-6 text-xl text-slate-800 font-medium">
              We believe that data is more than just numbers on a screen; it's the foundation of modern decision-making and innovation.
            </p>
            <p className="mb-6">
              Founded with a mission to democratise high-level technical knowledge, Riva Data Academy was established to nurture the next generation of analysts, engineers, and scientists. Our founders recognised a growing disconnect between academic theory and the practical, gritty realities of working in enterprise data environments. We set out to close that gap.
            </p>
            <p className="mb-6">
              Our curriculum is continually refined by active industry practitioners. This ensures that every module, project, and piece of advice we offer is firmly rooted in the tools and methodologies currently driving success in top-tier tech companies and forward-thinking enterprises.
            </p>
            <p className="mb-6">
              Beyond the classroom, our consulting arm operates at the cutting edge of data infrastructure. This dual approach allows us to bring real-world enterprise challenges directly into our teaching environments, providing our students with an unparalleled, authentic learning experience that truly prepares them for the workforce.
            </p>
          </div>
          
          <div className="mt-12 bg-primary/5 border border-primary/10 p-6 rounded-2xl flex items-start gap-4 max-w-2xl">
            <span className="text-2xl" role="img" aria-label="Target">🎯</span>
            <div className="flex flex-col">
              <h3 className="text-slate-900 font-bold text-[16px] mb-1">Our Mission</h3>
              <p className="text-slate-600 font-medium text-[15px] leading-relaxed m-0">
                To empower individuals and organisations with the practical skills and architectural knowledge needed to thrive in a data-centric world.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}
