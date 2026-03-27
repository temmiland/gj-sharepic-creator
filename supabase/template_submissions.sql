-- Table for community template submissions
--
-- Setup nach dem Ausführen dieser Migration:
--   1. Supabase Dashboard → Database → Extensions → pg_net aktivieren (falls nicht schon aktiv)
--   2. Telegram Bot erstellen:
--        - @BotFather schreiben → /newbot → Token kopieren
--        - Bot einmal anschreiben, dann aufrufen:
--          https://api.telegram.org/bot<TOKEN>/getUpdates
--          → "id" aus dem "chat"-Objekt ist deine Chat-ID
--   3. Im SQL Editor ausführen (mit echten Werten):
--        select vault.create_secret('DEIN_TOKEN', 'telegram_bot_token');
--        select vault.create_secret('DEINE_CHAT_ID', 'telegram_chat_id');
--
create table if not exists template_submissions (
  id uuid primary key default gen_random_uuid(),
  template jsonb not null,
  message text,
  submitted_at timestamptz not null default now()
);

-- Anyone can submit, nobody can read/modify via anon key
alter table template_submissions enable row level security;

create policy "Allow anonymous inserts"
  on template_submissions
  for insert
  to anon
  with check (true);

-- Telegram notification via pg_net on every new submission
create or replace function notify_template_submission()
returns trigger
language plpgsql
security definer
as $$
declare
  template_name text := NEW.template->>'name';
  template_type text := case when NEW.template->>'templateType' = 'overlay' then 'Story-Overlay' else 'SharePic' end;
  submitted_at  text := to_char(NEW.submitted_at at time zone 'Europe/Berlin', 'DD.MM.YYYY HH24:MI');
  bot_token     text;
  chat_id       text;
  msg           text;
begin
  select decrypted_secret into bot_token from vault.decrypted_secrets where name = 'telegram_bot_token' limit 1;
  select decrypted_secret into chat_id   from vault.decrypted_secrets where name = 'telegram_chat_id'   limit 1;

  msg := '📬 <b>Neue Template-Einreichung</b>' || chr(10)
      || chr(10)
      || '<b>Name:</b> ' || template_name || chr(10)
      || '<b>Typ:</b> ' || template_type || chr(10)
      || '<b>Eingereicht:</b> ' || submitted_at || chr(10)
      || '<b>ID:</b> <code>' || NEW.id || '</code>';

  if NEW.message is not null then
    msg := msg || chr(10) || '<b>Notiz:</b> ' || NEW.message;
  end if;

  begin
    perform net.http_post(
      'https://api.telegram.org/bot' || bot_token || '/sendMessage',
      jsonb_build_object(
        'chat_id',    chat_id,
        'text',       msg,
        'parse_mode', 'HTML'
      )
    );
  exception when others then
    raise warning 'Failed to send Telegram notification: %', sqlerrm;
  end;
  return NEW;
end;
$$;

create trigger on_template_submission_notify
  after insert on template_submissions
  for each row execute function notify_template_submission();
