import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') ?? '/';
  const inviteToken = searchParams.get('invite');

  if (code) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Jeśli user już ma household — przejdź do aplikacji
      const { data: existing } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', data.user.id)
        .limit(1)
        .maybeSingle();

      if (!existing) {
        if (inviteToken) {
          // Obsługujemy invite TU — data.user jest pewny (właśnie zalogowany).
          // NIE robimy redirect do /api/invite/accept, bo cookies sesji nie
          // propagują się przez redirect i getCurrentUser() zwraca null → pętla.
          const { data: invite } = await supabaseAdmin
            .from('invite_tokens')
            .select('household_id')
            .eq('token', inviteToken)
            .is('used_at', null)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

          if (invite) {
            await supabaseAdmin.from('household_members').insert({
              household_id: invite.household_id,
              user_id: data.user.id,
              role: 'member',
            });
            await supabaseAdmin
              .from('invite_tokens')
              .update({
                used_at: new Date().toISOString(),
                used_by: data.user.id,
              })
              .eq('token', inviteToken);

            return NextResponse.redirect(`${origin}/?invite=accepted`);
          }

          // Token nieważny — powiedz użytkownikowi (sesja już jest, więc idą do /invite/invalid zalogowani)
          return NextResponse.redirect(`${origin}/invite/invalid`);
        }

        // Brak invite — stwórz nowy household dla nowego użytkownika
        const { data: household } = await supabase
          .from('households')
          .insert({ name: `Dom ${data.user.email?.split('@')[0] ?? 'nowy'}`, created_by: data.user.id })
          .select()
          .single();

        if (household) {
          await supabase.from('household_members').insert({
            household_id: household.id,
            user_id: data.user.id,
            role: 'owner',
          });
        }
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
