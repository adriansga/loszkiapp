import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Wywołaj przez Vercel Cron: GET /api/push/send-reminders
// lub ręcznie żeby sprawdzić i wysłać zaległe
export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Pobierz wszystkie zdarzenia z przypomnieniem
  const { data: events } = await supabase
    .from('calendar_events')
    .select('*')
    .not('reminder_days', 'is', null);

  if (!events?.length) return NextResponse.json({ sent: 0 });

  const { data: subs } = await supabase.from('push_subscriptions').select('*');
  if (!subs?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;

  for (const event of events) {
    const eventDate = new Date(event.date + 'T00:00:00');
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(reminderDate.getDate() - event.reminder_days);
    reminderDate.setHours(0, 0, 0, 0);

    if (reminderDate.getTime() !== today.getTime()) continue;

    // Wyślij do właściwych subskrypcji
    const targets = subs.filter(s =>
      event.owner === 'oboje' || s.owner === event.owner
    );

    for (const sub of targets) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: `Przypomnienie: ${event.title}`,
            body: `Za ${event.reminder_days} ${event.reminder_days === 1 ? 'dzień' : 'dni'} — ${new Date(event.date + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}${event.time ? ', ' + event.time : ''}`,
            icon: '/boar.svg',
          })
        );
        sent++;
      } catch {
        // Subskrypcja wygasła — usuń
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
      }
    }
  }

  return NextResponse.json({ sent });
}
