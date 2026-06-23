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

-- 4. Message Templates Table
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    subject TEXT,
    body_text TEXT NOT NULL,
    body_html TEXT,
    parameter_keys TEXT[] DEFAULT '{}'::text[],
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    UNIQUE (name, channel),
    UNIQUE (id, channel),
    CONSTRAINT message_templates_subject_check CHECK (
        (channel = 'email' AND subject IS NOT NULL AND btrim(subject) <> '')
        OR (channel = 'sms' AND subject IS NULL)
    )
);

-- 5. Scheduled Messages Queue
CREATE TABLE IF NOT EXISTS public.scheduled_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    send_after TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    template_id UUID NOT NULL,
    campaign_name TEXT,
    recipient_name TEXT,
    recipient_email TEXT,
    recipient_phone TEXT,
    param1 TEXT,
    param2 TEXT,
    param3 TEXT,
    param4 TEXT,
    param5 TEXT,
    param6 TEXT,
    template_params JSONB DEFAULT '{}'::jsonb NOT NULL,
    attempt_count INTEGER DEFAULT 0 NOT NULL CHECK (attempt_count >= 0),
    claimed_by TEXT,
    provider_message_id TEXT,
    last_error TEXT,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT scheduled_messages_template_fkey
        FOREIGN KEY (template_id, channel)
        REFERENCES public.message_templates(id, channel)
        ON DELETE RESTRICT,
    CONSTRAINT scheduled_messages_recipient_check CHECK (
        (channel = 'email' AND recipient_email IS NOT NULL AND btrim(recipient_email) <> '')
        OR (channel = 'sms' AND recipient_phone IS NOT NULL AND btrim(recipient_phone) <> '')
    )
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_message_templates_updated_at ON public.message_templates;
CREATE TRIGGER set_message_templates_updated_at
    BEFORE UPDATE ON public.message_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_scheduled_messages_updated_at ON public.scheduled_messages;
CREATE TRIGGER set_scheduled_messages_updated_at
    BEFORE UPDATE ON public.scheduled_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.claim_due_scheduled_messages(
    p_batch_size INTEGER DEFAULT 50,
    p_worker TEXT DEFAULT NULL
)
RETURNS SETOF public.scheduled_messages
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH due AS (
        SELECT sm.id
        FROM public.scheduled_messages sm
        WHERE sm.status = 'pending'
          AND sm.send_after <= now()
        ORDER BY sm.send_after, sm.id
        LIMIT GREATEST(COALESCE(p_batch_size, 50), 1)
        FOR UPDATE SKIP LOCKED
    )
    UPDATE public.scheduled_messages sm
    SET status = 'processing',
        claimed_at = now(),
        claimed_by = COALESCE(p_worker, sm.claimed_by),
        attempt_count = sm.attempt_count + 1,
        updated_at = now()
    FROM due
    WHERE sm.id = due.id
    RETURNING sm.*;
END;
$$;

-- Enable RLS for private messaging tables. Service role bypasses RLS; add
-- explicit policies later if these need to be managed from a client session.
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_event_type ON public.logs(event_type);
CREATE INDEX IF NOT EXISTS idx_logs_stampuser ON public.logs(stampuser);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_message_templates_channel_active ON public.message_templates(channel, is_active);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_due_pending
    ON public.scheduled_messages(send_after, id)
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_template_id ON public.scheduled_messages(template_id);
