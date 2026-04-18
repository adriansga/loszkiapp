-- ============================================================
-- FIX: Izolacja danych między households
-- Data: 2026-04-18
-- Problem: RLS wyłączony na wszystkich tabelach,
--          wish_list i agent_chat bez household_id
-- ============================================================

-- 1. DODAJ household_id do wish_list i agent_chat ----------------

alter table wish_list
  add column if not exists household_id uuid references households(id) on delete cascade;

update wish_list
  set household_id = '00000000-0000-0000-0000-000000000001'
  where household_id is null;

alter table agent_chat
  add column if not exists household_id uuid references households(id) on delete cascade;

update agent_chat
  set household_id = '00000000-0000-0000-0000-000000000001'
  where household_id is null;

create index if not exists idx_wish_list_household on wish_list(household_id);
create index if not exists idx_agent_chat_household on agent_chat(household_id);

-- 2. TRIGGER auto-set household_id dla wish_list i agent_chat ----

drop trigger if exists set_household_id_trigger on wish_list;
create trigger set_household_id_trigger
  before insert on wish_list
  for each row execute function public.set_household_id();

drop trigger if exists set_household_id_trigger on agent_chat;
create trigger set_household_id_trigger
  before insert on agent_chat
  for each row execute function public.set_household_id();

-- 3. WŁĄCZ RLS i utwórz policies dla WSZYSTKICH tabel -----------

do $$
declare
  t text;
  tbls text[] := array[
    'pantry', 'weekly_plan', 'expenses', 'bills',
    'shopping_lists', 'shopping_items',
    'calendar_events', 'calendar_reminders',
    'notes', 'contacts', 'messages', 'tasks', 'meals',
    'wish_list', 'agent_chat'
  ];
begin
  foreach t in array tbls loop
    if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = t) then
      execute format('alter table %I enable row level security', t);

      execute format('drop policy if exists %I on %I', t || '_household_select', t);
      execute format('drop policy if exists %I on %I', t || '_household_insert', t);
      execute format('drop policy if exists %I on %I', t || '_household_update', t);
      execute format('drop policy if exists %I on %I', t || '_household_delete', t);

      execute format($f$
        create policy %I on %I for select
        using (household_id in (select household_id from household_members where user_id = auth.uid()))
      $f$, t || '_household_select', t);

      execute format($f$
        create policy %I on %I for insert
        with check (household_id in (select household_id from household_members where user_id = auth.uid()))
      $f$, t || '_household_insert', t);

      execute format($f$
        create policy %I on %I for update
        using (household_id in (select household_id from household_members where user_id = auth.uid()))
        with check (household_id in (select household_id from household_members where user_id = auth.uid()))
      $f$, t || '_household_update', t);

      execute format($f$
        create policy %I on %I for delete
        using (household_id in (select household_id from household_members where user_id = auth.uid()))
      $f$, t || '_household_delete', t);
    end if;
  end loop;
end $$;

-- 4. RLS na households ----------------------------------------

alter table households enable row level security;
drop policy if exists households_member_select on households;
create policy households_member_select on households for select
  using (id in (select household_id from household_members where user_id = auth.uid()));

drop policy if exists households_self_insert on households;
create policy households_self_insert on households for insert
  with check (auth.uid() is not null);

-- Właściciel household może go aktualizować
drop policy if exists households_owner_update on households;
create policy households_owner_update on households for update
  using (id in (select household_id from household_members where user_id = auth.uid() and role = 'owner'));

-- 5. RLS na household_members ---------------------------------

alter table household_members enable row level security;
drop policy if exists household_members_self on household_members;
create policy household_members_self on household_members for select
  using (user_id = auth.uid() or household_id in (select household_id from household_members where user_id = auth.uid()));

drop policy if exists household_members_self_insert on household_members;
create policy household_members_self_insert on household_members for insert
  with check (auth.uid() is not null);

drop policy if exists household_members_self_delete on household_members;
create policy household_members_self_delete on household_members for delete
  using (user_id = auth.uid() or household_id in (select household_id from household_members where user_id = auth.uid() and role = 'owner'));

-- 6. RLS na invite_tokens -------------------------------------

alter table invite_tokens enable row level security;
drop policy if exists invite_tokens_owner_manage on invite_tokens;
create policy invite_tokens_owner_manage on invite_tokens for all
  using (household_id in (select household_id from household_members where user_id = auth.uid()))
  with check (household_id in (select household_id from household_members where user_id = auth.uid()));

-- 7. RLS na push_subscriptions --------------------------------

alter table push_subscriptions enable row level security;
drop policy if exists push_subs_self on push_subscriptions;
create policy push_subs_self on push_subscriptions for all
  using (user_id = auth.uid() or household_id in (select household_id from household_members where user_id = auth.uid()))
  with check (user_id = auth.uid() or household_id in (select household_id from household_members where user_id = auth.uid()));

-- 8. WERYFIKACJA (SELECT z wynikami) --------------------------

select
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename not in ('_migrations')
order by tablename;
-- trigger workflow test Sat Apr 18 21:29:53     2026
