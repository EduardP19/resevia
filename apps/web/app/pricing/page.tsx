import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PricingTeaser } from '@/components/sections/PricingTeaser';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />
      <main className="flex-grow pt-8 pb-24">
        <PricingTeaser />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <p className="text-center text-lg text-brand-gray mb-16">All plans include setup, training and ongoing support.</p>

          <h2 className="text-3xl font-display font-bold text-brand-black mb-8 text-center">FAQs</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Is there a setup fee?</h4>
              <p className="text-brand-gray">A: Normally yes (£499). But for our first 50 founding members, we waive it completely.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Can I change plans?</h4>
              <p className="text-brand-gray">A: Yes, anytime.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: What does the founding member status mean?</h4>
              <p className="text-brand-gray">A: As one of the first 50 businesses, you receive priority support and early access to all future features.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: What counts as a conversation?</h4>
              <p className="text-brand-gray">A: Any interaction with a client — a message thread, a WhatsApp exchange, or a phone call. Multiple messages within a one-hour window count as a single conversation.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Can I upgrade or downgrade between plans?</h4>
              <p className="text-brand-gray">A: Yes. You can change your plan at any time from your dashboard. Changes take effect on your next billing date.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Is there a free trial?</h4>
              <p className="text-brand-gray">A: Yes! Founding members get their entire first month free.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
