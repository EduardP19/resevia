import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'How Resevia Works: Live in Under an Hour | Resevia',
  description: 'See how Resevia sets up your AI receptionist in 24–48 hours: onboarding, training, go-live on WhatsApp, SMS, phone and web chat, then monthly optimisation.',
  alternates: { canonical: 'https://resevia.co.uk/how-it-works' },
  openGraph: { title: 'How Resevia Works: Live in Under an Hour | Resevia', description: 'See how Resevia sets up your AI receptionist in 24–48 hours: onboarding, training, go-live on WhatsApp, SMS, phone and web chat, then monthly optimisation.', url: 'https://resevia.co.uk/how-it-works', type: 'website' },
};

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Do I need to be technical?', acceptedAnswer: { '@type': 'Answer', text: 'Not at all. We handle the setup.' } },
    { '@type': 'Question', name: 'What booking systems does Resevia work with?', acceptedAnswer: { '@type': 'Answer', text: 'Fresha, Timely, Google Calendar and more.' } },
    { '@type': 'Question', name: 'Can I customise how my receptionist sounds?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We match your brand tone exactly.' } },
    { '@type': 'Question', name: 'What if a client asks something the AI can\'t handle?', acceptedAnswer: { '@type': 'Answer', text: 'Resevia escalates to you via notification.' } },
  ],
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <Navbar />
      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-6">From setup to live in under an hour.</h1>
        <p className="text-xl text-brand-gray mb-16">Resevia is designed to get up and running fast — no technical knowledge needed, no long onboarding.</p>
        
        <div className="space-y-12">
          <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
            <div>
              <h3 className="text-2xl font-semibold text-brand-black mb-2">Tell us about your business (15 mins)</h3>
              <p className="text-brand-gray text-lg">Fill in a simple onboarding form. Services, pricing, team members, opening hours, booking rules. We handle the rest.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
            <div>
              <h3 className="text-2xl font-semibold text-brand-black mb-2">We build your AI receptionist (24–48 hrs)</h3>
              <p className="text-brand-gray text-lg">We configure and train your AI on your business. You review and approve before anything goes live.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
            <div>
              <h3 className="text-2xl font-semibold text-brand-black mb-2">Go live on your channels</h3>
              <p className="text-brand-gray text-lg">Deploy to website chat, WhatsApp Business, or a dedicated phone number. Starts handling enquiries immediately.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl">4</div>
            <div>
              <h3 className="text-2xl font-semibold text-brand-black mb-2">We monitor and improve</h3>
              <p className="text-brand-gray text-lg">Every month we review performance, update services, and improve responses based on real conversations.</p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-display font-bold text-brand-black mb-8">FAQs</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-brand-black text-lg">Q: Do I need to be technical?</h4>
              <p className="text-brand-gray">A: Not at all. We handle the setup.</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-black text-lg">Q: What booking systems does Resevia work with?</h4>
              <p className="text-brand-gray">A: Fresha, Timely, Google Calendar and more.</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-black text-lg">Q: Can I customise how my receptionist sounds?</h4>
              <p className="text-brand-gray">A: Yes. We match your brand tone exactly.</p>
            </div>
            <div>
              <h4 className="font-semibold text-brand-black text-lg">Q: What if a client asks something the AI can't handle?</h4>
              <p className="text-brand-gray">A: Resevia escalates to you via notification.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
