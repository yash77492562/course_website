import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';

export default function CareersPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="w-full flex-grow pt-[120px] pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-8 h-[2px] bg-primary" />
            <div className="text-[13px] font-bold uppercase tracking-widest text-primary">
              Your Future
            </div>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-10">
            Career Support
          </h1>
          
          <div className="prose prose-lg text-muted-foreground leading-relaxed">
            <p className="mb-6 text-xl text-slate-800 font-medium">
              We don't just teach you how to write code or query databases. We prepare you to land the job, succeed in the interview, and thrive in your new role.
            </p>
            <p className="mb-6">
              Transitioning into the data industry—or moving up within it—requires more than just technical proficiency. It demands a strategic approach to how you present yourself to employers. Our dedicated career support goes beyond the standard curriculum to ensure you are fully prepared for the competitive job market.
            </p>
            <p className="mb-6">
              From the moment you enroll, we work with you to identify your career goals and map out a tangible path to achieve them. We offer comprehensive resume optimization, helping you translate your past experience into the language that tech recruiters and hiring managers are actively looking for.
            </p>
            <p className="mb-6">
              Our support includes rigorous competency-based interview coaching and technical mock interviews conducted by industry veterans. We ensure that you not only know the answers but can communicate your thought process clearly and confidently under pressure. Furthermore, we assist you in building a compelling GitHub portfolio that showcases real-world, end-to-end data projects rather than just generic tutorials.
            </p>
          </div>
          
          <div className="mt-12 bg-primary/5 border border-primary/10 p-6 rounded-2xl flex items-start gap-4 max-w-2xl">
            <span className="text-2xl" role="img" aria-label="Briefcase">💼</span>
            <div className="flex flex-col">
              <h3 className="text-slate-900 font-bold text-[16px] mb-1">Our Commitment</h3>
              <p className="text-slate-600 font-medium text-[15px] leading-relaxed m-0">
                We measure our success by your success. We are committed to supporting you until you secure your desired role in the data ecosystem.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer footerData={footerLinksData} />
    </div>
  );
}
