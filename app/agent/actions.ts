'use server';

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/db';

type Message = { role: 'user' | 'assistant'; content: string };

async function getContext() {
  const today = new Date();
  const weekNum = Math.ceil((((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(today.getFullYear(), 0, 1).getDay() + 1) / 7);

  const { data: weekMeals } = await supabase
    .from('weekly_plan')
    .select('day_of_week, meal_name')
    .eq('week_number', weekNum);

  const { data: pantry } = await supabase
    .from('pantry')
    .select('name, quantity, unit');

  const { data: bills } = await supabase
    .from('bills')
    .select('name, amount, due_day')
    .eq('active', true);

  const days = ['', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];
  const planText = weekMeals?.map(m => `${days[m.day_of_week]}: ${m.meal_name}`).join(', ') || 'brak planu';
  const pantryText = pantry?.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ') || 'pusta';
  const billsText = bills?.map(b => `${b.name} ${b.amount}zł/${b.due_day}.`).join(', ') || 'brak';

  return `PROFIL: Adrian (cel 150-160g białka/dzień), Kasia (cel 75-100g/dzień). Zakupy: soboty. Budżet jedzenie: 220zł/mies.
PLAN TYGODNIA (tydzień ${weekNum}): ${planText}
SPIŻARNIA: ${pantryText}
RACHUNKI: ${billsText}
DATA: ${today.toLocaleDateString('pl-PL')}`;
}

export async function sendMessage(messages: Message[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return 'Brak klucza ANTHROPIC_API_KEY. Dodaj go w ustawieniach Vercel → Environment Variables.';
  }

  const context = await getContext();
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: `Jesteś Agentem Loszki — asystentem domowym Adriana i Kasi. Odpowiadasz po polsku, krótko i konkretnie.\n\n${context}`,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  return (response.content[0] as { text: string }).text;
}
