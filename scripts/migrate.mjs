#!/usr/bin/env node
// scripts/migrate.mjs
// Uruchom lokalnie: node scripts/migrate.mjs
// W GitHub Actions: SUPABASE_ACCESS_TOKEN w Secrets

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Wczytaj .env.local (lokalnie)
try {
  const env = readFileSync('.env.local', 'utf-8')
  for (const line of env.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

const PROJECT_REF = 'qlqnrsxpmoeoukfgovmy'
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!TOKEN) {
  console.error('❌ Brak SUPABASE_ACCESS_TOKEN w .env.local lub środowisku')
  process.exit(1)
}

const files = readdirSync('supabase/migrations')
  .filter(f => f.endsWith('.sql'))
  .sort()

if (!files.length) {
  console.log('Brak plików SQL w supabase/migrations/')
  process.exit(0)
}

console.log(`Znaleziono ${files.length} plików migracji\n`)

for (const file of files) {
  const sql = readFileSync(join('supabase/migrations', file), 'utf-8')
  process.stdout.write(`→ ${file} ... `)

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    console.log('❌')
    console.error('Błąd:', JSON.stringify(data, null, 2))
    process.exit(1)
  }

  console.log('✓')
}

console.log('\n✅ Migracje wykonane.')
