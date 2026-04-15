import { NextResponse } from 'next/server';
import { getSupabaseServer, getCurrentHouseholdId, getCurrentUser } from '@/lib/supabase-server';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const householdId = await getCurrentHouseholdId();
  if (!householdId) return NextResponse.json({ error: 'no_household' }, { status: 400 });

  const supabase = await getSupabaseServer();
  const token = randomBytes(24).toString('base64url');

  const { error } = await supabase.from('invite_tokens').insert({
    household_id: householdId,
    token,
    created_by: user.id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { origin } = new URL(request.url);
  return NextResponse.json({
    token,
    url: `${origin}/invite/${token}`,
  });
}
