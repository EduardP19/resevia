-- Allow a queued email to override its template's subject line, so
-- one-off/test sends don't require editing the shared template.
alter table public.scheduled_messages
    add column if not exists subject_override text;
