import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { getCurrentUser, getCurrentHouseholdId } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const { subscription, owner } = await req.json();
  const { endpoint, keys } = subscription;

  const user = await getCurrentUser();
  const householdId = await getCurrentHouseholdId();

  const { error } = await supabaseAdmin.from('push_subscriptions').upsert(
    {
      owner: owner ?? user?.email ?? 'unknown',
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      user_id: user?.id ?? null,
      household_id: householdId ?? '00000000-0000-0000-0000-000000000001',
    },
    { onConflict: 'endpoint' }
  );

  if (error) {
    console.error('[push/subscribe] DB error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
