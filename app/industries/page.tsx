import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { DemoSection } from '@/components/sections/DemoSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Icon } from '@/components/ui/Icons';
import { INDUSTRIES } from '@/lib/industries';

export const metadata: Metadata = {
  title: 'Industries — Resevia AI Receptionist',
  description: 'An AI receptionist for hair and beauty salons, aesthetic and private clinics, dental practices, physio, vets, gyms and every business that runs on bookings.',
  alternates: { canonical: 'https://resevia.co.uk/industries' },
  openGraph: { title: 'Industries — Resevia AI Receptionist', description: 'An AI receptionist for hair and beauty salons, aesthetic and private clinics, dental practices, physio, vets, gyms and every business that runs on bookings.', url: 'https://resevia.co.uk/industries', type: 'website' },
};

export default function IndustriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <PageHero
          eyebrow="Industries"
          title={<>Built for any business <span className="text-gold-shimmer">that runs on bookings.</span></>}
          subtitle="Beauty, clinics and far beyond. Each receptionist is trained on the language, services and safety rules of its industry."
        >
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {INDUSTRIES.map((i) => (
              <a key={i.id} href={`#${i.id}`} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 transition-colors hover:border-brand-gold/50 hover:text-white">
                <Icon name={i.icon} className="h-4 w-4 text-brand-gold" /> {i.name}
              </a>
            ))}
          </div>
        </PageHero>

        <section className="bg-brand-light py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            {INDUSTRIES.map((ind) => (
              <article id={ind.id} key={ind.id} className="group scroll-mt-28 rounded-[1.75rem] border border-brand-purple/10 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(109,40,217,0.35)] sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple-light to-brand-purple text-white transition-transform group-hover:scale-110">
                    <Icon name={ind.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-brand-black">{ind.name}</h2>
                    <p className="text-sm text-brand-gray">{ind.tagline}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <ul className="space-y-2">
                    {ind.pains.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-brand-gray"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />{p}</li>
                    ))}
                  </ul>
                  <ul className="space-y-2">
                    {ind.wins.map((w) => (
                      <li key={w} className="flex gap-2 text-sm text-brand-black"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {ind.demo.services.map((s) => (
                    <span key={s.name} className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-purple">{s.name}</span>
                  ))}
                </div>
              </article>
            ))}
            <div className="flex flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-brand-gold/50 bg-brand-cream/50 p-8 text-center md:col-span-2">
              <Icon name="grid" className="h-8 w-8 text-brand-gold" />
              <h2 className="mt-4 text-2xl font-bold text-brand-black">Don’t see your industry?</h2>
              <p className="mt-2 max-w-lg text-brand-gray">Tattoo studios, driving instructors, tutors, photographers, cleaners — if clients book time with you, Resevia can answer for you.</p>
              <Link href="/waitlist" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-purple px-6 py-3.5 font-semibold text-white">
                Tell us what you need <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <DemoSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
