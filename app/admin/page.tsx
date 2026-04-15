import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/db';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/');

  // Pobierz wszystkie householdy z licznikami
  const { data: households } = await supabaseAdmin
    .from('households')
    .select('id, name, created_at')
    .order('created_at', { ascending: false });

  // Members per household
  const { data: members } = await supabaseAdmin
    .from('household_members')
    .select('household_id, user_id, role, joined_at');

  // Aktywne invite tokens
  const { data: invites } = await supabaseAdmin
    .from('invite_tokens')
    .select('id, household_id, token, used_at, used_by, expires_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  // Emaile userów (przez auth admin)
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  const userMap = new Map(users.map(u => [u.id, u.email ?? '']));

  const householdsWithMembers = (households ?? []).map(h => ({
    ...h,
    members: (members ?? [])
      .filter(m => m.household_id === h.id)
      .map(m => ({ email: userMap.get(m.user_id) ?? '(nieznany)', role: m.role, joined_at: m.joined_at })),
  }));

  const invitesEnriched = (invites ?? []).map(i => ({
    ...i,
    household_name: households?.find(h => h.id === i.household_id)?.name ?? '(usunięty)',
    used_by_email: i.used_by ? userMap.get(i.used_by) ?? '' : '',
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛡️ Admin Dashboard</h1>
      <AdminClient households={householdsWithMembers} invites={invitesEnriched} />
    </div>
  );
}
