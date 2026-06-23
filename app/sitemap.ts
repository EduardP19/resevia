import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog';

const SITE_URL = 'https://resevia.co.uk';

export const revalidate = 3600; // refresh sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/how-it-works',
    '/industries',
    '/pricing',
    '/blog',
    '/waitlist',
    '/privacy-policy',
    '/terms',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/pricing' || path === '/blog' ? 0.8 : 0.6,
  }));

  const posts = await getPublishedPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
