-- The Edge Function gateway rejects requests with no Authorization header
-- (401 UNAUTHORIZED_NO_AUTH_HEADER) before the function's own x-cron-secret
-- check ever runs. Reschedule the job to include a Bearer service-role
-- token, read from Vault at call time like the other secrets.
--
-- Assumes 'send_scheduled_messages_service_role_key' already exists in
-- vault.secrets (seeded separately, same reasoning as project_url and
-- send_scheduled_messages_cron_secret in the previous migration).

do $$
begin
    if exists (select 1 from cron.job where jobname = 'send-scheduled-messages-every-5-minutes') then
        perform cron.unschedule('send-scheduled-messages-every-5-minutes');
    end if;

    perform cron.schedule(
        'send-scheduled-messages-every-5-minutes',
        '*/5 * * * *',
        $cron$
        select
            net.http_post(
                url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-scheduled-messages',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'send_scheduled_messages_service_role_key'),
                    'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_scheduled_messages_cron_secret')
                ),
                body := '{}'::jsonb
            ) as request_id;
        $cron$
    );
end;
$$;
