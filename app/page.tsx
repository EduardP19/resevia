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
