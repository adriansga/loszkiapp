import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Stary interfejs dla kompatybilności (tymczasowo)
export const getDb = () => {
  throw new Error('SQLite nie jest obsługiwany online. Użyj exportu "supabase" z lib/db.ts');
};
