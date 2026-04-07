import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />
      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-8">Privacy Policy</h1>
        
        <div className="prose prose-brand-purple max-w-none text-brand-gray text-lg space-y-8">
          <section>
            <p>Resevia (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies to provide, protect, and improve our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-black mb-4">What are cookies?</h2>
            <p>Cookies are small text files sent to your browser when you visit a website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-black mb-4">How we use them</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Necessary for the site to function correctly.</li>
              <li><strong>Analytics:</strong> We use Microsoft Clarity to understand how you interact with our site. This helps us improve the user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-black mb-4">Your Choices</h2>
            <p>You can manage or disable cookies in your browser settings, though some features of our site may not function properly without them.</p>
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
