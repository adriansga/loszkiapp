import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { sendPushToAll } from '@/lib/push';

// Endpoint przyjmujący Supabase Database Webhook (INSERT na tabelach).
// Wywołuje push do wszystkich członków householdu.
// Webhook ustawić w Supabase Dashboard → Database → Webhooks:
//   URL: https://loszkiapp.vercel.app/api/push/notify
//   Header: Authorization: Bearer <NOTIFY_TOKEN>
//   Events: INSERT na calendar_events, pantry, tasks, notes

type SupabaseWebhookPayload = {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown> | null;
};

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const expected = process.env.NOTIFY_TOKEN;
  if (expected && auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let payload: SupabaseWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { type, table, record } = payload;
  if (type !== 'INSERT' || !record) return NextResponse.json({ ignored: true });

  const householdId = record.household_id as string | undefined;
  if (!householdId) return NextResponse.json({ ignored: true, reason: 'no household_id' });

  // Zbuduj push w zależności od tabeli
  let title = 'Wieloszki';
  let body = '';
  let url = '/';
  let tag = 'update';

  switch (table) {
    case 'calendar_events':
      title = '📅 Nowe wydarzenie';
      body = `${record.title} — ${record.date}${record.time ? ', ' + record.time : ''}`;
      url = `/kalendarz?highlight=${record.id}`;
      tag = 'calendar';
      break;
    case 'pantry':
      title = '📦 Spiżarnia';
      body = `Dodano: ${record.name}`;
      url = '/spizarnia';
      tag = 'pantry';
      break;
    case 'tasks':
      title = '✅ Nowe zadanie';
      body = `${record.title}${record.assigned_to ? ' — ' + record.assigned_to : ''}`;
      url = '/zadania';
      tag = 'tasks';
      break;
    case 'notes':
      title = '📝 Notatka';
      body = `${record.title}`;
      url = '/notatki';
      tag = 'notes';
      break;
    default:
      return NextResponse.json({ ignored: true, reason: 'unsupported table' });
  }

  await sendPushToAll({ title, body, url, tag }, { admin: true, householdId });

  return NextResponse.json({ sent: true, table, householdId });
}
