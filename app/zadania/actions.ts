'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type Task = {
  id: string;
  title: string;
  assigned_to: 'adrian' | 'kasia' | 'oboje';
  due_date: string | null;
  status: 'todo' | 'done';
  notes: string | null;
  created_at: string;
  done_at: string | null;
};

export async function getTasks(): Promise<Task[]> {
  const supabase = await getDb();
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .order('status', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });
  return (data || []) as Task[];
}

export async function addTask(form: { title: string; assigned_to: string; due_date: string; notes: string }) {
  const supabase = await getDb();
  const { data } = await supabase
    .from('tasks')
    .insert({
      title: form.title,
      assigned_to: form.assigned_to,
      due_date: form.due_date || null,
      notes: form.notes || null,
      status: 'todo',
    })
    .select()
    .single();
  revalidatePath('/zadania');
  return { task: data };
}

export async function toggleTask(id: string, currentStatus: 'todo' | 'done') {
  const supabase = await getDb();
  const newStatus = currentStatus === 'todo' ? 'done' : 'todo';
  await supabase
    .from('tasks')
    .update({
      status: newStatus,
      done_at: newStatus === 'done' ? new Date().toISOString() : null,
    })
    .eq('id', id);
  revalidatePath('/zadania');
}

export async function deleteTask(id: string) {
  const supabase = await getDb();
  await supabase.from('tasks').delete().eq('id', id);
  revalidatePath('/zadania');
}
