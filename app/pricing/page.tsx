import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { RevenueCalculator } from '@/components/sections/RevenueCalculator';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  title: 'Pricing — Resevia AI Receptionist',
  description: 'Simple, transparent pricing for your AI receptionist. Essentials from £69/month, Growth with AI voice from £179/month. Founding offer: free setup + first month free.',
};

const FAQS = [
  { q: "What\u2019s included in my plan\u2019s allowance?", a: "Each channel gets its own monthly allowance, and you get both. Essentials includes 400 SMS and 2,000 WhatsApp messages; Growth includes 750 SMS and 4,000 WhatsApp messages plus 500 AI voice minutes; Custom is sized to whatever volume you actually run." },
  { q: "What counts as a message?", a: "Every individual SMS or WhatsApp message sent or received on your behalf, including reminders and confirmations. A typical client conversation runs to around 8 messages, so the 2,400 messages on Essentials work out at roughly 300 conversations a month. Your dashboard tracks it live, so you always know where you stand." },
  { q: "What happens if I go over my allowance?", a: "Nothing stops working. Extra usage is billed transparently at cost, and we\u2019ll always flag it before you reach a limit \u2014 so there are never any surprises. If you\u2019re regularly going over, we\u2019ll suggest moving you up a plan rather than letting you pay overage every month." },
  { q: "Does Essentials include AI voice calls?", a: "No. Essentials is text only \u2014 SMS and WhatsApp. AI voice starts on Growth, which includes 500 voice minutes a month." },
  { q: "How many WhatsApp templates do I get?", a: "Essentials includes up to 3 outbound WhatsApp templates \u2014 enough for reminders, confirmations and follow-ups. Growth and Custom are unlimited. Templates are the pre-approved messages WhatsApp requires for anything you send first; replies within an open conversation aren\u2019t templated." },
  { q: "How is Custom priced?", a: "On your actual volume and the features you need, so there\u2019s no fixed monthly figure to publish. Tell us roughly how many enquiries and calls you handle and how many locations you run, and we\u2019ll come back with a number." },
  { q: "Can I upgrade or downgrade between plans?", a: "Yes. You can change your plan at any time from your dashboard. Changes take effect on your next billing date." },
  { q: "Is there a setup fee?", a: "Normally yes (\u00a3499). But for our first 50 founding members, we waive it completely." },
  { q: "Is there a free trial?", a: "Yes! Founding members get their entire first month free." },
  { q: "What does the founding member status mean?", a: "As one of the first 50 businesses, you receive priority support and early access to all future features." },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-light">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-brand-light pt-16" />
        <PricingTeaser />
        <p className="bg-brand-light pb-16 text-center text-lg text-brand-gray">All plans include setup, training and ongoing support.</p>
        <RevenueCalculator />
        <FAQ items={FAQS} title={<>Pricing <span className="text-purple-gold">FAQs.</span></>} />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
