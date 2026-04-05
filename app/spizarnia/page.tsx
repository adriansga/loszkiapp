import { supabase } from '@/lib/db';
import PantryClient from './PantryClient';

export const dynamic = 'force-dynamic';

export default async function SpizarniaPage() {
  const { data: items } = await supabase
    .from('pantry')
    .select('*')
    .order('category')
    .order('name');

  return <PantryClient initialItems={items || []} />;
}
