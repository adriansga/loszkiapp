-- Dodaj pole przypomnienia do wydarzeń
alter table calendar_events add column if not exists reminder_days int default null;

-- Tabela subskrypcji push
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner text not null check (owner in ('adrian', 'kasia')),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);
