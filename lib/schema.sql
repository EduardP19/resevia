-- Supabase SQL Schema for Resevia

-- 1. Logs Table (Analytics)
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    event_type TEXT NOT NULL,
    url TEXT,
    stampuser TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS for logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for logs
CREATE POLICY "Allow anonymous inserts" ON public.logs
    FOR INSERT WITH CHECK (true);

-- 2. Waitlist Table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    industry TEXT NOT NULL,
    appointments_per_week TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS for waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for waitlist
CREATE POLICY "Allow anonymous signups" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- 3. Blog Posts Table (Supabase-backed CMS)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    body TEXT NOT NULL,                       -- markdown
    cover_image TEXT,                         -- optional override; defaults to /blog/<slug>.png
    keywords TEXT[] DEFAULT '{}'::text[],
    author TEXT DEFAULT 'The Resevia Team',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ
);

-- Enable RLS for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts only. Drafts and writes are restricted to the
-- service role (used by the seed script), which bypasses RLS.
CREATE POLICY "Public can read published posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_event_type ON public.logs(event_type);
CREATE INDEX IF NOT EXISTS idx_logs_stampuser ON public.logs(stampuser);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
