'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Member = { email: string; role: string; joined_at: string };
type Household = { id: string; name: string; created_at: string; members: Member[] };
type Invite = { id: string; household_id: string; token: string; household_name: string; used_at: string | null; used_by_email: string; expires_at: string; created_at: string };

export default function AdminClient({ households, invites }: { households: Household[]; invites: Invite[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function generateInviteForHousehold(householdId: string) {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ household_id: householdId }),
      });
      const data = await res.json();
      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        setMsg('✓ Link skopiowany: ' + data.url);
      } else {
        setMsg('Błąd: ' + (data.error ?? 'unknown'));
      }
      router.refresh();
    } finally { setBusy(false); }
  }

  async function createHousehold(name: string) {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch('/api/admin/household', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setMsg(data.error ? 'Błąd: ' + data.error : '✓ Utworzono');
      router.refresh();
    } finally { setBusy(false); }
  }

  async function deleteHousehold(id: string, name: string) {
    if (!confirm(`Usunąć dom "${name}" z WSZYSTKIMI danymi?`)) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/admin/household?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      setMsg(data.error ? 'Błąd: ' + data.error : '✓ Usunięto');
      router.refresh();
    } finally { setBusy(false); }
  }

  async function removeMember(householdId: string, email: string) {
    if (!confirm(`Usunąć ${email} z domu?`)) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/admin/member?household_id=${householdId}&email=${encodeURIComponent(email)}`, { method: 'DELETE' });
      const data = await res.json();
      setMsg(data.error ? 'Błąd: ' + data.error : '✓ Usunięto członka');
      router.refresh();
    } finally { setBusy(false); }
  }

  const [newName, setNewName] = useState('');

  return (
    <>
      {msg && <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded mb-4 text-sm">{msg}</div>}

      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Stwórz nowy dom (household)</h2>
        <div className="flex gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nazwa domu"
            className="flex-1 px-3 py-2 border rounded" />
          <button onClick={() => { createHousehold(newName); setNewName(''); }} disabled={busy || !newName}
            className="bg-emerald-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-50">
            Stwórz
          </button>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Domy ({households.length})</h2>
        <div className="space-y-4">
          {households.map(h => (
            <div key={h.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold">{h.name}</h3>
                  <p className="text-xs text-gray-500">{h.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => generateInviteForHousehold(h.id)} disabled={busy}
                    className="text-sm bg-pink-600 text-white px-3 py-1 rounded disabled:opacity-50">
                    + Invite link
                  </button>
                  <button onClick={() => deleteHousehold(h.id, h.name)} disabled={busy}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50">
                    Usuń
                  </button>
                </div>
              </div>
              <ul className="text-sm ml-2 space-y-1">
                {h.members.map((m, i) => (
                  <li key={i} className="flex justify-between items-center py-1">
                    <span>👤 {m.email} <span className="text-gray-400">({m.role})</span></span>
                    <button onClick={() => removeMember(h.id, m.email)} disabled={busy}
                      className="text-xs text-red-600 hover:underline">usuń</button>
                  </li>
                ))}
                {h.members.length === 0 && <li className="text-gray-400 italic">brak członków</li>}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Ostatnie zaproszenia ({invites.length})</h2>
        <div className="text-sm space-y-1">
          {invites.map(i => {
            const expired = new Date(i.expires_at) < new Date();
            const status = i.used_at ? `✓ użyte przez ${i.used_by_email}` : expired ? '⏱ wygasło' : '● aktywne';
            return (
              <div key={i.id} className="flex justify-between border-b py-1">
                <span>{i.household_name}</span>
                <span className="text-gray-500">{status}</span>
              </div>
            );
          })}
          {invites.length === 0 && <p className="text-gray-400 italic">brak</p>}
        </div>
      </section>
    </>
  );
}
