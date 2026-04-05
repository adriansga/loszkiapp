import { getDb } from '@/lib/db';
import ShoppingListClient from './ShoppingListClient';

function getWeekNumber(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

export default async function ZakupyPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const db = getDb();
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const selectedWeek = params.week ? parseInt(params.week) : currentWeek;

  const existingList = db.prepare(`
    SELECT sl.*,
      json_group_array(json_object(
        'id', si.id, 'name', si.name, 'quantity', si.quantity,
        'unit', si.unit, 'checked', si.checked, 'category', si.category
      )) as items_json
    FROM shopping_lists sl
    LEFT JOIN shopping_items si ON si.list_id = sl.id
    WHERE sl.week_number = ? AND sl.status = 'active'
    GROUP BY sl.id
    LIMIT 1
  `).get(selectedWeek) as { id: number; week_number: number; created_at: string; items_json: string } | undefined;

  let listId: number | null = null;
  let items: Array<{ id: number; name: string; quantity: string; unit: string; checked: number; category: string }> = [];

  if (existingList) {
    listId = existingList.id;
    try {
      const parsed = JSON.parse(existingList.items_json);
      items = parsed.filter((i: { id: number | null }) => i.id !== null);
    } catch {
      items = [];
    }
  }

  return (
    <ShoppingListClient
      selectedWeek={selectedWeek}
      currentWeek={currentWeek}
      listId={listId}
      initialItems={items}
    />
  );
}
