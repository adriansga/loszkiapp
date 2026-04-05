'use server';

import { supabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type ExpenseForm = { date: string; category: string; amount: string; description: string };

export async function addExpense(form: ExpenseForm) {
  const { data } = await supabase
    .from('expenses')
    .insert({ date: form.date, category: form.category, amount: parseFloat(form.amount), description: form.description })
    .select()
    .single();
  revalidatePath('/budzet');
  return { expense: data };
}

export async function deleteExpense(id: number) {
  await supabase.from('expenses').delete().eq('id', id);
  revalidatePath('/budzet');
}
