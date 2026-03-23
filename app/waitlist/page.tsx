import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WaitlistForm } from '@/components/ui/WaitlistForm';

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-6">Get early access to Resevia.</h1>
            <p className="text-xl text-brand-gray mb-8">
              We're launching soon. Join the waitlist to:
            </p>
            <ul className="space-y-4 mb-8 text-lg text-brand-black font-medium">
              <li className="flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 shrink-0">✓</span>
                Get 30% off your first 3 months
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 shrink-0">✓</span>
                Be first before competitors in your area
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 shrink-0">✓</span>
                Shape the product — we build for early members first
              </li>
            </ul>
          </div>
          
          <div className="flex-1 w-full bg-brand-light p-8 rounded-2xl border border-gray-100 shadow-sm">
            <WaitlistForm />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
