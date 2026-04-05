'use server';

import { getDb } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

type Message = { role: 'user' | 'assistant'; content: string };

function getContext() {
  const db = getDb();
  const today = new Date();

  const start = new Date(today.getFullYear(), 0, 1);
  const weekNum = Math.ceil((today.getTime() - start.getTime()) / 86400000 / 7);
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();

  const weekMeals = db.prepare(`
    SELECT wp.day_of_week, wp.meal_name, m.protein_per_serving, m.notes
    FROM weekly_plan wp LEFT JOIN meals m ON wp.meal_id = m.id
    WHERE wp.week_number = ?
    ORDER BY wp.day_of_week
  `).all(weekNum) as Array<{ day_of_week: number; meal_name: string; protein_per_serving: number; notes: string }>;

  const pantry = db.prepare('SELECT name, quantity, unit FROM pantry').all() as Array<{ name: string; quantity: number; unit: string }>;

  const bills = db.prepare('SELECT name, amount, due_day FROM bills WHERE active = 1').all() as Array<{ name: string; amount: number; due_day: number }>;

  const currentMonth = today.toISOString().slice(0, 7);
  const monthExpenses = db.prepare(`
    SELECT category, SUM(amount) as total FROM expenses WHERE date LIKE ? GROUP BY category
  `).all(`${currentMonth}%`) as Array<{ category: string; total: number }>;

  const dayLabels = ['', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

  const mealsText = weekMeals.length > 0
    ? weekMeals.map(m => `  ${dayLabels[m.day_of_week]}: ${m.meal_name}${m.protein_per_serving ? ` (~${m.protein_per_serving}g białka)` : ''}`).join('\n')
    : '  (brak planu na ten tydzień)';

  const pantryText = pantry.length > 0
    ? pantry.map(p => `  - ${p.name}: ${p.quantity} ${p.unit}`).join('\n')
    : '  (pusta spiżarnia)';

  const billsText = bills.map(b => {
    const daysLeft = b.due_day >= today.getDate() ? b.due_day - today.getDate() : 30 - today.getDate() + b.due_day;
    return `  - ${b.name}: ${b.amount} zł (${b.due_day}. każdego miesiąca, za ${daysLeft} dni)`;
  }).join('\n');

  const expensesText = monthExpenses.length > 0
    ? monthExpenses.map(e => `  - ${e.category}: ${e.total} zł`).join('\n')
    : '  (brak wydatków)';

  return `Dzisiaj: ${today.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Tydzień: ${weekNum}, dzień tygodnia: ${dayLabels[dayOfWeek]}

PLAN OBIADÓW NA TEN TYDZIEŃ (tydzień ${weekNum}):
${mealsText}

STAN SPIŻARNI:
${pantryText}

RACHUNKI CYKLICZNE:
${billsText}

WYDATKI W TYM MIESIĄCU:
${expensesText}

PROFIL:
- Adrian: cel białkowy ~150-160g/dzień, shake białkowy: ~47g/dzień
- Kasia: cel białkowy ~75-100g/dzień
- Zakupy: soboty
- Budżet na jedzenie: ~220 zł/miesiąc`;
}

export async function sendMessage(messages: Message[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return 'Brak klucza API. Dodaj ANTHROPIC_API_KEY do pliku .env.local żeby aktywować agenta.';
  }

  const context = getContext();

  const client = new Anthropic({ apiKey });

  const systemPrompt = `Jesteś Agentem Loszki — asystentem domowym Adriana i Kasi.
Znasz ich plan obiadów, spiżarnię, budżet i rachunki.
Odpowiadasz krótko, po polsku, konkretnie. Bez zbędnych elaboratów.
Jeśli pytają co ugotować — podaj konkretne danie i ewentualnie przypomnienie o składnikach.
Jeśli pytają o zakupy — podaj konkretną listę.

AKTUALNE DANE:
${context}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find(c => c.type === 'text');
    return textContent ? textContent.text : 'Brak odpowiedzi.';
  } catch (error) {
    console.error('Agent error:', error);
    return 'Błąd połączenia z agentem. Sprawdź klucz API.';
  }
}
