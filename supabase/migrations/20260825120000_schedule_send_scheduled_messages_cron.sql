-- Schedule the scheduled_messages sender to run every 5 minutes.
--
-- The actual send logic lives in the send-scheduled-messages Edge Function
-- (supabase/functions/send-scheduled-messages). pg_cron fires on a fixed
-- schedule and uses pg_net to make an async HTTP call into it, authenticated
-- with a shared secret held in Supabase Vault (never stored in migration
-- history). The Edge Function itself claims due rows via
-- claim_due_scheduled_messages() and sends email through Resend.

create extension if not exists pg_net with schema extensions;

-- This migration assumes the 'project_url' and
-- 'send_scheduled_messages_cron_secret' secrets already exist in
-- vault.secrets (seeded separately, since the migration role cannot write
-- to vault.secrets directly — see deployment notes). The job below only
-- references them by name at call time.

do $$
begin
    if not exists (select 1 from cron.job where jobname = 'send-scheduled-messages-every-5-minutes') then
        perform cron.schedule(
            'send-scheduled-messages-every-5-minutes',
            '*/5 * * * *',
            $cron$
            select
                net.http_post(
                    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-scheduled-messages',
                    headers := jsonb_build_object(
                        'Content-Type', 'application/json',
                        'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_scheduled_messages_cron_secret')
                    ),
                    body := '{}'::jsonb
                ) as request_id;
            $cron$
        );
    end if;
end;
$$;
