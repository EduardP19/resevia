import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { RevenueCalculator } from '@/components/sections/RevenueCalculator';
import { DemoSection } from '@/components/sections/DemoSection';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { CallSimulator } from '@/components/sections/CallSimulator';
import { Features } from '@/components/sections/Features';
import { Industries } from '@/components/sections/Industries';
import { DashboardPreview } from '@/components/sections/DashboardPreview';
import { Reviews } from '@/components/sections/Reviews';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  title: 'Resevia: AI Receptionist for Salons & Clinics (WhatsApp, SMS & Voice)',
  description: 'Resevia answers calls, WhatsApp and SMS 24/7, books appointments and sends reminders for UK salons, aesthetic clinics and dental practices.',
  alternates: { canonical: 'https://resevia.co.uk/' },
  openGraph: { title: 'Resevia: AI Receptionist for Salons & Clinics (WhatsApp, SMS & Voice)', description: 'Resevia answers calls, WhatsApp and SMS 24/7, books appointments and sends reminders for UK salons, aesthetic clinics and dental practices.', url: 'https://resevia.co.uk', type: 'website' },
};


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <RevenueCalculator />
        <DemoSection />
        <Features />
        <CallSimulator />
        <HowItWorks />
        <Industries />
        <DashboardPreview />
        <Reviews />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
