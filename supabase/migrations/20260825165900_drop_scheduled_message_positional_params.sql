-- template_params (jsonb) already covers everything param1..6 did, with
-- named keys instead of positional slots and no fixed limit on count.
-- Nothing in production relies on the positional columns (checked: only one
-- row had a value, a leftover test value not used by any template).
alter table public.scheduled_messages
    drop column if exists param1,
    drop column if exists param2,
    drop column if exists param3,
    drop column if exists param4,
    drop column if exists param5,
    drop column if exists param6;
