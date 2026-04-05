'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type ExpenseForm = { date: string; category: string; amount: string; description: string };

export async function addExpense(form: ExpenseForm) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO expenses (date, category, amount, description)
    VALUES (?, ?, ?, ?)
  `).run(form.date, form.category, parseFloat(form.amount), form.description);

  const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
  revalidatePath('/budzet');
  return { expense };
}

export async function deleteExpense(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  revalidatePath('/budzet');
}
