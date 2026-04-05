'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type ShoppingItem = { id: number; name: string; quantity: string; unit: string; checked: number; category: string };

const DEFAULT_SHOPPING: Array<{ name: string; quantity: string; unit: string; category: string }> = [
  { name: 'Kurczak filet', quantity: '1 kg', unit: 'kg', category: 'mięso' },
  { name: 'Mięso mielone', quantity: '500 g', unit: 'g', category: 'mięso' },
  { name: 'Kiełbasa', quantity: '300 g', unit: 'g', category: 'mięso' },
  { name: 'Jajka', quantity: '10 szt.', unit: 'szt', category: 'nabiał' },
  { name: 'Śmietana 18%', quantity: '200 ml', unit: 'ml', category: 'nabiał' },
  { name: 'Ser żółty', quantity: '150 g', unit: 'g', category: 'nabiał' },
  { name: 'Masło', quantity: '200 g', unit: 'g', category: 'nabiał' },
  { name: 'Mleko', quantity: '1 l', unit: 'l', category: 'nabiał' },
  { name: 'Ziemniaki', quantity: '1,5 kg', unit: 'kg', category: 'warzywa' },
  { name: 'Cebula', quantity: '3 szt.', unit: 'szt', category: 'warzywa' },
  { name: 'Czosnek', quantity: '1 główka', unit: 'szt', category: 'warzywa' },
  { name: 'Marchew', quantity: '3 szt.', unit: 'szt', category: 'warzywa' },
  { name: 'Pomidor', quantity: '3 szt.', unit: 'szt', category: 'warzywa' },
  { name: 'Ogórek', quantity: '2 szt.', unit: 'szt', category: 'warzywa' },
  { name: 'Sałata / kapusta', quantity: '1 szt.', unit: 'szt', category: 'warzywa' },
  { name: 'Passata pomidorowa', quantity: '1 puszka (500 g)', unit: 'szt', category: 'suche' },
  { name: 'Makaron', quantity: '400 g', unit: 'g', category: 'suche' },
  { name: 'Ryż', quantity: '1 torebka', unit: 'szt', category: 'suche' },
  { name: 'Kasza gryczana', quantity: '400 g', unit: 'g', category: 'suche' },
  { name: 'Olej / oliwa', quantity: '—', unit: '', category: 'suche' },
  { name: 'Tortille', quantity: '1 opakowanie', unit: 'szt', category: 'pieczywo' },
  { name: 'Chleb', quantity: '1 bochenek', unit: 'szt', category: 'pieczywo' },
];

export async function generateShoppingList(weekNumber: number) {
  const db = getDb();

  const existing = db.prepare(
    'SELECT id FROM shopping_lists WHERE week_number = ? AND status = ?'
  ).get(weekNumber, 'active');
  if (existing) {
    const items = db.prepare(
      'SELECT * FROM shopping_items WHERE list_id = ? ORDER BY category, name'
    ).all((existing as { id: number }).id) as ShoppingItem[];
    return { listId: (existing as { id: number }).id, items };
  }

  const pantry = db.prepare('SELECT name, quantity FROM pantry').all() as Array<{ name: string; quantity: number }>;
  const pantryNames = pantry.map(p => p.name.toLowerCase());

  const insertList = db.prepare(
    'INSERT INTO shopping_lists (week_number, created_at, status) VALUES (?, ?, ?)'
  );
  const result = insertList.run(weekNumber, new Date().toISOString(), 'active');
  const listId = result.lastInsertRowid as number;

  const insertItem = db.prepare(
    'INSERT INTO shopping_items (list_id, name, quantity, unit, checked, category) VALUES (?, ?, ?, ?, 0, ?)'
  );

  const filtered = DEFAULT_SHOPPING.filter(item => {
    const hasInPantry = pantryNames.some(p =>
      p.includes(item.name.toLowerCase().split(' ')[0]) ||
      item.name.toLowerCase().includes(p)
    );
    return !hasInPantry;
  });

  const insertMany = db.transaction((items: typeof filtered) => {
    for (const item of items) {
      insertItem.run(listId, item.name, item.quantity, item.unit, item.category);
    }
  });
  insertMany(filtered);

  const items = db.prepare(
    'SELECT * FROM shopping_items WHERE list_id = ? ORDER BY category, name'
  ).all(listId) as ShoppingItem[];

  revalidatePath('/zakupy');
  return { listId, items };
}

export async function toggleItem(itemId: number) {
  const db = getDb();
  db.prepare('UPDATE shopping_items SET checked = CASE WHEN checked = 1 THEN 0 ELSE 1 END WHERE id = ?').run(itemId);
  revalidatePath('/zakupy');
}

export async function addItem(listId: number, name: string, quantity: string) {
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO shopping_items (list_id, name, quantity, unit, checked, category) VALUES (?, ?, ?, ?, 0, ?)'
  ).run(listId, name, quantity, '', 'inne');

  const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(result.lastInsertRowid) as ShoppingItem;
  revalidatePath('/zakupy');
  return { item };
}

export const SWEETS_LIST: Array<{ name: string; quantity: string; unit: string; category: string }> = [
  { name: 'Żelki kablowe', quantity: '1 paczka', unit: 'szt', category: 'słodycze' },
  { name: 'Żelki Frulusie', quantity: '1 paczka', unit: 'szt', category: 'słodycze' },
  { name: 'Żelki mleczne', quantity: '1 paczka', unit: 'szt', category: 'słodycze' },
  { name: 'Rurki waniliowe', quantity: '1 paczka', unit: 'szt', category: 'słodycze' },
  { name: 'Wafle', quantity: '1 paczka', unit: 'szt', category: 'słodycze' },
  { name: 'JELLY BEANS', quantity: '1 paczka', unit: 'szt', category: 'słodycze' },
  { name: 'BIG HIT orzech/czek', quantity: '1 paczka', unit: 'szt', category: 'słodycze' },
];

export async function addSweetsToList(listId: number) {
  const db = getDb();
  const pantry = db.prepare('SELECT name FROM pantry WHERE category = ?').all('słodycze') as Array<{ name: string }>;
  const pantryNames = pantry.map(p => p.name.toLowerCase());

  const insertItem = db.prepare(
    'INSERT INTO shopping_items (list_id, name, quantity, unit, checked, category) VALUES (?, ?, ?, ?, 0, ?)'
  );

  const toAdd = SWEETS_LIST.filter(s => {
    return !pantryNames.some(p => p.includes(s.name.toLowerCase().split(' ')[0]) || s.name.toLowerCase().includes(p));
  });

  const insertMany = db.transaction((items: typeof toAdd) => {
    for (const item of items) {
      insertItem.run(listId, item.name, item.quantity, item.unit, item.category);
    }
  });
  insertMany(toAdd);

  const items = db.prepare(
    'SELECT * FROM shopping_items WHERE list_id = ? ORDER BY category, name'
  ).all(listId) as ShoppingItem[];

  revalidatePath('/zakupy');
  return { items };
}

export async function deleteList(listId: number) {
  const db = getDb();
  db.prepare('DELETE FROM shopping_items WHERE list_id = ?').run(listId);
  db.prepare('DELETE FROM shopping_lists WHERE id = ?').run(listId);
  revalidatePath('/zakupy');
}
