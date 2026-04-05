import { supabase } from '@/lib/db';
import ShoppingListClient from './ShoppingListClient';

export const dynamic = 'force-dynamic';

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
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const selectedWeek = params.week ? parseInt(params.week) : currentWeek + 1;

  const { data: existingList } = await supabase
    .from('shopping_lists')
    .select('id')
    .eq('week_number', selectedWeek)
    .eq('status', 'active')
    .maybeSingle();

  let listId: number | null = null;
  let items: Array<{ id: number; name: string; quantity: string; unit: string; checked: number; category: string }> = [];

  if (existingList) {
    listId = existingList.id;
    const { data: listItems } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('list_id', listId)
      .order('category');
    items = listItems || [];
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
