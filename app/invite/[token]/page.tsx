import { supabaseAdmin } from '@/lib/db';
import { getCurrentUser } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data: invite } = await supabaseAdmin
    .from('invite_tokens')
    .select('*, households(name)')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  const user = await getCurrentUser();
  const householdName = (invite?.households as { name: string } | null)?.name;

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Zaproszenie nieważne</h1>
          <p className="text-gray-600">Link wygasł lub został już użyty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-5xl mb-4">🏠</div>
        <h1 className="text-2xl font-bold mb-2">Zaproszenie do domu</h1>
        <p className="text-gray-600 mb-6">
          Zostałeś zaproszony do <strong>{householdName}</strong> w Loszki.
        </p>
        {user ? (
          <Link
            href={`/api/invite/accept?token=${token}`}
            className="block bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
          >
            Dołącz do domu
          </Link>
        ) : (
          <Link
            href={`/login?invite=${token}`}
            className="block bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
          >
            Zaloguj się aby dołączyć
          </Link>
        )}
      </div>
    </div>
  );
}
