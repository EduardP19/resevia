import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { CallSimulator } from '@/components/sections/CallSimulator';
import { Features } from '@/components/sections/Features';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  title: 'How it works — Resevia AI Receptionist',
  description: 'From setup to live in under 48 hours. See how Resevia answers calls, replies on SMS and WhatsApp, and books appointments for you.',
  alternates: { canonical: 'https://resevia.co.uk/how-it-works' },
  openGraph: { title: 'How it works — Resevia AI Receptionist', description: 'From setup to live in under 48 hours. See how Resevia answers calls, replies on SMS and WhatsApp, and books appointments for you.', url: 'https://resevia.co.uk/how-it-works', type: 'website' },
};

const FAQS = [
  { q: 'Do I need to be technical?', a: 'Not at all. We handle the setup.' },
  { q: 'What booking systems does Resevia work with?', a: 'Fresha, Timely, Google Calendar and more.' },
  { q: 'Can I customise how my receptionist sounds?', a: 'Yes. We match your brand tone exactly — name, personality and the way it greets clients.' },
  { q: 'What if a client asks something the AI can’t handle?', a: 'Resevia escalates to you via notification, and you can take over the conversation from your inbox.' },
  { q: 'Do you keep improving it after launch?', a: 'Yes. Every month we review performance, update services, and improve responses based on real conversations.' },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <Navbar />
      <main className="flex-grow">
        <PageHero
          eyebrow="How it works"
          title={<>From setup to live <span className="text-gold-shimmer">in under 48 hours.</span></>}
          subtitle="Resevia is designed to get up and running fast — no technical knowledge needed, no long onboarding."
        />
        <HowItWorks />
        <CallSimulator />
        <Features />
        <FAQ items={FAQS} />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
