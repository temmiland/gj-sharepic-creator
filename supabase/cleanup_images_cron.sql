-- Cron job: cleanup old images via Edge Function
-- Läuft täglich um 3:00 UTC
-- Erfordert: pg_cron + pg_net aktiviert
--
-- Setup:
--   Im SQL Editor ausführen (mit echten Werten):
--     select vault.create_secret('https://<project-ref>.supabase.co', 'supabase_url');
--     select vault.create_secret('<anon-key>', 'supabase_anon_key');

select cron.schedule(
  'cleanup-images',
  '0 3 * * *',
  $$
  select net.http_post(
    url     := (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_url' limit 1)
               || '/functions/v1/cleanup-images',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key' limit 1)
    ),
    body    := '{}'::jsonb
  );
  $$
);
