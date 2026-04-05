#!/usr/bin/env node
// scripts/migrate.mjs
// Uruchom: node scripts/migrate.mjs
// Wymaga SUPABASE_ACCESS_TOKEN w .env.local lub w środowisku

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Wczytaj .env.local
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

const PROJECT_REF = 'qlqnrshpmoeoukfgovmy'
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!TOKEN) {
  console.error('❌ Brak SUPABASE_ACCESS_TOKEN — dodaj do .env.local lub GitHub Secrets')
  process.exit(1)
}

const migrationsDir = 'supabase/migrations'
let files
try {
  files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()
} catch {
  console.error('❌ Brak folderu', migrationsDir)
  process.exit(1)
}

if (!files.length) {
  console.log('Brak plików .sql w', migrationsDir)
  process.exit(0)
}

console.log(`Znaleziono ${files.length} plików migracji\n`)

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), 'utf-8')
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

console.log('\n✅ Wszystkie migracje wykonane.')
