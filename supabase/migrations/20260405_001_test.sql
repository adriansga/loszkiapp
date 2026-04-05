-- Test migracji v4: weryfikacja pipeline psql → Supabase Transaction Pooler
-- Dodaje kolumnę version do tabeli meals (idempotentne)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meals' AND column_name = 'version'
  ) THEN
    ALTER TABLE meals ADD COLUMN version INTEGER DEFAULT 1;
  END IF;
END $$;
-- trigger v5
