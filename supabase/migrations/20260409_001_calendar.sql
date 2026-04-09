create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time text,
  owner text not null check (owner in ('adrian', 'kasia', 'oboje')),
  notes text,
  created_at timestamptz default now()
);
