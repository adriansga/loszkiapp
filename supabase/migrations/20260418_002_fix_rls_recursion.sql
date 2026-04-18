-- ============================================================
-- FIX: Infinite recursion w RLS policy dla household_members
-- Data: 2026-04-18
-- Problem: policy household_members_self sprawdzala household_members
--          rekurencyjnie przez subquery, co powodowalo blad 42P17.
-- Fix: policy na household_members uzywa tylko user_id = auth.uid()
--      lub funkcji user_households() (security definer, omija RLS).
--
-- JAK URUCHOMIC:
-- 1. Wejdz na https://supabase.com/dashboard
-- 2. Wybierz projekt qlqnrsxpmoeoukfgovmy
-- 3. SQL Editor → wklej i uruchom
-- ============================================================

-- KROK 1: Wyłącz RLS tymczasowo żeby móc edytować policies
alter table household_members disable row level security;

-- KROK 2: Usuń wszystkie stare policies
drop policy if exists household_members_self on household_members;
drop policy if exists household_members_self_insert on household_members;
drop policy if exists household_members_self_delete on household_members;
drop policy if exists household_members_select on household_members;
drop policy if exists household_members_insert on household_members;
drop policy if exists household_members_delete on household_members;

-- KROK 3: Upewnij się że user_households() istnieje (security definer)
-- Ta funkcja omija RLS i nie powoduje rekursji
create or replace function public.user_households()
returns setof uuid
language sql
stable
security definer
as $$
  select household_id from household_members where user_id = auth.uid();
$$;

-- KROK 4: Włącz RLS z poprawnymi policies (BEZ rekursji)
alter table household_members enable row level security;

-- SELECT: user widzi swoje wiersze + wiersze innych w tym samym household
-- Używamy user_households() zamiast subquery na household_members (unika rekursji!)
create policy household_members_select on household_members for select
  using (
    user_id = auth.uid()
    or household_id = any(select * from public.user_households())
  );

-- INSERT: każdy zalogowany user może dołączyć do household
create policy household_members_insert on household_members for insert
  with check (auth.uid() is not null);

-- DELETE: user usuwa siebie lub owner usuwa innych z swojego household
create policy household_members_delete on household_members for delete
  using (
    user_id = auth.uid()
    or household_id = any(select * from public.user_households())
  );

-- KROK 5: Weryfikacja — powinno zwrócić wyniki bez błędu
select
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'household_members'
order by policyname;

-- DODATKOWA WERYFIKACJA: sprawdź policies na innych tabelach (powinny używać user_households())
-- Jeśli policies na pantry/expenses/etc używają subquery na household_members zamiast user_households(),
-- mogą też mieć problem. Sprawdź i ewentualnie przebuduj przez 20260418_001_fix_rls_isolation.sql
