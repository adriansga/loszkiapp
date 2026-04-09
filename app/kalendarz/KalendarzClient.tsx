'use client';

import { useState } from 'react';
import { addEvent, deleteEvent } from './actions';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  owner: 'adrian' | 'kasia' | 'oboje';
  notes: string | null;
};

const OWNER_STYLES = {
  adrian: 'bg-blue-100 text-blue-700 border-blue-200',
  kasia: 'bg-pink-100 text-pink-700 border-pink-200',
  oboje: 'bg-purple-100 text-purple-700 border-purple-200',
};

const OWNER_LABELS = { adrian: 'Adrian', kasia: 'Kasia', oboje: 'Oboje' };

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Mon=0
}

export default function KalendarzClient({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', time: '', owner: 'adrian', notes: '' });
  const [saving, setSaving] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const monthLabel = new Date(year, month, 1).toLocaleDateString('pl-PL', {
    month: 'long',
    year: 'numeric',
  });

  function eventsForDate(dateStr: string) {
    return events.filter((e) => e.date === dateStr);
  }

  function toDateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function openModal(dateStr: string) {
    setSelectedDate(dateStr);
    setForm({ title: '', time: '', owner: 'adrian', notes: '' });
    setModal(true);
  }

  async function handleAdd() {
    if (!form.title.trim() || !selectedDate) return;
    setSaving(true);
    await addEvent({ title: form.title, date: selectedDate, time: form.time, owner: form.owner, notes: form.notes });
    setSaving(false);
    setModal(false);
  }

  async function handleDelete(id: string) {
    await deleteEvent(id);
  }

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 text-lg">‹</button>
        <h2 className="text-lg font-bold text-zinc-900 capitalize">{monthLabel}</h2>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 text-lg">›</button>
      </div>

      {/* Legenda */}
      <div className="flex gap-3 mb-4 justify-center text-xs">
        {(['adrian', 'kasia', 'oboje'] as const).map(o => (
          <span key={o} className={`px-2 py-0.5 rounded-full border font-medium ${OWNER_STYLES[o]}`}>
            {OWNER_LABELS[o]}
          </span>
        ))}
      </div>

      {/* Nagłówki dni tygodnia */}
      <div className="grid grid-cols-7 mb-1">
        {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-zinc-400 py-1">{d}</div>
        ))}
      </div>

      {/* Siatka */}
      <div className="grid grid-cols-7 gap-px bg-zinc-200 rounded-xl overflow-hidden border border-zinc-200">
        {cells.map((day, i) => {
          const dateStr = day ? toDateStr(day) : null;
          const dayEvents = dateStr ? eventsForDate(dateStr) : [];
          const isToday = dateStr === todayStr;

          return (
            <div
              key={i}
              onClick={() => day && openModal(toDateStr(day))}
              className={`bg-white min-h-[72px] p-1.5 flex flex-col cursor-pointer hover:bg-zinc-50 transition-colors ${!day ? 'opacity-0 pointer-events-none' : ''}`}
            >
              {day && (
                <>
                  <span className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-emerald-500 text-white' : 'text-zinc-700'}`}>
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={e => { e.stopPropagation(); if (confirm(`Usunąć "${ev.title}"?`)) handleDelete(ev.id); }}
                        className={`text-[10px] leading-tight px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-70 ${OWNER_STYLES[ev.owner]}`}
                        title={`${ev.title}${ev.time ? ' ' + ev.time : ''}${ev.notes ? ' — ' + ev.notes : ''}`}
                      >
                        {ev.time && <span className="opacity-60">{ev.time} </span>}
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal dodawania */}
      {modal && selectedDate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
            <h3 className="font-bold text-zinc-900 mb-4">
              Nowe wydarzenie —{' '}
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
            </h3>

            <div className="flex flex-col gap-3">
              <input
                autoFocus
                placeholder="Tytuł *"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <input
                type="time"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <div className="flex gap-2">
                {(['adrian', 'kasia', 'oboje'] as const).map(o => (
                  <button
                    key={o}
                    onClick={() => setForm(f => ({ ...f, owner: o }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${form.owner === o ? OWNER_STYLES[o] + ' font-bold' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}
                  >
                    {OWNER_LABELS[o]}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Notatka (opcjonalnie)"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-zinc-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.title.trim() || saving}
                className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-emerald-600 transition-colors"
              >
                {saving ? 'Zapisuję...' : 'Dodaj'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
