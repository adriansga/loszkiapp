import { createClient } from '@supabase/supabase-js';

// Używamy zwykłych env vars (bez NEXT_PUBLIC_) — Supabase używany tylko server-side
// Dzięki temu są czytane z process.env w runtime, nie inlinowane podczas buildu
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
