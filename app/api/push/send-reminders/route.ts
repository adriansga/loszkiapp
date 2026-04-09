import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import * as webpush from 'web-push';

export async function GET(req: NextRequest) {
  // Prosty token auth — zabezpieczenie przed losowymi requestami
  const token = req.nextUrl.searchParams.get('token');
  if (token !== process.env.REMINDER_TOKEN && process.env.REMINDER_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const now = new Date();

  // Pobierz wszystkie niezapisane przypomnienia + dane wydarzenia
  const { data: reminders } = await supabase
    .from('calendar_reminders')
    .select('*, calendar_events(*)')
    .is('sent_at', null);

  if (!reminders?.length) return NextResponse.json({ sent: 0 });

  const { data: subs } = await supabase.from('push_subscriptions').select('*');
  if (!subs?.length) return NextResponse.json({ sent: 0, reason: 'no subscriptions' });

  let sent = 0;

  for (const reminder of reminders) {
    const event = reminder.calendar_events as {
      id: string; title: string; date: string; time: string | null; owner: string;
    } | null;
    if (!event) continue;

    const eventTime = event.time || '09:00';
    const eventDatetime = new Date(`${event.date}T${eventTime}:00`);

    // Kiedy powinno wyjść przypomnienie
    const reminderAt = new Date(eventDatetime.getTime() - reminder.offset_minutes * 60 * 1000);

    // Wyślij jeśli: czas przypomnienia już minął (lub za mniej niż 5 min) i wydarzenie jeszcze nie minęło
    if (reminderAt > new Date(now.getTime() + 5 * 60 * 1000)) continue; // za wcześnie
    if (eventDatetime < new Date(now.getTime() - 60 * 60 * 1000)) continue; // wydarzenie minęło >1h temu

    const targets = subs.filter(s =>
      event.owner === 'oboje' || s.owner === event.owner
    );

    const offsetLabel = formatOffset(reminder.offset_minutes);
    const dateLabel = eventDatetime.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });

    for (const sub of targets) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: `🔔 ${event.title}`,
            body: `Za ${offsetLabel} — ${dateLabel}${event.time ? ', ' + event.time : ''}`,
            icon: '/boar.svg',
            url: '/kalendarz',
          })
        );
        sent++;
      } catch {
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
      }
    }

    // Oznacz jako wysłane
    await supabase.from('calendar_reminders').update({ sent_at: now.toISOString() }).eq('id', reminder.id);
  }

  return NextResponse.json({ sent, checked: reminders.length });
}

function formatOffset(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) {
    const h = Math.round(minutes / 60);
    return `${h} ${h === 1 ? 'godzinę' : h < 5 ? 'godziny' : 'godzin'}`;
  }
  const d = Math.round(minutes / 1440);
  return `${d} ${d === 1 ? 'dzień' : 'dni'}`;
}
