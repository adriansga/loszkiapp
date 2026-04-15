import { getDb } from '@/lib/db';
import PantryClient from './PantryClient';

export const dynamic = 'force-dynamic';

export default async function SpizarniaPage() {
  const supabase = await getDb();
  const { data: items } = await supabase
    .from('pantry')
    .select('*')
    .or('is_consumed.is.null,is_consumed.eq.false')
    .order('category')
    .order('name');

  const { data: consumedItems } = await supabase
    .from('pantry')
    .select('*')
    .eq('is_consumed', true)
    .order('consumed_at', { ascending: false })
    .limit(50);

  return <PantryClient initialItems={items || []} initialConsumedItems={consumedItems || []} />;
}
