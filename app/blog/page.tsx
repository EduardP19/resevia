import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CoverImage } from '@/components/ui/CoverImage';
import { getPublishedPosts, coverImageFor } from '@/lib/blog';

export const revalidate = 3600; // ISR — refresh hourly

const SITE_URL = 'https://resevia.co.uk';

export const metadata: Metadata = {
  title: 'Resevia Blog — AI Reception for Salons & Clinics',
  description:
    'Practical guides for salon and clinic owners: how to stop missing bookings, recover missed calls, reduce no-shows and let an AI receptionist handle the front desk 24/7.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Resevia Blog — AI Reception for Salons & Clinics',
    description:
      'Practical guides for salon and clinic owners on never missing a booking again.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    name: 'Resevia Blog',
    url: `${SITE_URL}/blog`,
    publisher: { '@id': `${SITE_URL}/#organization` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.published_at,
      image: `${SITE_URL}${coverImageFor(p)}`,
      author: { '@id': `${SITE_URL}/#organization` },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <main className="flex-grow pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brand-purple font-semibold tracking-wide uppercase text-sm mb-3 block">
              Resevia Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black mb-4">
              Never miss a booking again.
            </h1>
            <p className="text-lg text-brand-gray">
              Practical, no-fluff guides for salon and clinic owners — on missed calls,
              no-shows, after-hours bookings and putting your front desk on autopilot.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="text-center text-brand-gray">
              New articles are on the way. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <CoverImage
                    src={coverImageFor(post)}
                    alt={post.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <p className="text-xs text-brand-gray mb-2">{formatDate(post.published_at)}</p>
                    <h2 className="font-display font-bold text-lg text-brand-black mb-2 group-hover:text-brand-purple transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-brand-gray line-clamp-3">{post.description}</p>
                    <span className="inline-block mt-4 text-sm font-semibold text-brand-purple">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
