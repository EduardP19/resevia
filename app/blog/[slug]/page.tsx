import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CoverImage } from '@/components/ui/CoverImage';
import { getPostBySlug, getPublishedPosts, coverImageFor } from '@/lib/blog';

export const revalidate = 3600; // ISR — refresh hourly

const SITE_URL = 'https://resevia.co.uk';

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Article not found — Resevia' };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = `${SITE_URL}${coverImageFor(post)}`;

  return {
    title: `${post.title} — Resevia`,
    description: post.description,
    keywords: post.keywords ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.published_at,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

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

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = `${SITE_URL}${coverImageFor(post)}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    image,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    keywords: (post.keywords ?? []).join(', '),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="flex-grow pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-sm font-semibold text-brand-purple hover:underline">
            ← All articles
          </Link>

          <header className="mt-6 mb-8">
            <p className="text-sm text-brand-gray mb-3">{formatDate(post.published_at)}</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-black leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-brand-gray">{post.description}</p>
          </header>

          <CoverImage
            src={coverImageFor(post)}
            alt={post.title}
            className="w-full max-h-[28rem] bg-brand-light object-contain rounded-2xl mb-10"
          />

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-black prose-p:text-brand-gray prose-li:text-brand-gray prose-strong:text-brand-black prose-a:text-brand-purple">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          <div className="mt-14 bg-brand-light border border-brand-gold/30 rounded-2xl p-8 text-center">
            <h2 className="font-display font-bold text-2xl text-brand-black mb-3">
              Stop missing bookings.
            </h2>
            <p className="text-brand-gray mb-6 max-w-xl mx-auto">
              Resevia answers every call and message 24/7 and books clients straight into
              your calendar. Join the founding-salon pilot — free setup + first month free.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center font-medium rounded-lg bg-brand-purple text-white px-8 py-4 text-lg hover:bg-brand-purple/90 transition-colors"
            >
              Secure my spot
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
