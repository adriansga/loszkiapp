import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const householdId = req.nextUrl.searchParams.get('household_id');
  const email = req.nextUrl.searchParams.get('email');
  if (!householdId || !email) return NextResponse.json({ error: 'missing params' }, { status: 400 });

  // Znajdź user_id po email
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

  const { error } = await supabaseAdmin
    .from('household_members')
    .delete()
    .eq('household_id', householdId)
    .eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
