import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Icon } from '@/components/ui/Icons';
import { JsonLd } from '@/components/solutions/SolutionJsonLd';
import { INDUSTRIES } from '@/lib/industries';
import { INDUSTRY_PAGES, getIndustryPage } from '@/content/industryPages';
import { getSolution } from '@/content/solutions';

const SITE_URL = 'https://resevia.co.uk';

export function generateStaticParams() {
  return INDUSTRY_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getIndustryPage(params.slug);
  if (!page) return {};
  const url = `${SITE_URL}/industries/${page.slug}`;
  return {
    title: `${page.title} | Resevia`,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { title: page.title, description: page.description, url, type: 'website' },
  };
}

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const page = getIndustryPage(params.slug);
  const industry = INDUSTRIES.find((i) => i.id === page?.id);
  if (!page || !industry) notFound();

  const url = `${SITE_URL}/industries/${page.slug}`;
  const related = page.related.map((s) => getSolution(s)).filter((s): s is NonNullable<typeof s> => !!s);
  const otherIndustries = INDUSTRY_PAGES.filter((p) => p.slug !== page.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.title,
        description: page.description,
        url,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Country', name: 'United Kingdom' },
        audience: { '@type': 'BusinessAudience', name: industry.name },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Industries', item: `${SITE_URL}/industries` },
          { '@type': 'ListItem', position: 3, name: industry.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd data={jsonLd} />
      <Navbar />
      <main className="flex-grow">
        <PageHero
          eyebrow={industry.name}
          title={<>{page.h1.lead} <span className="text-gold-shimmer">{page.h1.highlight}</span></>}
          subtitle={page.intro}
        >
          <div className="mt-10 flex justify-center">
            <Link href="/waitlist" className="inline-flex items-center gap-2 rounded-2xl bg-brand-purple px-7 py-4 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(109,40,217,0.7)] transition-colors hover:bg-brand-purple-mid">
              Join the waitlist <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </PageHero>

        <section className="bg-brand-light py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-brand-black sm:text-4xl">{page.problem.heading}</h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-gray">{page.problem.body}</p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-brand-purple/10 bg-white p-7">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-brand-gray">Without Resevia</h3>
                <ul className="mt-4 space-y-3">
                  {industry.pains.map((p) => (
                    <li key={p} className="flex gap-2 text-brand-gray"><Icon name="x" className="mt-1 h-4 w-4 shrink-0 text-rose-400" />{p}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.75rem] border border-brand-gold/40 bg-white p-7">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-brand-purple">With Resevia</h3>
                <ul className="mt-4 space-y-3">
                  {industry.wins.map((w) => (
                    <li key={w} className="flex gap-2 text-brand-black"><Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="mt-16 font-display text-2xl font-bold text-brand-black">Example services it can book</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {industry.demo.services.map((s) => (
                <li key={s.name} className="rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-medium text-brand-purple">{s.name}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-brand-gray">Your own services, prices and booking rules are set up during onboarding.</p>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-brand-black">What Resevia does for you</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/solutions/${r.slug}`} className="group rounded-[1.75rem] border border-brand-purple/10 bg-brand-light p-6 transition-all hover:-translate-y-1 hover:border-brand-gold/60">
                  <h3 className="text-lg font-semibold text-brand-black">{r.name}</h3>
                  <p className="mt-2 text-sm text-brand-gray">{r.summary}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-brand-purple">Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FAQ items={page.faqs} title={<>{industry.name} <span className="text-purple-gold">FAQs.</span></>} />

        <section className="bg-brand-light py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="font-display text-xl font-bold text-brand-black">Resevia for other businesses</h2>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {otherIndustries.map((o) => (
                <li key={o.slug}>
                  <Link href={`/industries/${o.slug}`} className="rounded-full border border-brand-purple/15 bg-white px-4 py-2 text-sm text-brand-purple transition-colors hover:border-brand-gold/60">
                    {INDUSTRIES.find((i) => i.id === o.id)?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
