#!/usr/bin/env node
// Apply base schema + all public migrations to NEW Supabase (homespace)
// Uzycie: SUPABASE_ACCESS_TOKEN=sbp_xxx HOMESPACE_SUPABASE_REF=xgsuyvuy... node scripts/migrate-homespace.mjs

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const REF = process.env.HOMESPACE_SUPABASE_REF || 'xgsuyvuyddqhklshohjl';

if (!TOKEN) {
  console.error('Brak SUPABASE_ACCESS_TOKEN. Ustaw zmienna srodowiskowa przed uruchomieniem.');
  process.exit(1);
}

async function q(sql) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(d));
  return d;
}

const files = [
  '_base_schema.sql',
  ...readdirSync('supabase/migrations')
    .filter(f => f.endsWith('.sql') && !f.startsWith('_'))
    .sort(),
];

for (const f of files) {
  const sql = readFileSync(join('supabase/migrations', f), 'utf-8');
  process.stdout.write(`-> ${f} ... `);
  try {
    await q(sql);
    console.log('OK');
  } catch (e) {
    console.log('FAIL');
    console.error(e.message.slice(0, 500));
    process.exit(1);
  }
}
console.log('\nSchema + migracje zastosowane na homespace.');
