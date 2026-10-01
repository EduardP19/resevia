import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { JsonLd } from '@/components/solutions/SolutionJsonLd';
import { SOLUTIONS } from '@/content/solutions';

const SITE_URL = 'https://resevia.co.uk';

export const metadata: Metadata = {
  title: 'AI Receptionist, WhatsApp Booking & Automation | Resevia',
  description:
    'Everything Resevia automates for salons, clinics and dental practices: AI receptionist, WhatsApp automation and booking, AI phone answering, missed-call text-back and reminders.',
  alternates: { canonical: `${SITE_URL}/solutions` },
};

export default function SolutionsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/solutions#page`,
        url: `${SITE_URL}/solutions`,
        name: 'Resevia solutions',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        hasPart: SOLUTIONS.map((s) => ({
          '@type': 'WebPage',
          name: s.title,
          url: `${SITE_URL}/solutions/${s.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${SITE_URL}/solutions` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <JsonLd data={jsonLd} />
      <Navbar />
      <main className="flex-grow pt-32 pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-6">
              One AI receptionist. Every channel your clients use.
            </h1>
            <p className="text-xl text-brand-gray">
              Resevia answers calls, WhatsApp, SMS and website chat, books appointments into your calendar and keeps clients coming back. Explore what it does for your business.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-24">
            {SOLUTIONS.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="block h-full">
                <Card className="h-full">
                  <h2 className="text-xl font-semibold text-brand-black mb-2">{s.name}</h2>
                  <p className="text-brand-gray mb-4">{s.summary}</p>
                  <span className="text-sm font-medium text-brand-purple">Learn more →</span>
                </Card>
              </Link>
            ))}
          </div>

          <div className="max-w-3xl mb-24">
            <h2 className="text-3xl font-display font-bold text-brand-black mb-4">Built for businesses that run on bookings</h2>
            <p className="text-lg text-brand-gray">
              From beauty salons and aesthetic clinics to dental practices, gyms and vets, Resevia is set up around your services, prices and booking rules. See{' '}
              <Link href="/industries" className="text-brand-purple underline">industries</Link>,{' '}
              <Link href="/how-it-works" className="text-brand-purple underline">how it works</Link> or{' '}
              <Link href="/pricing" className="text-brand-purple underline">pricing</Link>.
            </p>
          </div>
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
