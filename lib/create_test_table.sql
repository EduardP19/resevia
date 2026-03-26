-- SQL to create the test table in Supabase

CREATE TABLE IF NOT EXISTS public.test (
    test_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_timestamp TIMESTAMPTZ DEFAULT now() NOT NULL,
    test_name TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.test ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for testing)
CREATE POLICY "Allow anonymous inserts" ON public.test
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to select
CREATE POLICY "Allow authenticated select" ON public.test
    FOR SELECT USING (auth.role() = 'authenticated');
