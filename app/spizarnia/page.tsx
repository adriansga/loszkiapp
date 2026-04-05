import { getDb } from '@/lib/db';
import PantryClient from './PantryClient';

export default function SpizarniaPage() {
  const db = getDb();
  const items = db.prepare('SELECT * FROM pantry ORDER BY category, name').all() as Array<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    purchase_date: string;
    expiry_days: number;
    notes: string;
  }>;

  return <PantryClient initialItems={items} />;
}
