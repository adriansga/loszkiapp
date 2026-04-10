import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Używamy service_role key tutaj — operacja serwerowa, zapis do tabeli push_subscriptions
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { subscription, owner } = await req.json();
  const { endpoint, keys } = subscription;

  const { error } = await supabaseAdmin.from('push_subscriptions').upsert(
    { owner, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    { onConflict: 'endpoint' }
  );

  if (error) {
    console.error('[push/subscribe] DB error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
