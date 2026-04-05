import { supabase } from '@/lib/db';

export async function getAgentContext() {
  const today = new Date();
  const weekNum = Math.ceil((((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(today.getFullYear(), 0, 1).getDay() + 1) / 7);

  const { data: weekMeals } = await supabase
    .from('weekly_plan')
    .select('day_of_week, meal_name, meals(protein_rating, notes)')
    .eq('week_number', weekNum);

  const { data: pantry } = await supabase
    .from('pantry')
    .select('name, quantity, unit');

  const { data: bills } = await supabase
    .from('bills')
    .select('name, amount, due_day')
    .eq('active', true);

  return {
    weekMeals: weekMeals || [],
    pantry: pantry || [],
    bills: bills || [],
    today: today.toISOString()
  };
}
