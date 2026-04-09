import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { subscription, owner } = await req.json();
  const { endpoint, keys } = subscription;

  await supabase.from('push_subscriptions').upsert(
    { owner, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    { onConflict: 'endpoint' }
  );

  return NextResponse.json({ ok: true });
}
