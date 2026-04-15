-- ============================================================
-- RLS ENABLE — uruchom RĘCZNIE w Supabase SQL Editor po
-- zweryfikowaniu że nowa wersja z Auth działa na produkcji.
--
-- UWAGA: po włączeniu RLS, każdy klient bez auth (anon) nie
-- zobaczy żadnych wierszy. Testerzy MUSZĄ się zalogować.
--
-- Plik ma prefix _manual_ żeby GH Actions go pominęło.
-- Żeby uruchomić: skopiuj do Supabase Dashboard → SQL Editor.
-- ============================================================

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

-- RLS na households i household_members
alter table households enable row level security;
drop policy if exists households_member_select on households;
create policy households_member_select on households for select
  using (id in (select household_id from household_members where user_id = auth.uid()));

drop policy if exists households_self_insert on households;
create policy households_self_insert on households for insert
  with check (auth.uid() is not null);

alter table household_members enable row level security;
drop policy if exists household_members_self on household_members;
create policy household_members_self on household_members for select
  using (user_id = auth.uid() or household_id in (select household_id from household_members where user_id = auth.uid()));

drop policy if exists household_members_self_insert on household_members;
create policy household_members_self_insert on household_members for insert
  with check (auth.uid() is not null);

-- RLS na invite_tokens
alter table invite_tokens enable row level security;
drop policy if exists invite_tokens_owner_manage on invite_tokens;
create policy invite_tokens_owner_manage on invite_tokens for all
  using (household_id in (select household_id from household_members where user_id = auth.uid()))
  with check (household_id in (select household_id from household_members where user_id = auth.uid()));

-- RLS na push_subscriptions
alter table push_subscriptions enable row level security;
drop policy if exists push_subs_self on push_subscriptions;
create policy push_subs_self on push_subscriptions for all
  using (user_id = auth.uid() or household_id in (select household_id from household_members where user_id = auth.uid()))
  with check (user_id = auth.uid() or household_id in (select household_id from household_members where user_id = auth.uid()));
