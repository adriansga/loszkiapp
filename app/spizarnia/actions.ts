'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type PantryForm = { name: string; quantity: string; unit: string; category: string; purchase_date: string; expiry_days: string };

export async function addPantryItem(form: PantryForm) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO pantry (name, quantity, unit, category, purchase_date, expiry_days)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    form.name,
    parseFloat(form.quantity) || 1,
    form.unit,
    form.category,
    form.purchase_date || null,
    form.expiry_days ? parseInt(form.expiry_days) : null,
  );
  const item = db.prepare('SELECT * FROM pantry WHERE id = ?').get(result.lastInsertRowid);
  revalidatePath('/spizarnia');
  return { item };
}

export async function deletePantryItem(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM pantry WHERE id = ?').run(id);
  revalidatePath('/spizarnia');
}

export async function updatePantryQuantity(id: number, quantity: number) {
  const db = getDb();
  db.prepare('UPDATE pantry SET quantity = ? WHERE id = ?').run(quantity, id);
  revalidatePath('/spizarnia');
}
