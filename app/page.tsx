import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ProblemBlock } from '@/components/sections/ProblemBlock';
import { EnchanteeBlock } from '@/components/sections/EnchanteeBlock';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Industries } from '@/components/sections/Industries';
import { SocialProof } from '@/components/sections/SocialProof';
import { Reviews } from '@/components/sections/Reviews';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  title: 'Resevia: AI Receptionist for Salons & Clinics (WhatsApp, SMS & Voice)',
  description: 'Resevia answers calls, WhatsApp and SMS 24/7, books appointments and sends reminders for UK salons, aesthetic clinics and dental practices.',
  alternates: { canonical: 'https://resevia.co.uk/' },
  openGraph: { title: 'Resevia: AI Receptionist for Salons & Clinics (WhatsApp, SMS & Voice)', description: 'Resevia answers calls, WhatsApp and SMS 24/7, books appointments and sends reminders for UK salons, aesthetic clinics and dental practices.', url: 'https://resevia.co.uk', type: 'website' },
};


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProblemBlock />
        <EnchanteeBlock />
        <HowItWorks />
        <Industries />
        <SocialProof />
        <Reviews />
        <PricingTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
