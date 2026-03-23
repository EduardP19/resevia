import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function IndustriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-16 text-center">Built for any business that runs on bookings.</h1>
        
        <div className="space-y-12">
          <div className="p-8 border border-gray-100 rounded-2xl bg-brand-light">
            <h3 className="text-2xl font-semibold text-brand-black mb-3">Beauty & Hair Salons</h3>
            <p className="text-brand-gray text-lg">Your clients book between treatments, after hours, on weekends. Resevia answers every message instantly and cuts no-shows by 40%.</p>
          </div>
          
          <div className="p-8 border border-gray-100 rounded-2xl bg-brand-light">
            <h3 className="text-2xl font-semibold text-brand-black mb-3">Dental Clinics</h3>
            <p className="text-brand-gray text-lg">New patient enquiries, appointment requests, NHS vs private questions — handled automatically.</p>
          </div>
          
          <div className="p-8 border border-gray-100 rounded-2xl bg-brand-light">
            <h3 className="text-2xl font-semibold text-brand-black mb-3">Private Clinics & Medspas</h3>
            <p className="text-brand-gray text-lg">High-value clients expect fast, professional responses. Resevia delivers 24/7 in your brand voice.</p>
          </div>
          
          <div className="p-8 border border-gray-100 rounded-2xl bg-brand-light">
            <h3 className="text-2xl font-semibold text-brand-black mb-3">Gyms & Personal Trainers</h3>
            <p className="text-brand-gray text-lg">Class bookings, PT sessions, membership enquiries — all handled without picking up the phone.</p>
          </div>
          
          <div className="p-8 border border-gray-100 rounded-2xl bg-brand-light">
            <h3 className="text-2xl font-semibold text-brand-black mb-3">Veterinary Practices</h3>
            <p className="text-brand-gray text-lg">Routine booking and FAQ enquiries handled so your clinical team isn't fielding calls all day.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
