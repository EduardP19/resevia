alter table public.scheduled_messages
    add column if not exists sending_source text;
