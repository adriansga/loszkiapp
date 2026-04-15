-- ============================================================
-- TRIGGERY auto-set household_id (bez RLS — safe to deploy)
-- RLS włączamy osobną migracją 20260415_003_rls_enable.sql
-- po weryfikacji że auth + server actions działają na produkcji.
-- ============================================================

-- 1. FUNKCJA auto-set household_id na INSERT --------------------
create or replace function public.set_household_id()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.household_id is null then
    select household_id into new.household_id
    from household_members
    where user_id = auth.uid()
    limit 1;
  end if;
  return new;
end;
$$;

-- 2. TRIGGERY dla wszystkich tabel ------------------------------
do $$
declare
  t text;
  tbls text[] := array[
    'pantry', 'weekly_plan', 'expenses', 'bills',
    'shopping_lists', 'shopping_items',
    'calendar_events', 'calendar_reminders',
    'notes', 'contacts', 'messages', 'tasks', 'meals'
  ];
begin
  foreach t in array tbls loop
    if exists (select 1 from information_schema.tables where table_name = t) then
      execute format('drop trigger if exists set_household_id_trigger on %I', t);
      execute format($f$
        create trigger set_household_id_trigger
        before insert on %I
        for each row execute function public.set_household_id()
      $f$, t);
    end if;
  end loop;
end $$;
