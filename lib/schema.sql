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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_logs_event_type ON public.logs(event_type);
CREATE INDEX IF NOT EXISTS idx_logs_stampuser ON public.logs(stampuser);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
