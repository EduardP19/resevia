ALTER TABLE public.logs RENAME COLUMN stampuser TO visitor_id;
ALTER INDEX IF EXISTS public.idx_logs_stampuser RENAME TO idx_logs_visitor_id;
