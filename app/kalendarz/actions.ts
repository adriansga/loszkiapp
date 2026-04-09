'use server';

import { supabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addEvent(form: {
  title: string;
  date: string;
  time?: string;
  owner: string;
  notes?: string;
  reminder_days?: number;
}) {
  await supabase.from('calendar_events').insert({
    title: form.title,
    date: form.date,
    time: form.time || null,
    owner: form.owner,
    notes: form.notes || null,
    reminder_days: form.reminder_days ?? null,
  });
  revalidatePath('/kalendarz');
}

export async function deleteEvent(id: string) {
  await supabase.from('calendar_events').delete().eq('id', id);
  revalidatePath('/kalendarz');
}
