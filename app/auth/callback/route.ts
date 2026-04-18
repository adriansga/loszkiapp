import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') ?? '/';
  const inviteToken = searchParams.get('invite');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Tworzymy NAJPIERW response (redirect docelowy lub tymczasowy) —
  // potem przekazujemy go do klienta Supabase, żeby mógł w nim ustawić cookies.
  // To jedyny sposób żeby cookies sesji trafiły do przeglądarki przez redirect.
  const finalRedirect = `${origin}${redirect}`;
  const response = NextResponse.redirect(finalRedirect);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Ustawiamy cookies BEZPOŚREDNIO na response — nie przez next/headers cookies()
          // które są read-only w Route Handler i nie trafiają do redirect response.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Sesja jest teraz w cookies response. Sprawdzamy czy user ma household.
  const { data: existing } = await supabaseAdmin
    .from('household_members')
    .select('household_id')
    .eq('user_id', data.user.id)
    .limit(1)
    .maybeSingle();

  if (!existing) {
    if (inviteToken) {
      // Obsługujemy invite bezpośrednio tutaj (admin client omija RLS).
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

        // Cookies sesji są już w response — redirect z nimi
        response.headers.set('Location', `${origin}/?invite=accepted`);
        return response;
      }

      // Token nieważny lub wygasły
      response.headers.set('Location', `${origin}/invite/invalid`);
      return response;
    }

    // Nowy user bez invite — tworzymy household
    const { data: household } = await supabaseAdmin
      .from('households')
      .insert({
        name: `Dom ${data.user.email?.split('@')[0] ?? 'nowy'}`,
        created_by: data.user.id,
      })
      .select()
      .single();

    if (household) {
      await supabaseAdmin.from('household_members').insert({
        household_id: household.id,
        user_id: data.user.id,
        role: 'owner',
      });
    }
  }

  // Cookies sesji są w response — zwracamy redirect do strony docelowej
  return response;
}
