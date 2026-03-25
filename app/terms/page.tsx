import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />
      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-brand-purple max-w-none text-brand-gray text-lg space-y-8">
          <section>
            <p>Welcome to Resevia. By using our website, you agree to these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-black mb-4">Service Status</h2>
            <p>Resevia is currently in its pre-launch phase. These terms are a placeholder and will be fully updated once the service is officially live.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-black mb-4">Usage</h2>
            <p>Our website is currently for informational and waitlist registration purposes only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-black mb-4">Updates</h2>
            <p>We reserve the right to change these terms at any time.</p>
          </section>

          <section className="pt-8 border-t border-brand-purple/10">
            <p>Contact: <a href="mailto:hello@resevia.co.uk" className="text-brand-purple font-semibold hover:underline">hello@resevia.co.uk</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
