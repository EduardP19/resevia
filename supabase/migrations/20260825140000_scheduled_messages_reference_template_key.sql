-- Reference templates by their human-readable template_key instead of the
-- opaque uuid id, both in message_templates itself and in
-- scheduled_messages. Makes queued rows and API payloads readable without a
-- join, and campaign_name-style entries can be authored by hand.

-- 1. message_templates.template_key must be set and unique per row before
--    anything can reference it. One legacy row ("Waitlist Signup
--    Confirmation") already has a key; the other ("waitlist_signup", a
--    plain-text-only variant with no key) gets a distinct key of its own so
--    the two don't collide.
update public.message_templates
set template_key = 'waitlist_signup_plain'
where template_key is null
  and name = 'waitlist_signup'
  and channel = 'email';

alter table public.message_templates
    alter column template_key set not null;

-- idx_message_templates_template_key_unique already enforces uniqueness on
-- template_key alone; add the composite (template_key, channel) unique
-- constraint the new foreign key needs to target.
alter table public.message_templates
    drop constraint if exists message_templates_key_channel_key;

alter table public.message_templates
    add constraint message_templates_key_channel_key unique (template_key, channel);

-- 2. Add scheduled_messages.template_key, backfill from the existing
--    template_id join, then swap the foreign key over to it.
alter table public.scheduled_messages
    add column if not exists template_key text;

update public.scheduled_messages sm
set template_key = mt.template_key
from public.message_templates mt
where sm.template_id = mt.id
  and sm.template_key is null;

alter table public.scheduled_messages
    alter column template_key set not null;

alter table public.scheduled_messages
    drop constraint if exists scheduled_messages_template_fkey;

alter table public.scheduled_messages
    add constraint scheduled_messages_template_fkey
        foreign key (template_key, channel)
        references public.message_templates(template_key, channel)
        on delete restrict;

drop index if exists idx_scheduled_messages_template_id;

create index if not exists idx_scheduled_messages_template_key
    on public.scheduled_messages(template_key);

-- 3. template_id is now redundant. Drop it once nothing references it.
alter table public.scheduled_messages
    drop column if exists template_id;
