import { createClient } from '@supabase/supabase-js';

// Publiczne klucze — bezpieczne do hardkodowania (anon key + URL są publiczne)
export const supabase = createClient(
  'https://qlqnrsxpmoeoukfgovmy.supabase.co',
  'sb_publishable_H4esPhmhBIIUJSb78_JLOw_kE1VOmty'
);

// Stary interfejs dla kompatybilności (tymczasowo)
export const getDb = () => {
  throw new Error('SQLite nie jest obsługiwany online. Użyj exportu "supabase" z lib/db.ts');
};
