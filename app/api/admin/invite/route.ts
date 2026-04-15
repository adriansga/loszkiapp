import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/db';
import { getCurrentUser } from '@/lib/supabase-server';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const user = await getCurrentUser();
  const { household_id } = await req.json();
  if (!household_id) return NextResponse.json({ error: 'missing household_id' }, { status: 400 });

  const token = randomBytes(24).toString('base64url');
  const { error } = await supabaseAdmin.from('invite_tokens').insert({
    household_id,
    token,
    created_by: user?.id,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { origin } = new URL(req.url);
  return NextResponse.json({ token, url: `${origin}/invite/${token}` });
}
