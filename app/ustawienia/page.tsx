import { getCurrentUser, getCurrentHouseholdId } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/db';
import UstawieniaClient from './UstawieniaClient';

export default async function UstawieniaPage() {
  const user = await getCurrentUser();
  const householdId = await getCurrentHouseholdId();

  let householdName = '';
  let members: { email: string; role: string }[] = [];

  if (householdId) {
    const { data: h } = await supabaseAdmin.from('households').select('name').eq('id', householdId).maybeSingle();
    householdName = h?.name ?? '';
    const { data: m } = await supabaseAdmin
      .from('household_members')
      .select('role, user_id')
      .eq('household_id', householdId);

    const { data: usersRes } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    const userMap = new Map((usersRes?.users ?? []).map(u => [u.id, u.email ?? '']));
    members = (m ?? []).map(x => ({ email: userMap.get(x.user_id) ?? '(nieznany)', role: x.role }));
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ustawienia</h1>

      <section className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Konto</h2>
        <p className="text-gray-600 mb-4">{user?.email}</p>
        <form action="/auth/signout" method="POST">
          <button type="submit" className="text-red-600 hover:text-red-700 font-semibold">
            Wyloguj się
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Dom: {householdName}</h2>
        <p className="text-sm text-gray-600 mb-4">Członkowie: {members.length}</p>
        <ul className="space-y-2 mb-4">
          {members.map((m, i) => (
            <li key={i} className="flex justify-between">
              <span>{m.email}</span>
              <span className="text-gray-500 text-sm">{m.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <UstawieniaClient />
    </div>
  );
}
