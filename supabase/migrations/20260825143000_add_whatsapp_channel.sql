-- Add 'whatsapp' as a third message channel alongside 'email' and 'sms',
-- sent via Twilio from the same send-scheduled-messages Edge Function.
-- WhatsApp messages are phone-addressed like SMS, so it shares the
-- recipient_phone requirement.

alter table public.message_templates
    drop constraint if exists message_templates_channel_check;

alter table public.message_templates
    add constraint message_templates_channel_check
        check (channel in ('email', 'sms', 'whatsapp'));

alter table public.message_templates
    drop constraint if exists message_templates_subject_check;

alter table public.message_templates
    add constraint message_templates_subject_check check (
        (channel = 'email' and subject is not null and btrim(subject) <> '')
        or (channel in ('sms', 'whatsapp') and subject is null)
    );

alter table public.scheduled_messages
    drop constraint if exists scheduled_messages_channel_check;

alter table public.scheduled_messages
    add constraint scheduled_messages_channel_check
        check (channel in ('email', 'sms', 'whatsapp'));

alter table public.scheduled_messages
    drop constraint if exists scheduled_messages_recipient_check;

alter table public.scheduled_messages
    add constraint scheduled_messages_recipient_check check (
        (channel = 'email' and recipient_email is not null and btrim(recipient_email) <> '')
        or (channel in ('sms', 'whatsapp') and recipient_phone is not null and btrim(recipient_phone) <> '')
    );
