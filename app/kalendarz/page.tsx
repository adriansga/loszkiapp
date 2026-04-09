import { supabase } from '@/lib/db';
import KalendarzClient from './KalendarzClient';

export default async function KalendarzPage() {
  const { data: events } = await supabase
    .from('calendar_events')
    .select('*')
    .order('date', { ascending: true });

  return <KalendarzClient events={events ?? []} />;
}
