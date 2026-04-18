import { createClient } from '@supabase/supabase-js';
import { getSupabaseServer } from './supabase-server';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ANON client — DEPRECATED dla danych usera. Zostawiam dla kompatybilności.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ADMIN client — omija RLS. Używać we wszystkich server actions i page.tsx.
// BEZPIECZEŃSTWO: service key NIE trafia do przeglądarki (Next.js server-only).
// Filtrowanie po household_id zapewniamy programowo przez getCurrentHouseholdId().
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : supabase;

// Pobiera household_id aktualnego usera przez admin client (omija RLS).
// FIX: używamy supabaseAdmin zamiast sesji użytkownika żeby uniknąć
// infinite recursion w RLS policy na household_members.
export async function getCurrentHouseholdId(): Promise<string | null> {
  // Pobieramy user przez serwer client (auth nie ma RLS)
  const serverClient = await getSupabaseServer();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) return null;
  // Query na household_members przez admin client (omija rekurencyjne RLS)
  const { data } = await supabaseAdmin
    .from('household_members')
    .select('household_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();
  return data?.household_id ?? null;
}

// Stały household_id dla "Dom Loszki" — używany przy INSERT przez service role
// (gdy trigger set_household_id_trigger nie może użyć auth.uid())
export const DEFAULT_HOUSEHOLD_ID = '00000000-0000-0000-0000-000000000001';

// AUTHENTICATED DB client — zwraca supabaseAdmin (service role, omija RLS).
// FIX: zamiast używać sesji użytkownika (która triggeruje rekurencyjne RLS),
// używamy admin client który omija RLS.
// BEZPIECZEŃSTWO: service key jest tylko po stronie serwera Next.js (nigdy do przeglądarki).
// Trigger set_household_id_trigger nie działa z service role (auth.uid() = null),
// więc household_id ustawiamy jawnie w spizarnia/actions.ts i innych actions.
export async function getDb() {
  return supabaseAdmin;
}
