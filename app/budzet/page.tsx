import { getDb } from '@/lib/db';
import BudzetClient from './BudzetClient';

export default function BudzetPage() {
  const db = getDb();
  const today = new Date();
  const todayDay = today.getDate();

  const bills = db.prepare('SELECT * FROM bills WHERE active = 1 ORDER BY due_day').all() as Array<{
    id: number;
    name: string;
    amount: number;
    due_day: number;
    category: string;
  }>;

  const currentMonth = today.toISOString().slice(0, 7);
  const expenses = db.prepare(`
    SELECT * FROM expenses WHERE date LIKE ? ORDER BY date DESC
  `).all(`${currentMonth}%`) as Array<{
    id: number;
    date: string;
    category: string;
    amount: number;
    description: string;
  }>;

  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const billsWithDaysLeft = bills.map(b => ({
    ...b,
    daysLeft: b.due_day >= todayDay ? b.due_day - todayDay : 30 - todayDay + b.due_day,
  }));

  return (
    <BudzetClient
      bills={billsWithDaysLeft}
      expenses={expenses}
      totalBills={totalBills}
      totalExpenses={totalExpenses}
      currentMonth={currentMonth}
    />
  );
}
