ALTER TABLE public.logs ADD COLUMN IF NOT EXISTS session_id TEXT;
CREATE INDEX IF NOT EXISTS idx_logs_session_id ON public.logs(session_id);
