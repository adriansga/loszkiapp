import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/db';

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'missing name' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('households')
    .insert({ name })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ household: data });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  // Kaskadowo usunie wszystkie powiązane dane (dzięki ON DELETE CASCADE na household_id)
  const { error } = await supabaseAdmin.from('households').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
