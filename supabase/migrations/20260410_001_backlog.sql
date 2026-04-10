-- Spiżarnia: archiwizacja zamiast usuwania
alter table pantry add column if not exists is_consumed boolean default false;
alter table pantry add column if not exists consumed_at timestamptz default null;

-- Lista zakupów: rozróżnienie ręczne vs generowane
alter table shopping_items add column if not exists source text default 'generated';

-- Tablice zadań Kasia/Adrian
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  assigned_to text not null check (assigned_to in ('adrian', 'kasia', 'oboje')),
  due_date date default null,
  status text not null default 'todo' check (status in ('todo', 'done')),
  notes text default null,
  created_at timestamptz default now(),
  done_at timestamptz default null
);
