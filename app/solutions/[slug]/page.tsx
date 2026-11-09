import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { LeadMagnetForm } from '@/components/ui/LeadMagnetForm';
import { Icon } from '@/components/ui/Icons';
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
    <div className="flex min-h-screen flex-col bg-brand-light">
      <JsonLd data={jsonLd} />
      <Navbar />
      <main className="flex-grow">
        <PageHero eyebrow={s.name} title={s.h1} subtitle={s.intro}>
          <div className="mt-10 flex justify-center">
            <Link
              href={s.leadMagnet ? '#get-audit' : '/waitlist'}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-purple px-7 py-4 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(109,40,217,0.7)] transition-colors hover:bg-brand-purple-mid"
            >
              {s.leadMagnet ? s.leadMagnet.cta : 'Join the waitlist'} <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </PageHero>

        <div className="mx-auto max-w-4xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-brand-gray">
            <Link href="/" className="hover:text-brand-purple">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/solutions" className="hover:text-brand-purple">Solutions</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-black">{s.name}</span>
          </nav>

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
        {s.leadMagnet ? (
          <section id="get-audit" className="scroll-mt-24 bg-white py-20 sm:py-24">
            <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
              <div>
                <span className="eyebrow-light">{s.leadMagnet.eyebrow}</span>
                <h2 className="mt-4 font-display text-3xl font-bold text-brand-black sm:text-4xl">{s.leadMagnet.heading}</h2>
                <p className="mt-4 text-lg text-brand-gray">{s.leadMagnet.body}</p>
                <ul className="mt-6 space-y-3">
                  {s.leadMagnet.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-brand-black"><Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />{b}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-brand-light p-6 sm:p-8">
                <LeadMagnetForm source={s.leadMagnet.source} submitLabel={s.leadMagnet.cta} />
              </div>
            </div>
          </section>
        ) : (
          <FinalCTA />
        )}
      </main>
      <Footer />
    </div>
  );
}
