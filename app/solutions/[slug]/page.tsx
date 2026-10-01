import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { JsonLd } from '@/components/solutions/SolutionJsonLd';
import { SOLUTIONS, getSolution } from '@/content/solutions';

const SITE_URL = 'https://resevia.co.uk';

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSolution(params.slug);
  if (!s) return {};
  const url = `${SITE_URL}/solutions/${s.slug}`;
  return {
    title: `${s.title} | Resevia`,
    description: s.description,
    alternates: { canonical: url },
    openGraph: { title: s.title, description: s.description, url, type: 'website' },
  };
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const s = getSolution(params.slug);
  if (!s) notFound();

  const url = `${SITE_URL}/solutions/${s.slug}`;
  const related = s.related.map((slug) => getSolution(slug)).filter((r): r is NonNullable<typeof r> => !!r);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: s.title,
        description: s.description,
        url,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Country', name: 'United Kingdom' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: s.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${SITE_URL}/solutions` },
          { '@type': 'ListItem', position: 3, name: s.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <JsonLd data={jsonLd} />
      <Navbar />
      <main className="flex-grow pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-brand-gray mb-6">
            <Link href="/" className="hover:text-brand-purple">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/solutions" className="hover:text-brand-purple">Solutions</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-black">{s.name}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-6">{s.h1}</h1>
          <p className="text-xl text-brand-gray mb-8">{s.intro}</p>
          <Link
            href="/waitlist"
            className="inline-flex items-center justify-center font-medium rounded-lg px-8 py-4 text-lg bg-brand-purple text-white hover:bg-brand-purple/90 transition-colors"
          >
            Join the waitlist
          </Link>

          <section className="mt-20">
            <h2 className="text-3xl font-display font-bold text-brand-black mb-4">{s.problem.heading}</h2>
            <p className="text-lg text-brand-gray">{s.problem.body}</p>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-display font-bold text-brand-black mb-8">What you get</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {s.benefits.map((b) => (
                <Card key={b.title}>
                  <h3 className="text-lg font-semibold text-brand-black mb-2">{b.title}</h3>
                  <p className="text-brand-gray">{b.body}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-display font-bold text-brand-black mb-8">How it works</h2>
            <ol className="space-y-8">
              {s.steps.map((step, i) => (
                <li key={step.title} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl">{i + 1}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-black mb-1">{step.title}</h3>
                    <p className="text-brand-gray text-lg">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-display font-bold text-brand-black mb-6">Great for</h2>
            <ul className="flex flex-wrap gap-3">
              {s.useCases.map((u) => (
                <li key={u} className="rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-medium text-brand-purple">{u}</li>
              ))}
            </ul>
            <p className="mt-6 text-brand-gray">
              See all <Link href="/industries" className="text-brand-purple underline">industries we serve</Link> or{' '}
              <Link href="/pricing" className="text-brand-purple underline">view pricing</Link>.
            </p>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-display font-bold text-brand-black mb-8">Frequently asked questions</h2>
            <div className="space-y-4">
              {s.faqs.map((f) => (
                <div key={f.q} className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-brand-black text-lg mb-2">{f.q}</h3>
                  <p className="text-brand-gray">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20 mb-8">
            <h2 className="text-2xl font-display font-bold text-brand-black mb-6">Related solutions</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/solutions/${r.slug}`} className="block h-full">
                  <Card className="h-full">
                    <h3 className="font-semibold text-brand-black mb-2">{r.name}</h3>
                    <p className="text-sm text-brand-gray">{r.summary}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
