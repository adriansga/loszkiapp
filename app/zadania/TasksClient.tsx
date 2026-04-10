'use client';

import { useState, useTransition } from 'react';
import { addTask, toggleTask, deleteTask } from './actions';
import type { Task } from './actions';

const OWNER_STYLES = {
  adrian: 'bg-blue-100 text-blue-700 border-blue-200',
  kasia: 'bg-pink-100 text-pink-700 border-pink-200',
  oboje: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};
const OWNER_LABELS = { adrian: 'Adrian', kasia: 'Kasia', oboje: 'Oboje' };
const OWNER_BADGE_BG = { adrian: 'bg-blue-50', kasia: 'bg-pink-50', oboje: 'bg-yellow-50' };

function isOverdue(task: Task) {
  if (!task.due_date || task.status === 'done') return false;
  return new Date(task.due_date) < new Date(new Date().toDateString());
}

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
}

type Filter = 'wszystkie' | 'adrian' | 'kasia';

export default function TasksClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<Filter>('wszystkie');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', assigned_to: 'oboje', due_date: '', notes: '' });
  const [, startTransition] = useTransition();

  const today = new Date().toISOString().split('T')[0];

  const filtered = tasks.filter(t => {
    if (filter === 'wszystkie') return true;
    return t.assigned_to === filter || t.assigned_to === 'oboje';
  });

  const todo = filtered.filter(t => t.status === 'todo');
  const done = filtered.filter(t => t.status === 'done');

  function handleToggle(task: Task) {
    setTasks(prev => prev.map(t =>
      t.id === task.id
        ? { ...t, status: t.status === 'todo' ? 'done' : 'todo', done_at: t.status === 'todo' ? new Date().toISOString() : null }
        : t
    ));
    startTransition(async () => {
      await toggleTask(task.id, task.status);
    });
  }

  function handleDelete(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
    startTransition(async () => {
      await deleteTask(id);
    });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const result = await addTask(form);
    if (result.task) {
      setTasks(prev => [result.task as Task, ...prev]);
      setForm({ title: '', assigned_to: 'oboje', due_date: '', notes: '' });
      setShowForm(false);
    }
  }

  function TaskCard({ task }: { task: Task }) {
    const overdue = isOverdue(task);
    return (
      <div className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 ${task.status === 'done' ? 'opacity-50' : ''}`}>
        <button
          onClick={() => handleToggle(task)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            task.status === 'done'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-zinc-300 hover:border-emerald-400'
          }`}
        >
          {task.status === 'done' && <span className="text-[10px]">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <span className={`text-sm ${task.status === 'done' ? 'line-through text-zinc-400' : 'text-zinc-800 font-medium'}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${OWNER_STYLES[task.assigned_to]}`}>
              {OWNER_LABELS[task.assigned_to]}
            </span>
            {task.due_date && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${overdue ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-500'}`}>
                {overdue ? '⚠️ ' : ''}{formatDate(task.due_date)}
              </span>
            )}
            {task.notes && <span className="text-[10px] text-zinc-400 truncate max-w-[160px]">{task.notes}</span>}
          </div>
        </div>
        <button
          onClick={() => handleDelete(task.id)}
          className="text-zinc-300 hover:text-red-400 text-sm shrink-0 mt-0.5 transition-colors"
          title="Usuń"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Zadania</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{todo.length} do zrobienia</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          + Nowe
        </button>
      </div>

      {/* Filtry */}
      <div className="flex gap-2 mb-5">
        {(['wszystkie', 'adrian', 'kasia'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? f === 'adrian' ? 'bg-blue-500 text-white' : f === 'kasia' ? 'bg-pink-500 text-white' : 'bg-zinc-800 text-white'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {f === 'wszystkie' ? 'Wszystkie' : OWNER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Formularz */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-zinc-200 p-4 mb-5">
          <p className="text-sm font-semibold text-zinc-700 mb-3">Nowe zadanie</p>
          <div className="flex flex-col gap-2">
            <input
              autoFocus
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Co trzeba zrobić? (np. Kasia kupuje chleb)"
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
            <div className="flex gap-2">
              <div className="flex gap-1">
                {(['adrian', 'kasia', 'oboje'] as const).map(o => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, assigned_to: o }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.assigned_to === o ? OWNER_STYLES[o] : 'border-zinc-200 text-zinc-500'
                    }`}
                  >
                    {OWNER_LABELS[o]}
                  </button>
                ))}
              </div>
              <input
                type="date"
                value={form.due_date}
                min={today}
                onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                className="flex-1 px-3 py-1.5 text-sm border border-zinc-200 rounded-lg"
              />
            </div>
            <input
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Notatka (opcjonalnie)"
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                Dodaj
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50">
                Anuluj
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tablice Kasia / Adrian */}
      {filter === 'wszystkie' && (todo.length > 0 || done.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['adrian', 'kasia'] as const).map(owner => {
            const ownerTodo = tasks.filter(t => t.status === 'todo' && (t.assigned_to === owner || t.assigned_to === 'oboje'));
            const ownerDone = tasks.filter(t => t.status === 'done' && (t.assigned_to === owner || t.assigned_to === 'oboje'));
            return (
              <div key={owner} className={`rounded-xl border border-zinc-200 overflow-hidden`}>
                <div className={`px-4 py-3 border-b border-zinc-100 ${OWNER_BADGE_BG[owner]}`}>
                  <p className={`text-sm font-bold ${owner === 'adrian' ? 'text-blue-700' : 'text-pink-700'}`}>
                    {OWNER_LABELS[owner]} · {ownerTodo.length} zadań
                  </p>
                </div>
                <div className="bg-white divide-y divide-zinc-100">
                  {ownerTodo.length === 0 && ownerDone.length === 0 && (
                    <p className="text-sm text-zinc-400 text-center py-6">Brak zadań</p>
                  )}
                  {ownerTodo.map(t => <TaskCard key={t.id} task={t} />)}
                  {ownerDone.length > 0 && (
                    <>
                      <div className="px-4 py-1.5 bg-zinc-50">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Zrobione</p>
                      </div>
                      {ownerDone.map(t => <TaskCard key={t.id} task={t} />)}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Widok filtrowany — lista */
        <div className="flex flex-col gap-4">
          {todo.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200">
                <p className="text-sm font-semibold text-zinc-600">Do zrobienia</p>
              </div>
              <div className="divide-y divide-zinc-100">
                {todo.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          )}
          {done.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200">
                <p className="text-sm font-semibold text-zinc-400">Zrobione ({done.length})</p>
              </div>
              <div className="divide-y divide-zinc-100">
                {done.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          )}
          {todo.length === 0 && done.length === 0 && (
            <div className="bg-white rounded-xl p-8 border border-zinc-200 text-center">
              <p className="text-3xl mb-3">✓</p>
              <p className="text-zinc-500">Brak zadań</p>
              <p className="text-sm text-zinc-400 mt-1">Dodaj pierwsze zadanie przyciskiem &ldquo;+ Nowe&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
