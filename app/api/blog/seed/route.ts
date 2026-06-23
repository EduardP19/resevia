import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { seedPosts } from '@/content/blogPosts';

// One-off seeding endpoint for the Supabase-backed blog.
// Usage (with the dev or prod server running):
//   curl -X POST "https://your-site/api/blog/seed?secret=YOUR_BLOG_SEED_SECRET"
//
// Requires env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BLOG_SEED_SECRET.
// The service-role key bypasses RLS so drafts/inserts are allowed; the secret
// guards the endpoint from public abuse.
export async function POST(request: Request) {
  const secret = process.env.BLOG_SEED_SECRET;
  const provided = new URL(request.url).searchParams.get('secret');

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const rows = seedPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    body: p.body,
    keywords: p.keywords,
    author: p.author,
    cover_image: null,
    status: 'published' as const,
    published_at: p.publishedAt,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await admin
    .from('blog_posts')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug');

  if (error) {
    console.error('Blog seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ seeded: data?.length ?? 0, slugs: data?.map((d) => d.slug) });
}
