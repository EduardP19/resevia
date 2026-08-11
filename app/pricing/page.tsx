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
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: What&apos;s included in my plan&apos;s allowance?</h4>
              <p className="text-brand-gray">A: Each channel gets its own monthly allowance, and you get both. Essentials includes 400 SMS and 2,000 WhatsApp messages; Growth includes 750 SMS and 4,000 WhatsApp messages plus 500 AI voice minutes; Custom is sized to whatever volume you actually run.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: What counts as a message?</h4>
              <p className="text-brand-gray">A: Every individual SMS or WhatsApp message sent or received on your behalf, including reminders and confirmations. A typical client conversation runs to around 8 messages, so the 2,400 messages on Essentials work out at roughly 300 conversations a month. Your dashboard tracks it live, so you always know where you stand.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: What happens if I go over my allowance?</h4>
              <p className="text-brand-gray">A: Nothing stops working. Extra usage is billed transparently at cost, and we&apos;ll always flag it before you reach a limit — so there are never any surprises. If you&apos;re regularly going over, we&apos;ll suggest moving you up a plan rather than letting you pay overage every month.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Does Essentials include AI voice calls?</h4>
              <p className="text-brand-gray">A: No. Essentials is text only — SMS and WhatsApp. AI voice starts on Growth, which includes 500 voice minutes a month.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: How many WhatsApp templates do I get?</h4>
              <p className="text-brand-gray">A: Essentials includes up to 3 outbound WhatsApp templates — enough for reminders, confirmations and follow-ups. Growth and Custom are unlimited. Templates are the pre-approved messages WhatsApp requires for anything you send first; replies within an open conversation aren&apos;t templated.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: How is Custom priced?</h4>
              <p className="text-brand-gray">A: On your actual volume and the features you need, so there&apos;s no fixed monthly figure to publish. Tell us roughly how many enquiries and calls you handle and how many locations you run, and we&apos;ll come back with a number.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Can I upgrade or downgrade between plans?</h4>
              <p className="text-brand-gray">A: Yes. You can change your plan at any time from your dashboard. Changes take effect on your next billing date.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Is there a setup fee?</h4>
              <p className="text-brand-gray">A: Normally yes (£499). But for our first 50 founding members, we waive it completely.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: Is there a free trial?</h4>
              <p className="text-brand-gray">A: Yes! Founding members get their entire first month free.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-brand-black text-lg mb-2">Q: What does the founding member status mean?</h4>
              <p className="text-brand-gray">A: As one of the first 50 businesses, you receive priority support and early access to all future features.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
