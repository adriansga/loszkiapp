import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components nie mogą ustawiać cookies — zignoruj
          }
        },
      },
    }
  );
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// getCurrentHouseholdId — re-export z lib/db.ts (tam logika żeby uniknąć circular import)
// WAŻNE: nie importuj tu z './db' statycznie (circular dependency!)
// Funkcja getCurrentHouseholdId jest eksportowana z db.ts i można ją tam importować bezpośrednio.
// Ten re-export zachowuje kompatybilność z istniejącymi plikami które importują z supabase-server.
export async function getCurrentHouseholdId(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  // Używamy service role przez fetch bezpośrednio, żeby uniknąć RLS rekursji
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) return null;

  const resp = await fetch(
    `${supabaseUrl}/rest/v1/household_members?user_id=eq.${user.id}&select=household_id&limit=1`,
    {
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      }
    }
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  return Array.isArray(data) && data.length > 0 ? data[0].household_id : null;
}
