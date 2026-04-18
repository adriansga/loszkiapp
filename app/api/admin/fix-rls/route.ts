import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';

// Tymczasowy endpoint do naprawy RLS (infinite recursion w household_members)
// Auth: admin login + NOTIFY_TOKEN
// USUŃ po naprawie!

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Wykonuje SQL przez Supabase postgrest - tylko SELECT/INSERT/UPDATE/DELETE
// DDL wymaga pg wire protocol - użyjemy trick przez SECURITY DEFINER function

async function callRpc(fnName: string, params: Record<string, unknown> = {}) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  const data = await resp.json();
  return { status: resp.status, data };
}

async function restQuery(path: string) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    }
  });
  return { status: resp.status, data: await resp.json() };
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const token = req.nextUrl.searchParams.get('token');
  if (token !== process.env.NOTIFY_TOKEN) {
    return NextResponse.json({ error: 'invalid token' }, { status: 403 });
  }

  const hm = await restQuery('/household_members?select=*');
  const pantry = await restQuery('/pantry?select=id,name,household_id&limit=3');

  // Test anon key
  const anonResp = await fetch(`${SUPABASE_URL}/rest/v1/pantry?select=id&limit=1`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  });
  const anonData = await anonResp.json();

  return NextResponse.json({
    household_members: hm.data,
    pantry_sample: pantry.data,
    anon_rls_test: { status: anonResp.status, data: anonData },
    diagnosis: anonResp.status === 500 ? 'RLS infinite recursion aktywna' : 'RLS OK',
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const token = req.nextUrl.searchParams.get('token');
  if (token !== process.env.NOTIFY_TOKEN) {
    return NextResponse.json({ error: 'invalid token' }, { status: 403 });
  }

  const steps: Array<{ step: string; ok: boolean; error?: string; data?: unknown }> = [];

  // STRATEGIA: Supabase JS SDK service role może wykonać DDL przez
  // wbudowany endpoint /rest/v1/rpc/exec_sql (jeśli istnieje)
  // lub przez tworzenie SECURITY DEFINER function przez INSERT (nie da się)

  // Sprawdzamy dostępne metody
  const userHh = await callRpc('user_households');
  steps.push({ step: 'rpc user_households', ok: userHh.status < 300, data: userHh.data });

  // Próba exec_sql
  const execTest = await callRpc('exec_sql', { sql: 'SELECT 1 as test' });
  steps.push({ step: 'rpc exec_sql test', ok: execTest.status < 300, data: execTest.data });

  if (execTest.status < 300) {
    // Mamy exec_sql! Wykonaj fix
    const fixSql = `
      alter table household_members disable row level security;
      drop policy if exists household_members_self on household_members;
      drop policy if exists household_members_self_insert on household_members;
      drop policy if exists household_members_self_delete on household_members;
      drop policy if exists household_members_select on household_members;
      drop policy if exists household_members_insert on household_members;
      drop policy if exists household_members_delete on household_members;
      create or replace function public.user_households() returns setof uuid language sql stable security definer as $$ select household_id from household_members where user_id = auth.uid(); $$;
      alter table household_members enable row level security;
      create policy household_members_select on household_members for select using (user_id = auth.uid() or household_id = any(select * from public.user_households()));
      create policy household_members_insert on household_members for insert with check (auth.uid() is not null);
      create policy household_members_delete on household_members for delete using (user_id = auth.uid() or household_id = any(select * from public.user_households()));
    `;
    const fixResult = await callRpc('exec_sql', { sql: fixSql });
    steps.push({ step: 'fix rls via exec_sql', ok: fixResult.status < 300, data: fixResult.data });
  } else {
    // exec_sql nie istnieje - informacja dla Adriana
    steps.push({
      step: 'manual action required',
      ok: false,
      error: 'exec_sql RPC nie istnieje. Potrzebny dostęp do Supabase Dashboard lub DB password aby wykonać naprawę przez SQL Editor.',
      data: {
        fix_sql: `
-- Wklej to do Supabase Dashboard → SQL Editor:
alter table household_members disable row level security;
drop policy if exists household_members_self on household_members;
drop policy if exists household_members_self_insert on household_members;
drop policy if exists household_members_self_delete on household_members;
drop policy if exists household_members_select on household_members;
drop policy if exists household_members_insert on household_members;
drop policy if exists household_members_delete on household_members;
create or replace function public.user_households()
returns setof uuid language sql stable security definer
as $$ select household_id from household_members where user_id = auth.uid(); $$;
alter table household_members enable row level security;
create policy household_members_select on household_members for select
  using (user_id = auth.uid() or household_id = any(select * from public.user_households()));
create policy household_members_insert on household_members for insert
  with check (auth.uid() is not null);
create policy household_members_delete on household_members for delete
  using (user_id = auth.uid() or household_id = any(select * from public.user_households()));
        `
      }
    });
  }

  return NextResponse.json({ ok: steps.every(s => s.ok || s.step === 'rpc exec_sql test'), steps });
}
