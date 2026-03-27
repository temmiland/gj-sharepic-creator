create table if not exists shared_templates (
  id uuid primary key default gen_random_uuid(),
  template jsonb not null check (pg_column_size(template) < 524288),
  created_at timestamptz default now()
);

alter table shared_templates enable row level security;

create policy "anon insert" on shared_templates
  for insert to anon with check (true);

create policy "anon select" on shared_templates
  for select to anon using (true);
