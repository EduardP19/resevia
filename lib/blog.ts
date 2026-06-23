import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  cover_image: string | null;
  keywords: string[] | null;
  author: string | null;
  published_at: string;
}

export type BlogPostSummary = Omit<BlogPost, 'body'>;

const SUMMARY_COLUMNS =
  'id, slug, title, description, cover_image, keywords, author, published_at';

// Cover image convention: a local PNG in /public/blog named after the slug.
// Falls back to a branded placeholder rendered by the page when the file is absent.
export function coverImageFor(post: { slug: string; cover_image?: string | null }): string {
  return post.cover_image && post.cover_image.trim().length > 0
    ? post.cover_image
    : `/blog/${post.slug}.png`;
}

// All queries are defensive: if Supabase env/table is missing they return empty
// results instead of throwing, so the site still builds and renders.
export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(SUMMARY_COLUMNS)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('getPublishedPosts error:', error.message);
      return [];
    }
    return (data as BlogPostSummary[]) ?? [];
  } catch (err) {
    console.error('getPublishedPosts threw:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error('getPostBySlug error:', error.message);
      return null;
    }
    return (data as BlogPost) ?? null;
  } catch (err) {
    console.error('getPostBySlug threw:', err);
    return null;
  }
}
