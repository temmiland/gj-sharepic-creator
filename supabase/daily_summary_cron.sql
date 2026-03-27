-- Daily Telegram summary: shared templates + storage uploads
--
-- Setup:
--   1. Supabase Dashboard → Database → Extensions → pg_cron aktivieren
--   2. Diese Datei im SQL Editor ausführen
--   Uhrzeit anpassen: aktuell 8:00 Uhr UTC (= 9:00 Uhr MEZ / 10:00 Uhr MESZ)

create or replace function send_daily_summary()
returns void
language plpgsql
security definer
as $$
declare
  bot_token       text;
  chat_id         text;
  shared_count    int;
  upload_count    int;
  submission_count int;
  msg             text;
begin
  select decrypted_secret into bot_token from vault.decrypted_secrets where name = 'telegram_bot_token' limit 1;
  select decrypted_secret into chat_id   from vault.decrypted_secrets where name = 'telegram_chat_id'   limit 1;

  select count(*) into shared_count
    from shared_templates
    where created_at >= now() - interval '24 hours';

  select count(*) into upload_count
    from storage.objects
    where bucket_id = 'images'
      and created_at >= now() - interval '24 hours';

  select count(*) into submission_count
    from template_submissions
    where submitted_at >= now() - interval '24 hours';

  -- Keine Nachricht wenn nichts passiert ist
  if shared_count = 0 and upload_count = 0 and submission_count = 0 then
    return;
  end if;

  msg := '📊 <b>Tagesübersicht</b>' || chr(10)
      || to_char(now() at time zone 'Europe/Berlin', 'DD.MM.YYYY') || chr(10)
      || chr(10)
      || '🔗 Geteilte Templates: <b>' || shared_count || '</b>' || chr(10)
      || '🖼️ Bild-Uploads: <b>' || upload_count || '</b>' || chr(10)
      || '📬 Einreichungen: <b>' || submission_count || '</b>';

  perform net.http_post(
    'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    jsonb_build_object(
      'chat_id',    chat_id,
      'text',       msg,
      'parse_mode', 'HTML'
    )
  );
end;
$$;

-- Täglich um 8:00 UTC (cron läuft immer in UTC)
select cron.schedule(
  'daily-summary',
  '0 8 * * *',
  $$select send_daily_summary()$$
);
